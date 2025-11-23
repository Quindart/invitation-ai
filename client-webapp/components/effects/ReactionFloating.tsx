/* eslint-disable react-hooks/purity */
'use client';
import { motion } from 'framer-motion';
export interface ReactionItem {
  id: number;
  emoji: string;
  left: number;
  speed: number;
}

export default function ReactionFloating({
  id,
  emoji,
  left,
  speed,
  onComplete,
}: ReactionItem & { onComplete: (id: number) => void }) {
  const randomX = Math.random() * 100 - 50;

  return (
    <motion.div
      className="pointer-events-none absolute bottom-24 z-50 text-3xl drop-shadow-md select-none"
      style={{ left: `${left}%` }}
      initial={{ y: 0, opacity: 0, scale: 0.5, x: 0 }}
      animate={{
        y: -500,
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1.5, 1],
        x: [0, randomX / 2, randomX],
      }}
      transition={{
        duration: speed,
        ease: 'easeOut',
      }}
      onAnimationComplete={() => onComplete(id)}
    >
      {emoji}
    </motion.div>
  );
}
