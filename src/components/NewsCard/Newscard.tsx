"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchNews, reorderArticles } from "@/store/newsSlice";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const ItemType = "ARTICLE";

const DraggableArticle: React.FC<{
  article: Article;
  index: number;
  moveArticle: (dragIndex: number, hoverIndex: number) => void;
}> = ({ article, index, moveArticle }) => {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveArticle(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: article.url, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <a
      ref={ref}
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-3 transition border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700 ${isDragging ? "opacity-50" : "opacity-100"
        }`}
      style={{ cursor: "move" }}
    >
      <h3 className="font-semibold text-gray-900 dark:text-white">{article.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{article.description}</p>
      <p className="text-xs text-right text-gray-500">
        {article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}
      </p>
    </a>
  );
};

const NewsCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { articles, loading, error } = useSelector((state: RootState) => state.news);
  const [localArticles, setLocalArticles] = useState<Article[]>([]);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  useEffect(() => {
    setLocalArticles(articles);
  }, [articles]);

  const moveArticle = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedArticle = localArticles[dragIndex];
      setLocalArticles(
        update(localArticles, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, draggedArticle],
          ],
        })
      );
    },
    [localArticles]
  );

  const handleDrop = () => {
    dispatch(reorderArticles(localArticles));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 space-y-4 bg-white rounded shadow dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Latest Tech News</h2>
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {localArticles.map((article, index) => (
          <DraggableArticle key={article.url} index={index} article={article} moveArticle={moveArticle} />
        ))}
      </div>
    </DndProvider>
  );
};

export default NewsCard;
