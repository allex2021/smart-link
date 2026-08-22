import React from 'react';
import { MysticParticles } from './MysticParticles';
import { motion } from 'framer-motion';
import { mysticAudio } from '../utils/mysticAudio';

interface TarotCardWrapperProps {
  mode: 'cursed' | 'blessed';
  children?: React.ReactNode;
  onClick?: () => void;
}

export const TarotCardWrapper: React.FC<TarotCardWrapperProps> = ({ mode, children, onClick }) => {
  const handleClick = () => {
    mysticAudio.playReveal(mode);
    if (onClick) onClick();
  };

  return (
    <div className="relative w-72 h-96 flex items-center justify-center">
      {/* Background Floating Dust Particles */}
      <MysticParticles mode={mode} />

      {/* Zero-Gravity Floating Card */}
      <motion.div
        onClick={handleClick}
        onMouseEnter={() => mysticAudio.playHover()}
        animate={{
          y: [0, -15, 0],
          rotateZ: [0, -1, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className={`relative z-10 w-48 h-72 rounded-2xl bg-zinc-950/80 border ${
          mode === 'cursed'
            ? 'border-red-600/40 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
            : 'border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
        } backdrop-blur-md flex items-center justify-center cursor-pointer`}
      >
        {children || (
          <span className="text-4xl select-none">{mode === 'cursed' ? '💀' : '✨'}</span>
        )}
      </motion.div>
    </div>
  );
};

export default TarotCardWrapper;
