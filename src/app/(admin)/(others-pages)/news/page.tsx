import NewsCard from "@/components/NewsCard/Newscard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "News Dashboard",
  description:
    "This is the News page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template, displaying latest news content.",
};
export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="" />
      <NewsCard />
    </div>
  );
}
