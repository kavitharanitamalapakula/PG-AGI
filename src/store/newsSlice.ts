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

console.log(process.env.NEXT_PUBLIC_NEWS_API_KEY)
// Async thunk
export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
    const res = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=5&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    );
    const data = await res.json();

    if (!data.articles) throw new Error("No articles found");
    return data.articles;
});

const newsSlice = createSlice({
    name: "news",
    initialState,
    reducers: {
        reorderArticles: (state, action: PayloadAction<Article[]>) => {
            state.articles = action.payload;
        },
    },
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

export const { reorderArticles } = newsSlice.actions;

export default newsSlice.reducer;
