"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setTracks } from "@/store/spotifySlice";
import { FaPlay } from "react-icons/fa";

interface Artist {
  name: string;
  uri: string;
}

interface Album {
  id: string;
  name: string;
  images: { url: string; height?: number; width?: number }[];
  artists: Artist[];
}

interface Track {
  id: string;
  name: string;
  album: {
    name: string;
    images: { url: string; height?: number; width?: number }[];
  };
  artists: Artist[];
  preview_url: string | null;
}

export default function SpotifyTrackGrid() {
  const dispatch = useDispatch<AppDispatch>();
  const tracks = useSelector((state: RootState) => state.spotify.tracks);

  useEffect(() => {
    const getSpotifyAccessToken = async () => {
      const clientId = "eebdcedb657f4cf990c0db1409bb26ec";
      const clientSecret = "2a0ccfc788384fe0ae812e721c7dcdad";

      const data = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      });

      try {
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          data,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        return response.data.access_token;
      } catch (err) {
        console.error("Token Error", err);
        return null;
      }
    };

    const fetchTracks = async () => {
      const token = await getSpotifyAccessToken();
      if (!token) return;

      try {
        const res = await axios.get(
          "https://api.spotify.com/v1/browse/new-releases?limit=20",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const albums: Album[] = res.data.albums.items;

        const allTracks: Track[] = albums.map((album) => ({
          id: album.id,
          name: album.name,
          album: {
            name: album.name,
            images: album.images,
          },
          artists: album.artists.map((artist) => ({
            name: artist.name,
            uri: artist.uri,
          })),
          preview_url: null,
        }));

        dispatch(setTracks(allTracks));
      } catch (err) {
        console.error("Fetch Error", err);
      }
    };

    fetchTracks();
  }, [dispatch]);

  const handlePlayClick = (artistUri: string) => {
    const spotifyUrl = artistUri.replace("spotify:artist:", "https://open.spotify.com/artist/");
    window.open(spotifyUrl, "_blank");
  };

  return (
    <div className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="rounded-xl bg-gray-900 p-4 text-white shadow-lg relative"
        >
          <Image
            src={track.album.images[0]?.url}
            alt={track.name}
            width={300}
            height={300}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h4 className="font-semibold">{track.name}</h4>
          <p className="text-sm text-gray-400">
            {track.artists.map((a) => a.name).join(", ")}
          </p>
          <button
            onClick={() => handlePlayClick(track.artists[0]?.uri)}
            className="mt-4 flex items-center gap-2 text-green-400 hover:text-green-300 transition"
          >
            <FaPlay className="text-sm" /> Play on Spotify
          </button>
        </div>
      ))}
    </div>
  );
}
