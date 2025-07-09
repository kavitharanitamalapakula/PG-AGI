import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
    isOpen: boolean;
}

const initialState: ModalState = {
    isOpen: false,
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal(state) {
            state.isOpen = true;
        },
        closeModal(state) {
            state.isOpen = false;
        },
        toggleModal(state) {
            state.isOpen = !state.isOpen;
        },
        setModalState(state, action: PayloadAction<boolean>) {
            state.isOpen = action.payload;
        },
    },
});

export const { openModal, closeModal, toggleModal, setModalState } = modalSlice.actions;

export default modalSlice.reducer;
