import React from 'react';

interface StarProps {
  x: number;
  y: number;
  letter: string;
  collected: boolean;
}

const Star: React.FC<StarProps> = ({ x, y, letter, collected }) => {
  if (collected) return null;

  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Bubble/star shape with letter */}
      <div className="relative animate-pulse-soft">
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          {/* Star background */}
          <path
            d="M24 4L28.9 17.8L43.6 18.3L31.9 27.6L35.9 41.7L24 33.2L12.1 41.7L16.1 27.6L4.4 18.3L19.1 17.8L24 4Z"
            fill="hsl(50 60% 90%)"
            stroke="hsl(50 50% 78%)"
            strokeWidth="2"
          />
          {/* Subtle glow */}
          <path
            d="M24 4L28.9 17.8L43.6 18.3L31.9 27.6L35.9 41.7L24 33.2L12.1 41.7L16.1 27.6L4.4 18.3L19.1 17.8L24 4Z"
            fill="none"
            stroke="hsl(50 70% 85%)"
            strokeWidth="4"
            opacity="0.3"
          />
        </svg>
        {/* Letter */}
        <span 
          className="absolute inset-0 flex items-center justify-center font-bold text-base"
          style={{ color: 'hsl(30 30% 38%)', paddingTop: '1px' }}
        >
          {letter}
        </span>
      </div>
    </div>
  );
};

export default Star;
