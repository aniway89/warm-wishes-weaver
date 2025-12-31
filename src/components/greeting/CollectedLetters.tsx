import React from 'react';

interface CollectedLettersProps {
  collected: Set<string>;
  isComplete: boolean;
}

const TARGET_PHRASE = "HAPPY NEW YEAR";

const CollectedLetters: React.FC<CollectedLettersProps> = ({ collected, isComplete }) => {
  if (!isComplete && collected.size === 0) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
      <div 
        className={`flex items-center justify-center gap-1 md:gap-2 px-4 py-2 rounded-full transition-all duration-500 ${
          isComplete ? 'animate-pop-in glow-soft' : ''
        }`}
        style={{ 
          backgroundColor: isComplete ? 'hsl(50 60% 92%)' : 'transparent'
        }}
      >
        {TARGET_PHRASE.split('').map((char, index) => {
          if (char === ' ') {
            return <span key={index} className="w-2 md:w-4" />;
          }
          
          const isCollected = collected.has(char);
          
          return (
            <span
              key={index}
              className={`text-xl md:text-3xl font-bold transition-all duration-300 ${
                isCollected ? 'opacity-100 scale-100' : 'opacity-20 scale-90'
              } ${isComplete ? 'animate-shimmer' : ''}`}
              style={{ 
                color: isCollected ? 'hsl(30 30% 35%)' : 'hsl(30 20% 70%)',
                animationDelay: `${index * 0.1}s`
              }}
            >
              {char}
            </span>
          );
        })}
        {isComplete && (
          <span className="ml-2 text-xl md:text-3xl animate-pulse-soft">✨</span>
        )}
      </div>
    </div>
  );
};

export default CollectedLetters;
