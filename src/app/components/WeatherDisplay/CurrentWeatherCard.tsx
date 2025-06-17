// src/components/CurrentWeatherCard.tsx
import React from 'react';
import type { CurrentWeatherResponse } from '../../../../types/weather';
import Image from 'next/image';

interface CurrentWeatherCardProps {
  currentWeather: CurrentWeatherResponse;
  formatTime: (unixTimestamp: number, timezoneOffset: number) => string;
}

export default function CurrentWeatherCard({ currentWeather, formatTime }: CurrentWeatherCardProps) {
  return (
    <>
      <h2 className="text-3xl font-semibold mb-2">
        Cuaca Saat Ini di {currentWeather.name}, {currentWeather.sys.country}
      </h2>
      <div className="mb-6">
        {currentWeather.weather && currentWeather.weather.length > 0 && (
          <>
            <Image
              src={`http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
              alt={currentWeather.weather[0].description}
              className="mx-auto"
              width={96}
              height={96}
            />
            <p className="text-xl capitalize mb-2">{currentWeather.weather[0].description}</p>
          </>
        )}
        <p className="text-5xl font-bold mb-4">{Math.round(currentWeather.main.temp)}°C</p>
        <div className="flex justify-around text-lg">
          <p>Terasa: {Math.round(currentWeather.main.feels_like)}°C</p>
          <p>Kelembaban: {currentWeather.main.humidity}%</p>
        </div>
        <p className="text-sm mt-4">Kecepatan Angin: {currentWeather.wind.speed} m/s</p>
        <p className="text-sm">Terakhir Diperbarui: {formatTime(currentWeather.dt, currentWeather.timezone)}</p>
      </div>
    </>
  );
}