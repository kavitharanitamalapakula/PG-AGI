"use client";
import Link from "next/link";
import React from "react";

export default function UserDropdown() {
  return (
    <div className="relative">
      <Link href="/signin">
        <button
          className="mt-3 flex items-center gap-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-md transition duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-500"
        >
          Sign out
        </button>
      </Link>
    </div>
  );
}
