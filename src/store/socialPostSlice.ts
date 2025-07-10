import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface SocialPost {
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

interface SocialPostState {
    posts: SocialPost[];
    loading: boolean;
    error: string | null;
}

const initialState: SocialPostState = {
    posts: [],
    loading: false,
    error: null,
};

export const fetchSocialPosts = createAsyncThunk("socialPosts/fetch", async () => {
    const res = await fetch("https://api-rkbt.onrender.com/data");
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    return data.posts as SocialPost[];
});

const socialPostSlice = createSlice({
    name: "socialPosts",
    initialState,
    reducers: {
        reorderPosts: (state, action) => {
            state.posts = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSocialPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSocialPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchSocialPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? "Failed to load posts.";
            });
    },
});

export const { reorderPosts } = socialPostSlice.actions;

export default socialPostSlice.reducer;
