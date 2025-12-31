import React from 'react';

interface GreetingPopupProps {
  isVisible: boolean;
  onReplay: () => void;
}

const GreetingPopup: React.FC<GreetingPopupProps> = ({ isVisible, onReplay }) => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-sage opacity-80"
        style={{ backgroundColor: 'hsl(145 30% 90% / 0.9)' }}
      />
      
      {/* Card */}
      <div className="greeting-card relative max-w-lg w-full p-8 animate-pop-in">
        {/* Decorative corner elements */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: 'hsl(145 35% 75%)' }} />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: 'hsl(145 35% 75%)' }} />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: 'hsl(145 35% 75%)' }} />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: 'hsl(145 35% 75%)' }} />
        
        {/* Title */}
        <h2 
          className="text-2xl md:text-3xl font-bold text-center mb-6"
          style={{ color: 'hsl(30 30% 35%)' }}
        >
          Happy New Year {currentYear} ✨
        </h2>
        
        {/* Message */}
        <div 
          className="space-y-4 text-center leading-relaxed"
          style={{ color: 'hsl(30 25% 40%)' }}
        >
          <p>
            Wishing you a beautiful beginning to this new year.
            I hope this year treats you gently
            and fills your days with growth, peace, and confidence.
          </p>
          
          <p>
            May you create memories worth holding onto,
            moments that feel unforgettable,
            and experiences you'll smile about long after the year ends.
          </p>
          
          <p>
            I hope you live this year fully,
            enjoy it deeply,
            and make this year just as meaningful —
            or even more — than the memories you created in {previousYear}. 🌿
          </p>
        </div>
        
        {/* Signature */}
        <div className="mt-8 text-right">
          <p className="text-sm" style={{ color: 'hsl(30 20% 50%)' }}>
            — Ayaan Khan
          </p>
          <p className="text-sm font-japanese" style={{ color: 'hsl(30 20% 50%)' }}>
            アヤーン・カーン
          </p>
        </div>
        
        {/* Replay button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onReplay}
            className="replay-button"
          >
            Replay Greeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default GreetingPopup;
