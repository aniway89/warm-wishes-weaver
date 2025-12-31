import React, { useState, useEffect, useCallback, useRef } from 'react';
import Character from './Character';
import Star from './Star';
import Heart from './Heart';
import Controls from './Controls';
import GreetingPopup from './GreetingPopup';
import CollectedLetters from './CollectedLetters';
import { useAudio } from '@/hooks/useAudio';

// Target phrase with each position tracked
const TARGET_PHRASE = "HAPPY NEW YEAR";
const LETTER_POSITIONS = TARGET_PHRASE.split('').filter(c => c !== ' ');

interface StarData {
  id: string;
  x: number;
  y: number;
  letter: string;
  letterIndex: number; // Which position in the phrase this letter is for
  collected: boolean;
  speed: number;
  swayOffset: number;
  swaySpeed: number;
}

interface HeartData {
  id: string;
  x: number;
  y: number;
  active: boolean;
}

const NewYearGreeting: React.FC = () => {
  const [characterX, setCharacterX] = useState(50);
  const [targetX, setTargetX] = useState(50);
  const [stars, setStars] = useState<StarData[]>([]);
  const [hearts, setHearts] = useState<HeartData[]>([]);
  // Track which positions (0-11) have been collected
  const [collectedPositions, setCollectedPositions] = useState<Set<number>>(new Set());
  // Queue of letter indices still needed
  const [letterQueue, setLetterQueue] = useState<number[]>(
    LETTER_POSITIONS.map((_, i) => i)
  );
  const [isComplete, setIsComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [canShoot, setCanShoot] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  
  const gameLoopRef = useRef<number>();
  const lastStarTimeRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  
  const { playPopSound, startBackgroundMusic } = useAudio();

  // Start game after a brief delay for entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setGameStarted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1000);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      startBackgroundMusic();
    }
  }, [hasInteracted, startBackgroundMusic]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleFirstInteraction();
      const key = e.key.toLowerCase();
      keysRef.current.add(key);
      
      if ((e.key === ' ' || key === 'w') && canShoot) {
        e.preventDefault();
        shootHeart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleFirstInteraction, canShoot]);

  const spawnStar = useCallback(() => {
    if (letterQueue.length === 0 || isComplete) return;
    
    // Get the next needed letter index
    const letterIndex = letterQueue[0];
    const letter = LETTER_POSITIONS[letterIndex];
    
    const newStar: StarData = {
      id: `star-${Date.now()}-${Math.random()}`,
      x: 15 + Math.random() * 70,
      y: -8,
      letter,
      letterIndex,
      collected: false,
      speed: 0.4 + Math.random() * 0.1, // Medium speed
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.015 + Math.random() * 0.01,
    };
    
    setStars(prev => [...prev, newStar]);
  }, [letterQueue, isComplete]);

  const shootHeart = useCallback(() => {
    if (!canShoot) return;
    
    handleFirstInteraction();
    setCanShoot(false);
    
    const newHeart: HeartData = {
      id: `heart-${Date.now()}`,
      x: characterX,
      y: 80,
      active: true,
    };
    setHearts(prev => [...prev, newHeart]);
  }, [characterX, handleFirstInteraction, canShoot]);

  const moveLeft = useCallback(() => {
    handleFirstInteraction();
    setTargetX(prev => Math.max(10, prev - 8));
  }, [handleFirstInteraction]);

  const moveRight = useCallback(() => {
    handleFirstInteraction();
    setTargetX(prev => Math.min(90, prev + 8));
  }, [handleFirstInteraction]);

  useEffect(() => {
    if (showPopup || !gameStarted) return;

    let frameTime = 0;
    
    const gameLoop = (timestamp: number) => {
      const delta = timestamp - frameTime;
      frameTime = timestamp;
      
      // Spawn new star periodically - only if none currently falling
      const hasActiveStar = stars.some(s => !s.collected);
      if (!hasActiveStar && letterQueue.length > 0 && timestamp - lastStarTimeRef.current > 800) {
        spawnStar();
        lastStarTimeRef.current = timestamp;
      }

      // Handle keyboard movement
      if (keysRef.current.has('a') || keysRef.current.has('arrowleft')) {
        setTargetX(prev => Math.max(10, prev - 2));
      }
      if (keysRef.current.has('d') || keysRef.current.has('arrowright')) {
        setTargetX(prev => Math.min(90, prev + 2));
      }

      // Smooth character interpolation
      setCharacterX(prev => {
        const diff = targetX - prev;
        if (Math.abs(diff) < 0.1) return targetX;
        return prev + diff * 0.15;
      });

      // Move stars with gentle sway
      setStars(prev => 
        prev
          .map(star => ({
            ...star,
            y: star.y + star.speed,
            x: star.x + Math.sin(timestamp * star.swaySpeed + star.swayOffset) * 0.08,
          }))
          .filter(star => {
            // If star missed (went off bottom), re-add to queue
            if (star.y > 95 && !star.collected) {
              setLetterQueue(q => [...q, star.letterIndex]);
              return false;
            }
            return star.y < 100 && !star.collected;
          })
      );

      // Move hearts up
      setHearts(prev => {
        const updated = prev
          .map(heart => ({
            ...heart,
            y: heart.y - 4,
          }))
          .filter(heart => {
            if (heart.y < -5) {
              setCanShoot(true);
              return false;
            }
            return true;
          });
        return updated;
      });

      // Check collisions
      setStars(prevStars => {
        let collectedIndex: number | null = null;
        let hitOccurred = false;
        
        const updatedStars = prevStars.map(star => {
          if (star.collected) return star;
          
          const hitHeart = hearts.some(heart => {
            if (!heart.active) return false;
            const dx = Math.abs(star.x - heart.x);
            const dy = Math.abs(star.y - heart.y);
            return dx < 10 && dy < 10;
          });
          
          if (hitHeart) {
            collectedIndex = star.letterIndex;
            hitOccurred = true;
            return { ...star, collected: true };
          }
          
          return star;
        });

        if (hitOccurred) {
          setCanShoot(true);
          setHearts([]);
        }

        if (collectedIndex !== null) {
          playPopSound();
          setCollectedPositions(prev => new Set([...prev, collectedIndex!]));
          setLetterQueue(q => q.slice(1));
        }

        return updatedStars.filter(s => !s.collected);
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [spawnStar, letterQueue, hearts, showPopup, playPopSound, targetX, gameStarted, stars]);

  // Check completion
  useEffect(() => {
    const allCollected = collectedPositions.size === LETTER_POSITIONS.length;
    
    if (allCollected && !isComplete) {
      setIsComplete(true);
      setTimeout(() => setShowPopup(true), 1500);
    }
  }, [collectedPositions, isComplete]);

  const handleReplay = useCallback(() => {
    setCharacterX(50);
    setTargetX(50);
    setStars([]);
    setHearts([]);
    setCollectedPositions(new Set());
    setLetterQueue(LETTER_POSITIONS.map((_, i) => i));
    setIsComplete(false);
    setShowPopup(false);
    setCanShoot(true);
    setGameStarted(false);
    lastStarTimeRef.current = 0;
    setTimeout(() => setGameStarted(true), 500);
  }, []);

  return (
    <div 
      className="h-full flex flex-col items-center justify-center overflow-hidden select-none px-4 py-6"
      style={{ backgroundColor: 'hsl(145 30% 94%)' }}
      onClick={handleFirstInteraction}
      onTouchStart={handleFirstInteraction}
    >
      {/* Centered Game Box */}
      <div 
        className="relative w-full max-w-3xl flex flex-col rounded-3xl overflow-hidden"
        style={{ 
          backgroundColor: 'hsl(40 40% 97%)',
          border: '3px solid hsl(145 35% 80%)',
          boxShadow: '0 20px 60px -15px hsl(145 30% 60% / 0.25)',
          height: 'min(70vh, 550px)',
        }}
      >
        {/* Author credit */}
        <div className="text-center pt-4 pb-2 shrink-0">
          <p className="text-sm font-medium" style={{ color: 'hsl(30 25% 50%)' }}>
            Ayaan Khan
          </p>
          <p className="text-xs font-japanese" style={{ color: 'hsl(30 20% 60%)' }}>
            アヤーン・カーン
          </p>
        </div>

        {/* Collected letters display */}
        <CollectedLetters 
          collectedPositions={collectedPositions} 
          isComplete={isComplete} 
        />

        {/* Game area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full opacity-15"
                style={{
                  width: `${50 + i * 25}px`,
                  height: `${50 + i * 25}px`,
                  left: `${10 + i * 18}%`,
                  top: `${15 + (i % 3) * 30}%`,
                  backgroundColor: i % 2 === 0 ? 'hsl(50 60% 85%)' : 'hsl(145 30% 80%)',
                  animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>

          {/* Stars */}
          {stars.map(star => (
            <Star 
              key={star.id}
              x={star.x}
              y={star.y}
              letter={star.letter}
              collected={star.collected}
            />
          ))}

          {/* Hearts */}
          {hearts.map(heart => (
            <Heart 
              key={heart.id}
              id={heart.id}
              x={heart.x}
              y={heart.y}
            />
          ))}

          {/* Character */}
          <Character x={characterX} isVisible={gameStarted} />
        </div>
      </div>

      {/* Controls - Below game box */}
      <Controls
        onLeft={moveLeft}
        onRight={moveRight}
        onShoot={shootHeart}
        isMobile={isMobile}
        canShoot={canShoot}
      />

      {/* Keyboard hint for desktop */}
      {!isMobile && !hasInteracted && (
        <div className="text-center mt-3">
          <p className="text-xs" style={{ color: 'hsl(30 20% 60%)' }}>
            Use A/D or ←/→ to move • W or Space to shoot
          </p>
        </div>
      )}

      {/* Greeting popup */}
      <GreetingPopup isVisible={showPopup} onReplay={handleReplay} />
    </div>
  );
};

export default NewYearGreeting;
