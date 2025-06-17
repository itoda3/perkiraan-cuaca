// src/app/api/weather/route.ts

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
  }

  let targetQuery: string | null = null;
  let targetLat: string | null = null;
  let targetLon: string | null = null;

  if (city) {
    targetQuery = encodeURIComponent(city);
  } else if (lat && lon) {
    targetLat = lat;
    targetLon = lon;
  } else {
    return NextResponse.json({ error: 'City or coordinates (lat, lon) are required' }, { status: 400 });
  }

  try {
    let currentWeatherApiUrl = '';
    let forecastApiUrl = '';

    if (targetQuery) {
      currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${targetQuery}&appid=${apiKey}&units=metric`;
      forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${targetQuery}&appid=${apiKey}&units=metric`;
    } else if (targetLat && targetLon) {
      currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${targetLat}&lon=${targetLon}&appid=${apiKey}&units=metric`;
      forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${targetLat}&lon=${targetLon}&appid=${apiKey}&units=metric`;
    } else {
        return NextResponse.json({ error: 'Invalid query parameters.' }, { status: 400 });
    }

    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      fetch(currentWeatherApiUrl),
      fetch(forecastApiUrl)
    ]);

    if (!currentWeatherResponse.ok) {
      const errorData = await currentWeatherResponse.json();
      console.error('Error from OpenWeatherMap Current Weather:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch current weather data' },
        { status: currentWeatherResponse.status }
      );
    }
    const currentWeatherData = await currentWeatherResponse.json();

    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      console.error('Error from OpenWeatherMap Forecast:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch forecast data' },
        { status: forecastResponse.status }
      );
    }
    const forecastData = await forecastResponse.json();

    return NextResponse.json({
      current: currentWeatherData,
      forecast: forecastData
    });

  } catch (error) {
    console.error('Error in API Route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}