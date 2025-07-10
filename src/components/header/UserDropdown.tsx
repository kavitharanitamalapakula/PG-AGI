"use client";
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ Firebase sign out
      router.replace("/signin?message=logout"); // ✅ Redirect to signin with message
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleLogout}
        className="mt-3 flex items-center gap-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-md transition duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-500"
      >
        Sign out
      </button>
    </div>
  );
}
