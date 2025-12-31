import React from 'react';

interface CollectedLettersProps {
  collected: Set<string>;
  isComplete: boolean;
}

const TARGET_PHRASE = "HAPPY NEW YEAR";

const CollectedLetters: React.FC<CollectedLettersProps> = ({ collected, isComplete }) => {
  return (
    <div className="flex justify-center py-2 shrink-0">
      <div 
        className={`flex items-center justify-center gap-0.5 md:gap-1 px-4 py-2 rounded-full transition-all duration-500 ${
          isComplete ? 'animate-pop-in' : ''
        }`}
        style={{ 
          backgroundColor: isComplete ? 'hsl(50 60% 92%)' : 'hsl(50 40% 95%)',
          boxShadow: isComplete ? '0 0 30px hsl(50 60% 75% / 0.5)' : 'none',
        }}
      >
        {TARGET_PHRASE.split('').map((char, index) => {
          if (char === ' ') {
            return <span key={index} className="w-2 md:w-3" />;
          }
          
          const isCollected = collected.has(char);
          
          return (
            <span
              key={index}
              className={`text-lg md:text-2xl font-bold transition-all duration-300 ${
                isCollected ? 'opacity-100 scale-100' : 'opacity-25 scale-90'
              } ${isComplete ? 'animate-shimmer' : ''}`}
              style={{ 
                color: isCollected ? 'hsl(30 30% 35%)' : 'hsl(30 20% 75%)',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {char}
            </span>
          );
        })}
        {isComplete && (
          <span className="ml-1 text-lg md:text-2xl animate-pulse-soft">✨</span>
        )}
      </div>
    </div>
  );
};

export default CollectedLetters;
