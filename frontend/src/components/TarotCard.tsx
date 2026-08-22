import React from 'react';
import { mysticAudio } from '../utils/mysticAudio';

interface TarotCardProps {
  mode: 'cursed' | 'blessed';
  onReveal: () => void;
  children?: React.ReactNode;
}

export const TarotCard: React.FC<TarotCardProps> = ({ mode, onReveal, children }) => {
  return (
    <div
      onMouseEnter={() => mysticAudio.playHover()}
      onClick={() => {
        mysticAudio.playReveal(mode);
        onReveal();
      }}
      className="cursor-pointer"
    >
      {children || <span>Tarot Card Content</span>}
    </div>
  );
};

export default TarotCard;
