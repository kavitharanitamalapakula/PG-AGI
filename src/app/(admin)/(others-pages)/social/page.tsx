import SocialPostGrid from "@/components/social_media/social_media";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Social Dashboard",
    description:
        "This is the Social Media page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template, displaying Instagram posts.",
};

export default function Social() {
    return (
        <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="space-y-6">
                    <SocialPostGrid />
                </div>
            </div>
        </div>
    );
}
