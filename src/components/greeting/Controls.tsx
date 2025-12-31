import React from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface ControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onShoot: () => void;
  isMobile: boolean;
  canShoot: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onLeft, onRight, onShoot, isMobile, canShoot }) => {
  if (!isMobile) return null;

  return (
    <div className="flex items-center justify-center gap-5 mt-5">
      <button
        onTouchStart={(e) => { e.preventDefault(); onLeft(); }}
        onClick={onLeft}
        className="w-14 h-14 flex items-center justify-center rounded-full transition-all duration-150 active:scale-90"
        style={{ 
          backgroundColor: 'hsl(40 40% 97%)',
          border: '2px solid hsl(145 35% 80%)',
          boxShadow: '0 4px 12px hsl(145 30% 60% / 0.15)',
        }}
        aria-label="Move left"
      >
        <ChevronLeft className="w-6 h-6" style={{ color: 'hsl(30 30% 45%)' }} />
      </button>
      
      <button
        onTouchStart={(e) => { e.preventDefault(); if (canShoot) onShoot(); }}
        onClick={() => { if (canShoot) onShoot(); }}
        className={`w-16 h-16 flex items-center justify-center rounded-full transition-all duration-150 ${
          canShoot ? 'active:scale-90' : 'opacity-50'
        }`}
        style={{ 
          backgroundColor: canShoot ? 'hsl(350 60% 92%)' : 'hsl(350 30% 92%)',
          border: '2px solid hsl(350 50% 80%)',
          boxShadow: canShoot ? '0 4px 12px hsl(350 40% 70% / 0.2)' : 'none',
        }}
        aria-label="Shoot"
        disabled={!canShoot}
      >
        <Heart 
          className="w-7 h-7" 
          style={{ 
            color: canShoot ? 'hsl(350 50% 60%)' : 'hsl(350 30% 70%)', 
            fill: canShoot ? 'hsl(350 60% 80%)' : 'hsl(350 30% 85%)' 
          }} 
        />
      </button>
      
      <button
        onTouchStart={(e) => { e.preventDefault(); onRight(); }}
        onClick={onRight}
        className="w-14 h-14 flex items-center justify-center rounded-full transition-all duration-150 active:scale-90"
        style={{ 
          backgroundColor: 'hsl(40 40% 97%)',
          border: '2px solid hsl(145 35% 80%)',
          boxShadow: '0 4px 12px hsl(145 30% 60% / 0.15)',
        }}
        aria-label="Move right"
      >
        <ChevronRight className="w-6 h-6" style={{ color: 'hsl(30 30% 45%)' }} />
      </button>
    </div>
  );
};

export default Controls;
