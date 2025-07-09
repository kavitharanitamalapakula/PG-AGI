import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['example.com', 'pbs.twimg.com', 'i.scdn.co', 'instagram.fxyz1-1.fna.fbcdn.net', "i.scdn.co", 'yourdomain.com', 'cdn.social.com', 'pbs.twimg.com', 'instagram.fxyz1-1.fna.fbcdn.net',
      "6f2859a7-8667-4b05-9978-a8922e29bf1f.selstorage.ru",
      "8cd4d13f-aa75-4a0c-abdb-0f388a983964.selstorage.ru",
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};


export default nextConfig;
