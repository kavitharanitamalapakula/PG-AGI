import type { Metadata } from "next";
import React from "react";
import NewsCard from "@/components/NewsCard/Newscard";
import SocialTweetGrid from "@/components/social_media/social_media";
import SpotifyTrackGrid from "@/components/spotify_music/Spotify";

export const metadata: Metadata = {
  title: "Content Dashboard",
  description: "This is Next.js Home for Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-1 gap-6">
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
