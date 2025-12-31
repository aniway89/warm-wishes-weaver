import React from 'react';

interface CharacterProps {
  x: number;
}

const Character: React.FC<CharacterProps> = ({ x }) => {
  return (
    <div 
      className="absolute bottom-3 z-20"
      style={{ 
        left: `${x}%`, 
        transform: 'translateX(-50%)',
        transition: 'none',
      }}
    >
      {/* Cute sticker character - a happy little sprout */}
      <div className="relative">
        {/* Body */}
        <div 
          className="w-14 h-14 rounded-full relative flex items-center justify-center"
          style={{ 
            backgroundColor: 'hsl(40 40% 97%)',
            border: '3px solid hsl(145 35% 75%)',
            boxShadow: '0 4px 12px hsl(145 30% 60% / 0.2)',
          }}
        >
          {/* Face */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Eyes */}
            <div 
              className="absolute top-4 left-3 w-2 h-2 rounded-full"
              style={{ backgroundColor: 'hsl(30 30% 35%)' }}
            />
            <div 
              className="absolute top-4 right-3 w-2 h-2 rounded-full"
              style={{ backgroundColor: 'hsl(30 30% 35%)' }}
            />
            {/* Blush */}
            <div 
              className="absolute top-6 left-1 w-2 h-1.5 rounded-full opacity-60"
              style={{ backgroundColor: 'hsl(350 60% 85%)' }}
            />
            <div 
              className="absolute top-6 right-1 w-2 h-1.5 rounded-full opacity-60"
              style={{ backgroundColor: 'hsl(350 60% 85%)' }}
            />
            {/* Smile */}
            <div 
              className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3 h-1.5 rounded-b-full"
              style={{ borderBottom: '2px solid hsl(30 30% 40%)' }}
            />
          </div>
        </div>
        
        {/* Leaf on top */}
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          <svg width="16" height="20" viewBox="0 0 20 24" fill="none" className="animate-float">
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
