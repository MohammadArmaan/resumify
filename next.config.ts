import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Wildcard for all subdomains
      },
      {
        protocol: 'https',
        hostname: 'utfs.io', 
      },
    ],
  },
};

export default nextConfig;
