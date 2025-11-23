'use client';

import React, { useState, useEffect, useCallback } from 'react';
import FireworkBurst from './FireworkBurst';
import { AnimatePresence } from 'framer-motion';

interface FireworksProps {
  active: boolean;
}

export default function Fireworks({ active }: FireworksProps) {
  const [bursts, setBursts] = useState<{ id: number }[]>([]);

  // Hàm xóa pháo hoa khi nổ xong
  const removeBurst = useCallback((id: number) => {
    setBursts((prev) => prev.filter((fw) => fw.id !== id));
  }, []);

  useEffect(() => {
    if (!active) {
      setBursts([]);
      return;
    }

    // Tạo nhịp điệu bắn pháo hoa
    const interval = setInterval(
      () => {
        // Giới hạn số lượng cùng lúc để không lag máy
        if (bursts.length < 6) {
          setBursts((prev) => [...prev, { id: Date.now() + Math.random() }]);
        }
      },
      Math.random() * 500 + 300,
    ); // Mỗi 0.3s - 0.8s bắn 1 quả

    return () => clearInterval(interval);
  }, [active, bursts.length]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      style={{ mixBlendMode: 'screen' }} // Làm màu sắc rực rỡ hơn trên nền tối
    >
      <AnimatePresence>
        {bursts.map((b) => (
          <FireworkBurst key={b.id} id={b.id} onComplete={removeBurst} />
        ))}
      </AnimatePresence>
    </div>
  );
}
