import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Atau 'https' jika OpenWeatherMap pindah
        hostname: 'openweathermap.org',
        port: '', // Kosongkan jika tidak ada port spesifik
        pathname: '/img/w/**', // Path spesifik jika hanya ingin mengizinkan dari path tertentu
      },
    ],
  },
};

export default nextConfig;
