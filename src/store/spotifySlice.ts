import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Track = {
    id: string;
    name: string;
    album: {
        images: { url: string }[];
        name: string;
    };
    artists: { name: string }[];
    preview_url: string | null;
};

interface SpotifyState {
    tracks: Track[];
}

const initialState: SpotifyState = {
    tracks: [],
};

const spotifySlice = createSlice({
    name: "spotify",
    initialState,
    reducers: {
        setTracks: (state, action: PayloadAction<Track[]>) => {
            state.tracks = action.payload;
        },
    },
});

export const { setTracks } = spotifySlice.actions;
export default spotifySlice.reducer;
