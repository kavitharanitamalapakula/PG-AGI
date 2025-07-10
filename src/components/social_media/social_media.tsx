"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchSocialPosts } from "@/store/socialPostSlice";

export default function SocialPostGrid() {
    const dispatch = useDispatch<AppDispatch>();
    const { posts, loading, error } = useSelector((state: RootState) => state.socialPosts);

    useEffect(() => {
        dispatch(fetchSocialPosts());
    }, [dispatch]);

    if (loading) return <div className="p-6 text-gray-500">Loading posts...</div>;
    if (error) return <div className="p-6 text-red-500 font-semibold">{error}</div>;
    if (!posts || posts.length === 0) return <div className="p-6 text-gray-500">No social posts available.</div>;

    return (
        <div className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {posts.map((post) => (
                <div
                    key={post.postID}
                    className="rounded-xl bg-white dark:bg-gray-900 p-4 shadow-md border border-gray-200 dark:border-gray-700"
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
            ))}
        </div>
    );
}
