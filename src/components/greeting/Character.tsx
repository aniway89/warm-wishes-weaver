import React from 'react';

interface CharacterProps {
  x: number;
  isVisible: boolean;
}

const Character: React.FC<CharacterProps> = ({ x, isVisible }) => {
  return (
    <div 
      className={`absolute bottom-4 z-20 transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ 
        left: `${x}%`, 
        transform: `translateX(-50%) ${isVisible ? 'scale(1)' : 'scale(0.8)'}`,
      }}
    >
      {/* Cute sticker character - happy sprout creature */}
      <div className="relative">
        {/* Shadow */}
        <div 
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-3 rounded-full opacity-20"
          style={{ backgroundColor: 'hsl(145 30% 50%)' }}
        />
        
        {/* Body */}
        <div 
          className="w-16 h-16 rounded-2xl relative flex items-center justify-center"
          style={{ 
            backgroundColor: 'hsl(40 45% 96%)',
            border: '3px solid hsl(145 38% 72%)',
            boxShadow: '0 6px 16px hsl(145 30% 55% / 0.2), inset 0 -2px 4px hsl(145 30% 85% / 0.5)',
            borderRadius: '1.25rem',
          }}
        >
          {/* Inner glow */}
          <div 
            className="absolute inset-1 rounded-xl opacity-50"
            style={{ 
              background: 'linear-gradient(180deg, hsl(50 60% 95%) 0%, transparent 50%)',
            }}
          />
          
          {/* Face container */}
          <div className="relative w-full h-full">
            {/* Eyes */}
            <div className="absolute top-4 left-3 flex flex-col items-center">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: 'hsl(30 35% 30%)' }}
              />
              {/* Eye shine */}
              <div 
                className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full"
                style={{ backgroundColor: 'hsl(0 0% 100%)' }}
              />
            </div>
            <div className="absolute top-4 right-3 flex flex-col items-center">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: 'hsl(30 35% 30%)' }}
              />
              {/* Eye shine */}
              <div 
                className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full"
                style={{ backgroundColor: 'hsl(0 0% 100%)' }}
              />
            </div>
            
            {/* Blush */}
            <div 
              className="absolute top-7 left-0.5 w-2.5 h-1.5 rounded-full opacity-50"
              style={{ backgroundColor: 'hsl(350 65% 82%)' }}
            />
            <div 
              className="absolute top-7 right-0.5 w-2.5 h-1.5 rounded-full opacity-50"
              style={{ backgroundColor: 'hsl(350 65% 82%)' }}
            />
            
            {/* Smile */}
            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2">
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path 
                  d="M1 1C1 1 4 7 7 7C10 7 13 1 13 1" 
                  stroke="hsl(30 35% 35%)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Leaf on top */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <svg width="18" height="22" viewBox="0 0 20 24" fill="none" className="animate-float">
            <path 
              d="M10 2C10 2 3 9 3 14C3 19 10 22 10 22C10 22 17 19 17 14C17 9 10 2 10 2Z" 
              fill="hsl(145 45% 68%)"
              stroke="hsl(145 40% 55%)"
              strokeWidth="1.5"
            />
            <path 
              d="M10 7V19" 
              stroke="hsl(145 40% 50%)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Leaf veins */}
            <path 
              d="M10 10L7 12" 
              stroke="hsl(145 35% 55%)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path 
              d="M10 13L13 15" 
              stroke="hsl(145 35% 55%)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        {/* Small decorative dots */}
        <div 
          className="absolute -right-1 top-3 w-1.5 h-1.5 rounded-full opacity-60"
          style={{ backgroundColor: 'hsl(50 60% 80%)' }}
        />
        <div 
          className="absolute -left-1 top-5 w-1 h-1 rounded-full opacity-50"
          style={{ backgroundColor: 'hsl(50 60% 80%)' }}
        />
      </div>
    </div>
  );
};

export default Character;
