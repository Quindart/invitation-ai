'use client';
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

interface FloatingHeartProps {
  id: number;
  onComplete: (id: number) => void;
}

export default function FloatingHeart({ id, onComplete }: FloatingHeartProps) {
  const [style, setStyle] = useState<{ left: string; delay: string } | null>(null);

  useEffect(() => {
    setStyle({
      left: `${Math.random() * 30 + 35}%`,
      delay: `${Math.random() * 0.3}s`,
    });
    const timer = setTimeout(() => onComplete(id), 3000);
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  if (!style) return null;

  return (
    <div
      className="animate-float-up pointer-events-none absolute bottom-32 z-50"
      style={{ left: style.left, animationDelay: style.delay }}
    >
      <Heart className="h-8 w-8 fill-red-500 text-red-500 drop-shadow-lg" />
    </div>
  );
}
