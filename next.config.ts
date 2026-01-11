import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Cloudflare Pages compatibility
  // Note: output: 'export' is removed to support server functions
  
  // Ensure images are properly configured for Cloudflare
  images: {
    unoptimized: true, // Cloudflare handles image optimization
  },
  
  // Ensure proper output directory structure
  distDir: '.next',
};

export default nextConfig;
