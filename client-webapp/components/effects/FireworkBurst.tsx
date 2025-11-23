'use client';

import React, { useState, useEffect } from 'react';
import FireworkParticle from './FireworkParticle';
import { motion } from 'framer-motion';

const NUM_PARTICLES = 40;
const COLORS = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C', '#FF6B6B', '#A855F7', '#EC4899'];

const random = (min: number, max: number) => Math.random() * (max - min) + min;
interface ParticleData {
  id: number;
  color: string;
  initialVelocityX: number;
  initialVelocityY: number;
  depth: number;
}

interface BurstParams {
  startX: number;
  startY: number;
  particles: ParticleData[];
}

export default function FireworkBurst({
  id,
  onComplete,
}: {
  id: number;
  onComplete: (id: number) => void;
}) {
  const [params, setParams] = useState<BurstParams | null>(null);
  useEffect(() => {
    const startX = random(10, 90);
    const startY = random(20, 50);
    const particles: ParticleData[] = Array.from({ length: NUM_PARTICLES }).map((_, i) => {
      const angle = random(0, Math.PI * 2);
      const velocity = random(2, 5);
      const depth = random(0.5, 1.5);
      return {
        id: i,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        initialVelocityX: Math.cos(angle) * velocity * depth,
        initialVelocityY: Math.sin(angle) * velocity * depth,
        depth: depth,
      };
    });
    setParams({ startX, startY, particles });
    const timer = setTimeout(() => onComplete(id), 2500);
    return () => clearTimeout(timer);
  }, [id, onComplete]);

  if (!params) return null;

  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: `${params.startX}vw`, top: `${params.startY}vh` }}
    >
      {/* Hiệu ứng chớp sáng (Flash) khi nổ */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 15, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute z-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-xl"
        style={{ width: '20px', height: '20px' }}
      />
      {/* Render các hạt */}
      {params.particles.map((p) => (
        <FireworkParticle key={p.id} {...p} />
      ))}
    </div>
  );
}
