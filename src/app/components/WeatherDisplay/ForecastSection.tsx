// src/components/ForecastSection.tsx
import React from 'react';
import type { FiveDayForecastResponse, ForecastListItem } from '../../../../types/weather';
import Image from 'next/image';
// Perhatikan: Jika Anda di React biasa (bukan Next.js), ubah Image menjadi img
// import Image from 'next/image'; // Hapus ini jika bukan Next.js

interface ForecastSectionProps {
  forecastData: FiveDayForecastResponse;
  formatTime: (unixTimestamp: number, timezoneOffset: number) => string;
  formatDate: (unixTimestamp: number, timezoneOffset: number) => string;
  groupForecastByDay: (list: ForecastListItem[], timezoneOffset: number) => [string, ForecastListItem[]][];
}

export default function ForecastSection({
  forecastData,
  formatTime,
  formatDate,
  groupForecastByDay,
}: ForecastSectionProps) {
  return (
    <>
      <h3 className="text-2xl font-semibold mt-8 mb-4 text-blue-700 text-center">
        Ramalan 5 Hari / 3 Jam
      </h3>
      {groupForecastByDay(forecastData.list, forecastData.city.timezone).map(([dateKey, dailyForecasts]) => (
        <div key={dateKey} className="mb-6 border-b pb-4 last:border-b-0">
          <h4 className="text-xl font-bold text-gray-700 mb-3 text-center">
            {formatDate(dailyForecasts[0].dt, forecastData.city.timezone)}
          </h4>
          <div className="overflow-x-auto w-full pb-2">
            <div className="flex space-x-4 justify-center">
              {dailyForecasts.map((item: ForecastListItem) => (
                <div key={item.dt} className="flex-none bg-blue-100 text-blue-800 p-3 rounded-lg text-center shadow-md min-w-[90px]">
                  <p className="text-sm font-semibold">{formatTime(item.dt, forecastData.city.timezone)}</p>
                  {/* Ubah ini dari <Image> ke <img> jika ini bukan proyek Next.js */}
                  <Image
                    src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`}
                    alt={item.weather[0].description}
                    width={48}
                    height={48}
                    className="mx-auto"
                  />
                  <p className="text-lg font-bold">{Math.round(item.main.temp)}°C</p>
                  <p className="text-xs capitalize">{item.weather[0].main}</p>
                  {item.pop > 0 && <p className="text-xs">Hujan: {Math.round(item.pop * 100)}%</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}