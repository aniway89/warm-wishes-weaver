import React from 'react';

interface GreetingPopupProps {
  isVisible: boolean;
  onReplay: () => void;
}

const GreetingPopup: React.FC<GreetingPopupProps> = ({ isVisible, onReplay }) => {
  const currentYear = new Date().getFullYear();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'hsl(145 30% 90% / 0.85)' }}
      />
      
      {/* Card */}
      <div 
        className="relative max-w-lg w-full p-6 md:p-8 animate-pop-in rounded-3xl"
        style={{ 
          backgroundColor: 'hsl(40 40% 98%)',
          border: '3px solid hsl(145 35% 80%)',
          boxShadow: '0 25px 60px -15px hsl(145 30% 50% / 0.3)',
        }}
      >
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: 'hsl(145 35% 75%)' }} />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: 'hsl(145 35% 75%)' }} />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: 'hsl(145 35% 75%)' }} />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: 'hsl(145 35% 75%)' }} />
        
        {/* Title */}
        <h2 
          className="text-xl md:text-2xl font-bold text-center mb-5"
          style={{ color: 'hsl(30 30% 35%)' }}
        >
          Happy New Year {currentYear} ✨
        </h2>
        
        {/* Message */}
        <div 
          className="space-y-3 text-center leading-relaxed text-sm md:text-base"
          style={{ color: 'hsl(30 25% 42%)' }}
        >
          <p>
            Wishing you a beautiful beginning to this new year.
            I hope this year treats you gently
            and fills your days with growth, peace, and confidence.
          </p>
          
          <p>
            May you create unforgettable memories,
            enjoy every moment deeply,
            and make this year just as meaningful —
            or even more — than the memories you created last year. 🌿
          </p>
        </div>
        
        {/* Signature */}
        <div className="mt-6 text-right">
          <p className="text-sm" style={{ color: 'hsl(30 20% 52%)' }}>
            — Ayaan Khan
          </p>
          <p className="text-sm font-japanese" style={{ color: 'hsl(30 20% 52%)' }}>
            アヤーン・カーン
          </p>
        </div>
        
        {/* Replay button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onReplay}
            className="px-6 py-2.5 rounded-full font-medium transition-all duration-200 active:scale-95 hover:scale-105"
            style={{ 
              backgroundColor: 'hsl(40 40% 97%)',
              border: '2px solid hsl(145 35% 75%)',
              color: 'hsl(30 30% 40%)',
              boxShadow: '0 4px 12px hsl(145 30% 60% / 0.15)',
            }}
          >
            Replay Greeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default GreetingPopup;
