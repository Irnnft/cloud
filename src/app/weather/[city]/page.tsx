// app/weather/[city]/page.tsx
"use client";

import {
  Sun, Cloud, CloudSun, CloudRain, CloudLightning, Snowflake, Wind, Droplets, Thermometer, Calendar, Clock, ArrowLeft, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Tipe data yang lebih lengkap untuk mencocokkan respons dari wttr.in
interface Hourly {
  time: string;
  tempC: string;
  weatherCode: string;
}

interface Daily {
  date: string;
  maxtempC: string;
  mintempC: string;
  hourly: Hourly[];
  astronomy: { sunrise: string; sunset: string }[];
}

interface WeatherData {
  current_condition: {
    temp_C: string;
    feelslike_C: string;
    humidity: string;
    windspeedKmph: string;
    weatherDesc: { value: string }[];
    weatherCode: string;
  }[];
  nearest_area: {
    areaName: { value: string }[];
    country: { value:string }[];
  }[];
  weather: Daily[];
}

// Helper function untuk memetakan weatherCode ke ikon Lucide dengan tema monokrom
const getWeatherIcon = (code: string, size: number = 24) => {
  const codeNum = parseInt(code);
  // Warna diubah menjadi nuansa abu-abu untuk tema monokrom
  switch (codeNum) {
    case 113: return <Sun size={size} className="text-neutral-800" />; // Cerah
    case 116: return <CloudSun size={size} className="text-neutral-600" />; // Setengah berawan
    case 119: return <Cloud size={size} className="text-neutral-500" />; // Berawan
    case 122: return <Cloud size={size} className="text-neutral-700" />; // Sangat berawan
    case 200: return <CloudLightning size={size} className="text-neutral-800" />; // Badai
    case 176: case 293: case 296: case 299: case 302: case 305: case 308:
      return <CloudRain size={size} className="text-neutral-700" />; // Hujan
    case 323: case 326: case 329: case 332: case 335: case 338:
      return <Snowflake size={size} className="text-neutral-600" />; // Salju
    default: return <Cloud size={size} className="text-neutral-500" />;
  }
};

// Fungsi untuk mengambil data cuaca dari wttr.in
async function getWeather(city: string): Promise<WeatherData> {
  const apiUrl = `https://wttr.in/${city}?format=j1`;
  const res = await fetch(apiUrl, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`Kota "${city}" tidak dapat ditemukan.`);
  }
  return res.json();
}

export default function WeatherPage({ params }: { params: { city: string } }) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWeather(params.city)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.city]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-white text-black">Memuat data cuaca...</div>;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100 p-4 text-neutral-800">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600">Gagal Memuat Data</h1>
          <p className="mt-2 text-neutral-600">{error || "Data tidak tersedia."}</p>
          <Link href="/" className="inline-flex items-center mt-6 px-4 py-2 bg-neutral-200 rounded-lg hover:bg-neutral-300 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Link>
        </div>
      </div>
    );
  }

  const current = data.current_condition[0];
  const today = data.weather[0];

  const todayDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{data.nearest_area[0].areaName[0].value}</h1>
            <p className="text-neutral-500">{todayDate}</p>
          </div>
          <Link href="/" className="p-2 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 transition-colors">
             <ArrowLeft size={20} />
          </Link>
        </header>

        {/* Main Current Weather */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 p-6 bg-white border border-neutral-200/80 rounded-2xl">
          <div className="flex items-center gap-4">
            {getWeatherIcon(current.weatherCode, 64)}
            <div>
              <p className="text-7xl font-extrabold">{current.temp_C}°</p>
              <p className="text-xl text-neutral-600 capitalize">{current.weatherDesc[0].value}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-4 text-center">
            <div className="flex flex-col items-center"><Thermometer size={20} className="text-neutral-500"/><span>{current.feelslike_C}°</span><span className="text-xs text-neutral-500">Terasa</span></div>
            <div className="flex flex-col items-center"><Droplets size={20} className="text-neutral-500"/><span>{current.humidity}%</span><span className="text-xs text-neutral-500">Lembap</span></div>
            <div className="flex flex-col items-center"><Wind size={20} className="text-neutral-500"/><span>{current.windspeedKmph} km/j</span><span className="text-xs text-neutral-500">Angin</span></div>
          </div>
        </section>

        {/* Hourly Forecast */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Prakiraan Per Jam</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {today.hourly.map((hour, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0 p-4 rounded-lg bg-white border border-neutral-200/80 min-w-[80px]">
                <p className="text-sm text-neutral-500">{parseInt(hour.time) / 100}:00</p>
                {getWeatherIcon(hour.weatherCode, 32)}
                <p className="text-lg font-bold">{hour.tempC}°</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3-Day Forecast */}
        <section>
          <h2 className="text-xl font-semibold mb-4">3 Hari Kedepan</h2>
          <div className="space-y-3">
            {data.weather.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white border border-neutral-200/80">
                <p className="font-medium w-1/4">{new Date(day.date).toLocaleDateString('id-ID', { weekday: 'long' })}</p>
                <div className="w-1/4 flex justify-center">
                  {getWeatherIcon(day.hourly.find(h => h.time === "1200")?.weatherCode || "119", 28)}
                </div>
                <div className="w-1/4 text-center text-neutral-500">{day.mintempC}°</div>
                <div className="w-1/4 text-right font-semibold">{day.maxtempC}°</div>
              </div>
            ))}
          </div>
        </section>

      </motion.div>
    </div>
  );
}
