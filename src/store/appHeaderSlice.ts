// src/store/slices/appHeaderSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface AppHeaderState {
    isApplicationMenuOpen: boolean;
}

const initialState: AppHeaderState = {
    isApplicationMenuOpen: false,
};

const appHeaderSlice = createSlice({
    name: "appHeader",
    initialState,
    reducers: {
        toggleApplicationMenu: (state) => {
            state.isApplicationMenuOpen = !state.isApplicationMenuOpen;
        },
        setApplicationMenuOpen: (state, action) => {
            state.isApplicationMenuOpen = action.payload;
        },
    },
});

export const {
    toggleApplicationMenu,
    setApplicationMenuOpen,
} = appHeaderSlice.actions;

export default appHeaderSlice.reducer;
