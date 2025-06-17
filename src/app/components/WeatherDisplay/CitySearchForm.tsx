// src/components/CitySearchForm.tsx
import React from 'react';

interface CitySearchFormProps {
  city: string;
  setCity: (city: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  getCurrentLocation: () => void;
  loading: boolean;
}

export default function CitySearchForm({
  city,
  setCity,
  handleSubmit,
  getCurrentLocation,
  loading,
}: CitySearchFormProps) {
  return (
    <form onSubmit={handleSubmit} className="mb-8 w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Masukkan nama kota"
        className="w-full p-3 mb-4 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={loading || !city.trim()}
      >
        {loading && city.trim() ? 'Mencari Cuaca...' : 'Cari Cuaca'}
      </button>

      <button
        type="button"
        onClick={getCurrentLocation}
        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading && !city.trim() ? 'Mendapatkan Lokasi...' : 'Dapatkan Lokasi Saat Ini'}
      </button>
    </form>
  );
}