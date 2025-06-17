// app/components/WeatherDisplay.tsx
'use client';

import { useState } from 'react';
import type { CurrentWeatherResponse, FiveDayForecastResponse, ErrorResponse, ForecastListItem } from '../../../types/weather';

// Impor komponen-komponen baru
import WeatherAppLayout from './WeatherDisplay/WeatherAppLayout';
import CitySearchForm from './WeatherDisplay/CitySearchForm';
import ErrorMessage from './WeatherDisplay/ErrorMessage';
import CurrentWeatherCard from './WeatherDisplay/CurrentWeatherCard';
import ForecastSection from './WeatherDisplay/ForecastSection';

interface CombinedWeatherResponse {
  current: CurrentWeatherResponse;
  forecast: FiveDayForecastResponse;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export default function WeatherDisplay() {
  const [city, setCity] = useState<string>('');
  const [weatherData, setWeatherData] = useState<CombinedWeatherResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (unixTimestamp: number, timezoneOffset: number) => {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'UTC' });
  };

  const formatDate = (unixTimestamp: number, timezoneOffset: number) => {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', timeZone: 'UTC' });
  };

  const fetchWeatherData = async (
    query: string,
    coords?: Coordinates
  ) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    let apiUrl = '';
    if (query) {
      apiUrl = `/api/weather?city=${encodeURIComponent(query)}`;
    } else if (coords) {
      apiUrl = `/api/weather?lat=${coords.latitude}&lon=${coords.longitude}`;
    } else {
      setError('Mohon masukkan nama kota atau gunakan lokasi saat ini.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data: CombinedWeatherResponse = await response.json();
        setWeatherData(data);
      } else {
        const errorData: ErrorResponse = await response.json();
        setError(errorData.error || errorData.message || 'Terjadi kesalahan saat mengambil data cuaca.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Gagal terhubung ke server. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    setCity('');

    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung oleh browser ini.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherData('', { latitude, longitude });
      },
      (geoError) => {
        console.error("Error getting geolocation:", geoError);
        let errorMessage = 'Gagal mendapatkan lokasi Anda.';
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = "Akses lokasi ditolak. Untuk menggunakan fitur ini, mohon izinkan akses lokasi di pengaturan browser Anda, lalu coba lagi. Atau, masukkan nama kota secara manual.";
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = "Informasi lokasi tidak tersedia saat ini. Mohon coba lagi nanti atau masukkan nama kota secara manual.";
            break;
          case geoError.TIMEOUT:
            errorMessage = "Waktu habis saat mencoba mendapatkan lokasi. Mohon coba lagi atau masukkan nama kota secara manual.";
            break;
          default:
            errorMessage = "Terjadi kesalahan yang tidak diketahui saat mendapatkan lokasi. Mohon coba lagi atau masukkan nama kota secara manual.";
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeatherData(city.trim());
    } else {
      setError('Nama kota tidak boleh kosong.');
    }
  };

  const groupForecastByDay = (list: ForecastListItem[], timezoneOffset: number) => {
    const grouped: { [key: string]: ForecastListItem[] } = {};
    list.forEach(item => {
      const date = new Date((item.dt + timezoneOffset) * 1000);
      const dayKey = date.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(item);
    });
    return Object.entries(grouped);
  };

  return (
    <WeatherAppLayout>
      <h1 className="text-4xl font-bold mb-8 drop-shadow-lg text-center">Perkiraan Cuaca</h1>

      <CitySearchForm
        city={city}
        setCity={setCity}
        handleSubmit={handleSubmit}
        getCurrentLocation={getCurrentLocation}
        loading={loading}
      />

      {error && <ErrorMessage message={error} />}

      {weatherData && (
        <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl w-full max-w-5xl text-center">
          <CurrentWeatherCard
            currentWeather={weatherData.current}
            formatTime={formatTime}
          />
          <ForecastSection
            forecastData={weatherData.forecast}
            formatTime={formatTime}
            formatDate={formatDate}
            groupForecastByDay={groupForecastByDay}
          />
        </div>
      )}
    </WeatherAppLayout>
  );
}