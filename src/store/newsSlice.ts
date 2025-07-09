import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Article {
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
        name: string;
    };
}

interface NewsState {
    articles: Article[];
    loading: boolean;
    error: string | null;
}

const initialState: NewsState = {
    articles: [],
    loading: false,
    error: null,
};

// Async thunk
export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
    const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=5&apiKey=18c37be0247745b196a06665397c0089`
    );
    const data = await res.json();

    if (!data.articles) throw new Error("No articles found");
    return data.articles;
});

const newsSlice = createSlice({
    name: "news",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNews.fulfilled, (state, action: PayloadAction<Article[]>) => {
                state.articles = action.payload;
                state.loading = false;
            })
            .addCase(fetchNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch news";
            });
    },
});

export default newsSlice.reducer;
