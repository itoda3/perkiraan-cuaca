// app/page.tsx
'use client'; // Tandai sebagai Client Component

// Import komponen WeatherDisplay dari path relatifnya
import WeatherDisplay from './components/WeatherDisplay';

export default function Home() {
  return (
    // Anda cukup merender komponen WeatherDisplay di sini
    // Semua logika cuaca, state, dan UI sudah ada di dalam WeatherDisplay
    <WeatherDisplay />
  );
}