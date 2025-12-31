import React from 'react';

interface CharacterProps {
  x: number;
}

const Character: React.FC<CharacterProps> = ({ x }) => {
  return (
    <div 
      className="absolute bottom-4 transition-all duration-100 ease-out z-20"
      style={{ left: `${x}%`, transform: 'translateX(-50%)' }}
    >
      {/* Cute sticker character - a happy little sprout */}
      <div className="relative">
        {/* Body */}
        <div className="w-16 h-16 bg-card rounded-full border-3 border-sage-dark shadow-lg relative flex items-center justify-center"
             style={{ borderWidth: '3px', borderColor: 'hsl(145 35% 75%)' }}>
          {/* Face */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Eyes */}
            <div className="absolute top-5 left-3 w-2 h-2 rounded-full bg-warm-brown"></div>
            <div className="absolute top-5 right-3 w-2 h-2 rounded-full bg-warm-brown"></div>
            {/* Blush */}
            <div className="absolute top-7 left-1 w-2.5 h-1.5 rounded-full bg-pastel-pink opacity-60"></div>
            <div className="absolute top-7 right-1 w-2.5 h-1.5 rounded-full bg-pastel-pink opacity-60"></div>
            {/* Smile */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-warm-brown rounded-b-full"></div>
          </div>
        </div>
        
        {/* Leaf on top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none" className="animate-float">
            <path 
              d="M10 0C10 0 2 8 2 14C2 20 10 24 10 24C10 24 18 20 18 14C18 8 10 0 10 0Z" 
              fill="hsl(145 40% 70%)"
              stroke="hsl(145 35% 60%)"
              strokeWidth="1.5"
            />
            <path 
              d="M10 6V20" 
              stroke="hsl(145 35% 55%)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Character;
