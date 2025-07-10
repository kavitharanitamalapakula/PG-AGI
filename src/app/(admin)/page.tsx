"use client";

import React from "react";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import NewsCard from "@/components/NewsCard/Newscard";
import SocialTweetGrid from "@/components/social_media/social_media";
import SpotifyTrackGrid from "@/components/spotify_music/Spotify";

export default function Dashboard() {
  const loading = useAuthRedirect();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600 dark:text-gray-300">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      <div>
        <NewsCard />
      </div>
      <div>
        <SpotifyTrackGrid />
      </div>
      <div>
        <SocialTweetGrid />
      </div>
    </div>
  );
}
