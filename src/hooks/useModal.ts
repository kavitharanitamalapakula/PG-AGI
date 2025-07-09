"use client";
import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { openModal, closeModal, toggleModal } from "@/store/modalSlice";

export const useModal = () => {
  const isOpen = useSelector((state: RootState) => state.modal.isOpen);
  const dispatch = useDispatch<AppDispatch>();

  const open = useCallback(() => dispatch(openModal()), [dispatch]);
  const close = useCallback(() => dispatch(closeModal()), [dispatch]);
  const toggle = useCallback(() => dispatch(toggleModal()), [dispatch]);

  return { isOpen, openModal: open, closeModal: close, toggleModal: toggle };
};
