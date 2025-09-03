import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    PORT: '3000',
  },
  images: {
    domains: [
      'i.sstatic.net',
      'res.cloudinary.com',
      'images.unsplash.com',
      'images.pexels.com',
      'images.pexels.com',
    ],
  },
};

export default nextConfig;
