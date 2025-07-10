"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchNews } from "@/store/newsSlice";

const NewsCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { articles, loading, error } = useSelector((state: RootState) => state.news);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  return (
    <div className="p-4 space-y-4 bg-white rounded shadow dark:bg-gray-900">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Latest Tech News</h2>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {articles.map((article, index) => (
        <a
          key={index}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 transition border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white">{article.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{article.description}</p>
          <p className="text-xs text-right text-gray-500">
            {article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}
          </p>
        </a>
      ))}
    </div>
  );
};

export default NewsCard;
