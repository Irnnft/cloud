// app/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import VantaBackground from '@/app/VantaBackground';

export default function SearchPage() {
  const [city, setCity] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (city) {
      router.push(`/weather/${encodeURIComponent(city)}`);
    }
  };

  return (
    <>
      <VantaBackground />
      <main className="relative z-10 flex flex-col justify-center items-center min-h-screen w-full px-4">
        <div className="flex flex-col items-center text-center">
          
          {/* Judul Utama disesuaikan dengan screenshot */}
          <h1 
            className="text-6xl md:text-8xl font-bold text-white mb-4"
            style={{ textShadow: '2px 2px 10px rgba(0,0,0,0.3)' }}
          >
            Prakiraan Cuaca
          </h1>
          
          {/* Sub-judul disesuaikan dengan screenshot */}
          <p 
            className="text-lg md:text-xl text-white/90 mb-10"
            style={{ textShadow: '1px 1px 5px rgba(0,0,0,0.3)' }}
          >
            Dapatkan informasi cuaca akurat untuk kota Anda
          </p>

          {/* --- Search Bar Baru yang Menyatu --- */}
          <div className="relative w-full max-w-lg">
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Cari kota... (Contoh: Pekanbaru)"
              // Style untuk input yang lebih besar dan rounded
              className="h-14 pl-6 pr-14 rounded-full text-lg bg-white/20 text-white placeholder:text-white/70 backdrop-blur-sm border-2 border-white/30 focus-visible:ring-2 focus-visible:ring-white/50"
            />
            <Button 
              type="submit" 
              onClick={handleSearch} 
              variant="ghost" // Variant ghost agar tidak ada background
              size="icon" // Ukuran icon agar bulat
              // Posisi tombol di dalam input
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/30 hover:bg-white/50"
            >
              <Search className="h-5 w-5 text-white" />
            </Button>
          </div>
          <div className="text-center mt-2 pt-4">
          <a 
            href="https://www.instagram.com/irn.nft/"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            Dibuat oleh irn.nft
          </a>
      </div>
        </div>
      </main>
    </>
  );
}
