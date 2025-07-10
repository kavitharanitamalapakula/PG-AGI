"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setTracks, reorderTracks } from "@/store/spotifySlice";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const ItemType = "SPOTIFY_TRACK";

const DraggableTrack: React.FC<{
  track: Track;
  index: number;
  moveTrack: (dragIndex: number, hoverIndex: number) => void;
}> = ({ track, index, moveTrack }) => {
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

      moveTrack(dragIndex, hoverIndex);
      dragItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id: track.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`rounded-xl bg-gray-900 p-4 text-white shadow-lg relative ${isDragging ? "opacity-50" : "opacity-100"
        }`}
      style={{ cursor: "move" }}
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
        onClick={() => {
          const spotifyUrl = track.artists[0]?.uri.replace(
            "spotify:artist:",
            "https://open.spotify.com/artist/"
          );
          window.open(spotifyUrl, "_blank");
        }}
        className="mt-4 flex items-center gap-2 text-green-400 hover:text-green-300 transition"
      >
        <FaPlay className="text-sm" /> Play on Spotify
      </button>
    </div>
  );
};

export default function SpotifyTrackGrid() {
  const dispatch = useDispatch<AppDispatch>();
  const tracks = useSelector((state: RootState) => state.spotify.tracks);
  const [localTracks, setLocalTracks] = useState<Track[]>([]);

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

        setLocalTracks(allTracks);
        dispatch(setTracks(allTracks));
      } catch (err) {
        console.error("Fetch Error", err);
      }
    };

    fetchTracks();
  }, [dispatch]);

  const moveTrack = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedTrack = localTracks[dragIndex];
      const updatedTracks = [...localTracks];
      updatedTracks.splice(dragIndex, 1);
      updatedTracks.splice(hoverIndex, 0, draggedTrack);
      setLocalTracks(updatedTracks);
    },
    [localTracks]
  );

  const handleDrop = () => {
    dispatch(reorderTracks(localTracks));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 bg-white rounded shadow dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Latest Music</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {localTracks.map((track, index) => (
            <DraggableTrack key={track.id} index={index} track={track} moveTrack={moveTrack} />
          ))}
        </div>
      </div>
    </DndProvider >
  );
}
