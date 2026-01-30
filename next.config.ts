import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Mantém o que já existia
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Adiciona permissão para o Supabase
      },
    ],
  },
};

export default nextConfig;