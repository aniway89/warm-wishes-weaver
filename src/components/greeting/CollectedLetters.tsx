import React from 'react';

interface CollectedLettersProps {
  collectedPositions: Set<number>;
  isComplete: boolean;
}

const TARGET_PHRASE = "HAPPY NEW YEAR";

const CollectedLetters: React.FC<CollectedLettersProps> = ({ collectedPositions, isComplete }) => {
  // Map phrase to array, tracking which positions (excluding spaces) are collected
  let letterIndex = 0;
  
  return (
    <div className="flex justify-center py-3 shrink-0">
      <div 
        className={`flex items-center justify-center gap-0.5 md:gap-1 px-5 py-2.5 rounded-2xl transition-all duration-500 ${
          isComplete ? 'animate-pop-in' : ''
        }`}
        style={{ 
          backgroundColor: isComplete ? 'hsl(50 60% 92%)' : 'hsl(50 40% 96%)',
          boxShadow: isComplete ? '0 0 30px hsl(50 60% 75% / 0.5)' : '0 2px 8px hsl(145 30% 70% / 0.1)',
          border: '2px solid hsl(145 35% 85%)',
        }}
      >
        {TARGET_PHRASE.split('').map((char, charIndex) => {
          if (char === ' ') {
            return <span key={charIndex} className="w-2 md:w-3" />;
          }
          
          const currentLetterIndex = letterIndex;
          letterIndex++;
          
          const isCollected = collectedPositions.has(currentLetterIndex);
          
          return (
            <span
              key={charIndex}
              className={`text-lg md:text-2xl font-bold transition-all duration-300 ${
                isCollected ? 'opacity-100 scale-100' : 'opacity-20 scale-95'
              } ${isComplete ? 'animate-shimmer' : ''}`}
              style={{ 
                color: isCollected ? 'hsl(30 30% 35%)' : 'hsl(30 20% 80%)',
                animationDelay: `${charIndex * 0.08}s`,
                textShadow: isCollected ? '0 1px 2px hsl(30 30% 50% / 0.15)' : 'none',
              }}
            >
              {char}
            </span>
          );
        })}
        {isComplete && (
          <span className="ml-2 text-lg md:text-2xl animate-pulse-soft">✨</span>
        )}
      </div>
    </div>
  );
};

export default CollectedLetters;
