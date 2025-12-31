import React, { useState, useEffect, useCallback, useRef } from 'react';
import Character from './Character';
import Star from './Star';
import Heart from './Heart';
import Controls from './Controls';
import GreetingPopup from './GreetingPopup';
import CollectedLetters from './CollectedLetters';
import { useAudio } from '@/hooks/useAudio';

const REQUIRED_LETTERS = ['H', 'A', 'P', 'P', 'Y', 'N', 'E', 'W', 'Y', 'E', 'A', 'R'];
const UNIQUE_LETTERS = new Set(['H', 'A', 'P', 'Y', 'N', 'E', 'W', 'R']);

interface StarData {
  id: string;
  x: number;
  y: number;
  letter: string;
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
  const [collectedLetters, setCollectedLetters] = useState<Set<string>>(new Set());
  const [letterQueue, setLetterQueue] = useState<string[]>([...REQUIRED_LETTERS]);
  const [isComplete, setIsComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [canShoot, setCanShoot] = useState(true);
  
  const gameLoopRef = useRef<number>();
  const lastStarTimeRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const gameBoxRef = useRef<HTMLDivElement>(null);
  
  const { playPopSound, startBackgroundMusic } = useAudio();

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
    
    const letter = letterQueue[0];
    const newStar: StarData = {
      id: `star-${Date.now()}-${Math.random()}`,
      x: 15 + Math.random() * 70,
      y: -5,
      letter,
      collected: false,
      speed: 0.25 + Math.random() * 0.15,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.01,
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
    if (showPopup) return;

    let frameTime = 0;
    
    const gameLoop = (timestamp: number) => {
      const delta = timestamp - frameTime;
      frameTime = timestamp;
      
      // Spawn new star periodically
      if (timestamp - lastStarTimeRef.current > 2500 && letterQueue.length > 0) {
        spawnStar();
        lastStarTimeRef.current = timestamp;
      }

      // Handle keyboard movement - update target
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
            x: star.x + Math.sin(timestamp * star.swaySpeed + star.swayOffset) * 0.1,
          }))
          .filter(star => {
            if (star.y > 95 && !star.collected) {
              setLetterQueue(q => [...q, star.letter]);
              return false;
            }
            return star.y < 100;
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
        let letterCollected: string | null = null;
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
            letterCollected = star.letter;
            hitOccurred = true;
            return { ...star, collected: true };
          }
          
          return star;
        });

        if (hitOccurred) {
          setCanShoot(true);
          setHearts(h => h.filter(heart => {
            const hitStar = prevStars.some(star => !star.collected && 
              Math.abs(star.x - heart.x) < 10 && 
              Math.abs(star.y - heart.y) < 10
            );
            return !hitStar;
          }));
        }

        if (letterCollected) {
          playPopSound();
          setCollectedLetters(prev => new Set([...prev, letterCollected!]));
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
  }, [spawnStar, letterQueue, hearts, showPopup, playPopSound, targetX]);

  useEffect(() => {
    const hasAllLetters = Array.from(UNIQUE_LETTERS).every(letter => 
      collectedLetters.has(letter)
    );
    
    if (hasAllLetters && !isComplete) {
      setIsComplete(true);
      setTimeout(() => setShowPopup(true), 1500);
    }
  }, [collectedLetters, isComplete]);

  const handleReplay = useCallback(() => {
    setCharacterX(50);
    setTargetX(50);
    setStars([]);
    setHearts([]);
    setCollectedLetters(new Set());
    setLetterQueue([...REQUIRED_LETTERS]);
    setIsComplete(false);
    setShowPopup(false);
    setCanShoot(true);
    lastStarTimeRef.current = 0;
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
        ref={gameBoxRef}
        className="relative w-full max-w-3xl flex flex-col rounded-3xl overflow-hidden"
        style={{ 
          backgroundColor: 'hsl(40 40% 97%)',
          border: '3px solid hsl(145 35% 80%)',
          boxShadow: '0 20px 60px -15px hsl(145 30% 60% / 0.25)',
          height: 'min(75vh, 600px)',
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
        <CollectedLetters collected={collectedLetters} isComplete={isComplete} />

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
          <Character x={characterX} />
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
