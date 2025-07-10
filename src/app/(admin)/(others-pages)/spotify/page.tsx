
import SpotifyTrackGrid from "@/components/spotify_music/Spotify";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Spotify Dashboard",
  description:
    "This is the Spotify page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template, showing music recommendations.",
};

export default function Spotify() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <SpotifyTrackGrid />
        </div>
      </div>
    </div>
  );
}
