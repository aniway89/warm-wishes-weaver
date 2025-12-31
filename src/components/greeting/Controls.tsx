import React from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface ControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onShoot: () => void;
  isMobile: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onLeft, onRight, onShoot, isMobile }) => {
  if (!isMobile) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        onTouchStart={onLeft}
        onClick={onLeft}
        className="control-button w-16 h-16 flex items-center justify-center"
        aria-label="Move left"
      >
        <ChevronLeft className="w-6 h-6" style={{ color: 'hsl(30 30% 35%)' }} />
      </button>
      
      <button
        onTouchStart={onShoot}
        onClick={onShoot}
        className="control-button w-20 h-20 flex items-center justify-center bg-pastel-pink border-destructive"
        style={{ backgroundColor: 'hsl(350 60% 90%)', borderColor: 'hsl(350 50% 80%)' }}
        aria-label="Shoot"
      >
        <Heart className="w-8 h-8" style={{ color: 'hsl(350 50% 65%)', fill: 'hsl(350 60% 80%)' }} />
      </button>
      
      <button
        onTouchStart={onRight}
        onClick={onRight}
        className="control-button w-16 h-16 flex items-center justify-center"
        aria-label="Move right"
      >
        <ChevronRight className="w-6 h-6" style={{ color: 'hsl(30 30% 35%)' }} />
      </button>
    </div>
  );
};

export default Controls;
