// app/template.tsx
"use client";

import { motion } from 'framer-motion';

// Varian animasi yang akan digunakan
const variants = {
  hidden: { opacity: 0, y: 20 }, // Mulai dari bawah dan transparan
  enter: { opacity: 1, y: 0 },   // Muncul ke posisi normal
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="enter"
      // FIX: 'linear' adalah tipe 'ease', bukan 'type'.
      // Mengubahnya menjadi 'tween' dan menambahkan 'ease' secara terpisah.
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.5 }} // Durasi dan tipe transisi
    >
      {children}
    </motion.main>
  );
}
