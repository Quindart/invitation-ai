'use client';
import { motion } from 'framer-motion';

interface FireworkParticleProps {
  color: string;
  initialVelocityX: number;
  initialVelocityY: number;
  depth: number;
}

export default function FireworkParticle({
  color,
  initialVelocityX,
  initialVelocityY,
  depth,
}: FireworkParticleProps) {
  return (
    <motion.div
      initial={{
        x: 0,
        y: 0,
        opacity: 1,
        scale: 0,
      }}
      animate={{
        x: initialVelocityX * 100,
        y: initialVelocityY * 100 + 200,
        opacity: 0,
        scale: 0,
      }}
      transition={{
        duration: 1.5 + depth * 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        position: 'absolute',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 ${10 * depth}px ${2 * depth}px ${color}`,
        zIndex: Math.floor(depth * 100),
        scale: depth,
      }}
    />
  );
}
