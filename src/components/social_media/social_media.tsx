"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchSocialPosts, reorderPosts } from "@/store/socialPostSlice";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface SocialPost {
    socialType: string;
    name: string;
    image: string;
    postID: string;
    postImage: string;
    postUrl: string;
    date: string;
    likes: number;
    comments: number;
    text: string;
}

interface DragItem {
    index: number;
    id: string;
    type: string;
}

const ItemType = "SOCIAL_POST";

const DraggablePost: React.FC<{
    post: SocialPost;
    index: number;
    movePost: (dragIndex: number, hoverIndex: number) => void;
}> = ({ post, index, movePost }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
        accept: ItemType,
        hover(item: unknown, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }
            const dragItem = item as DragItem;
            const dragIndex = dragItem.index;
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

            movePost(dragIndex, hoverIndex);
            dragItem.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { id: post.postID, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`rounded-xl bg-white dark:bg-gray-900 p-4 shadow-md border border-gray-200 dark:border-gray-700 ${isDragging ? "opacity-50" : "opacity-100"
                }`}
            style={{ cursor: "move" }}
        >
            <a href={post.postUrl} target="_blank" rel="noopener noreferrer">
                <Image
                    src={post.postImage}
                    alt="Post Image Not Available"
                    loading="lazy"
                    className="rounded-lg mb-3 w-full object-cover h-60"
                    width={400}
                    height={240}
                />
            </a>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                {post.text?.length > 120 ? post.text.slice(0, 120) + "..." : post.text}
            </p>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>❤️ {post.likes?.toLocaleString?.() || 0}</span>
                <span>💬 {post.comments?.toLocaleString?.() || 0}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
                {post.date ? new Date(post.date).toLocaleDateString() : ""}
            </p>
        </div>
    );
};

export default function SocialPostGrid() {
    const dispatch = useDispatch<AppDispatch>();
    const { posts } = useSelector((state: RootState) => state.socialPosts);
    const [localPosts, setLocalPosts] = useState<SocialPost[]>([]);

    useEffect(() => {
        dispatch(fetchSocialPosts());
    }, [dispatch]);

    useEffect(() => {
        setLocalPosts(posts);
    }, [posts]);

    const movePost = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const draggedPost = localPosts[dragIndex];
            const updatedPosts = [...localPosts];
            updatedPosts.splice(dragIndex, 1);
            updatedPosts.splice(hoverIndex, 0, draggedPost);
            setLocalPosts(updatedPosts);
            dispatch(reorderPosts(updatedPosts));
        },
        [localPosts, dispatch]
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="p-4 space-y-4 bg-white rounded shadow dark:bg-gray-900">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Social Media Post</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {localPosts.map((post, index) => (
                        <DraggablePost key={post.postID} index={index} post={post} movePost={movePost} />
                    ))}
                </div>
            </div>
        </DndProvider>
    );
}
