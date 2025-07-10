// src/components/VantaBackground.tsx
"use client";

import { useEffect, useRef } from 'react';

// Mendefinisikan tipe spesifik untuk instance efek Vanta
interface VantaEffect {
  destroy: () => void;
}

// Mendefinisikan tipe untuk objek VANTA global yang dimuat dari script
interface VantaObject {
  CLOUDS: (options: {
    el: HTMLElement | null;
    THREE: any; // THREE.js dimuat secara global, jadi 'any' di sini bisa diterima
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    skyColor?: number;
    cloudColor?: number;
    cloudShadowColor?: number;
    sunColor?: number;
    sunGlareColor?: number;
    sunlightColor?: number;
    speed?: number;
  }) => VantaEffect;
}

// Memperbarui interface Window global agar TypeScript mengenali VANTA
declare global {
  interface Window {
    VANTA: VantaObject;
    THREE: any;
  }
}

const VantaBackground = () => {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect: VantaEffect | null = null;

    // Cek apakah VANTA sudah dimuat di window sebelum menggunakannya
    if (window.VANTA && vantaRef.current) {
      vantaEffect = window.VANTA.CLOUDS({
        el: vantaRef.current,
        THREE: window.THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        skyColor: 0x1a2c4a,
        cloudColor: 0x6d8dad,
        cloudShadowColor: 0x2a3d5a,
        sunColor: 0xffa500,
        sunGlareColor: 0xffd700,
        sunlightColor: 0xffa500,
        speed: 0.80
      });
    }

    // Fungsi cleanup untuk menghancurkan efek saat komponen dilepas
    // Ini penting untuk mencegah memory leak
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, []); // Array dependensi kosong memastikan efek ini hanya berjalan sekali

  return <div ref={vantaRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default VantaBackground;
