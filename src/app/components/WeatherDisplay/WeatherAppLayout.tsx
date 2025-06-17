// src/components/WeatherAppLayout.tsx
import React from 'react';

interface WeatherAppLayoutProps {
  children: React.ReactNode; // Untuk menerima komponen lain sebagai children
}

export default function WeatherAppLayout({ children }: WeatherAppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 flex flex-col items-center justify-center p-4 text-white">
      {children}
    </div>
  );
}