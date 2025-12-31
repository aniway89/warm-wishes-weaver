import React, { useState, useEffect, useCallback, useRef } from 'react';
import Character from './Character';
import Star from './Star';
import Heart from './Heart';
import Controls from './Controls';
import GreetingPopup from './GreetingPopup';
import CollectedLetters from './CollectedLetters';
import { useAudio } from '@/hooks/useAudio';

// Letters needed: H, A, P, Y, N, E, W, R (unique letters in HAPPY NEW YEAR)
const REQUIRED_LETTERS = ['H', 'A', 'P', 'P', 'Y', 'N', 'E', 'W', 'Y', 'E', 'A', 'R'];
const UNIQUE_LETTERS = new Set(['H', 'A', 'P', 'Y', 'N', 'E', 'W', 'R']);

interface StarData {
  id: string;
  x: number;
  y: number;
  letter: string;
  collected: boolean;
  speed: number;
}

interface HeartData {
  id: string;
  x: number;
  y: number;
}

const NewYearGreeting: React.FC = () => {
  const [characterX, setCharacterX] = useState(50);
  const [stars, setStars] = useState<StarData[]>([]);
  const [hearts, setHearts] = useState<HeartData[]>([]);
  const [collectedLetters, setCollectedLetters] = useState<Set<string>>(new Set());
  const [letterQueue, setLetterQueue] = useState<string[]>([...REQUIRED_LETTERS]);
  const [isComplete, setIsComplete] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const gameLoopRef = useRef<number>();
  const lastStarTimeRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  
  const { playPopSound, startBackgroundMusic } = useAudio();

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1000);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle first interaction
  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      startBackgroundMusic();
    }
  }, [hasInteracted, startBackgroundMusic]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleFirstInteraction();
      keysRef.current.add(e.key.toLowerCase());
      
      if (e.key === ' ' || e.key.toLowerCase() === 'w') {
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
  }, [handleFirstInteraction]);

  // Spawn stars
  const spawnStar = useCallback(() => {
    if (letterQueue.length === 0 || isComplete) return;
    
    const letter = letterQueue[0];
    const newStar: StarData = {
      id: `star-${Date.now()}-${Math.random()}`,
      x: 10 + Math.random() * 80,
      y: -5,
      letter,
      collected: false,
      speed: 0.3 + Math.random() * 0.2,
    };
    
    setStars(prev => [...prev, newStar]);
  }, [letterQueue, isComplete]);

  // Shoot heart
  const shootHeart = useCallback(() => {
    handleFirstInteraction();
    const newHeart: HeartData = {
      id: `heart-${Date.now()}`,
      x: characterX,
      y: 85,
    };
    setHearts(prev => [...prev, newHeart]);
  }, [characterX, handleFirstInteraction]);

  // Move controls
  const moveLeft = useCallback(() => {
    handleFirstInteraction();
    setCharacterX(prev => Math.max(5, prev - 5));
  }, [handleFirstInteraction]);

  const moveRight = useCallback(() => {
    handleFirstInteraction();
    setCharacterX(prev => Math.min(95, prev + 5));
  }, [handleFirstInteraction]);

  // Game loop
  useEffect(() => {
    if (showPopup) return;

    const gameLoop = (timestamp: number) => {
      // Spawn new star periodically
      if (timestamp - lastStarTimeRef.current > 2000 && letterQueue.length > 0) {
        spawnStar();
        lastStarTimeRef.current = timestamp;
      }

      // Handle keyboard movement
      if (keysRef.current.has('a') || keysRef.current.has('arrowleft')) {
        setCharacterX(prev => Math.max(5, prev - 1.5));
      }
      if (keysRef.current.has('d') || keysRef.current.has('arrowright')) {
        setCharacterX(prev => Math.min(95, prev + 1.5));
      }

      // Move stars down
      setStars(prev => 
        prev
          .map(star => ({
            ...star,
            y: star.y + star.speed,
          }))
          .filter(star => {
            // Remove stars that go off screen (missed)
            if (star.y > 100 && !star.collected) {
              // Re-add the missed letter to queue
              setLetterQueue(q => [...q, star.letter]);
              return false;
            }
            return star.y < 105;
          })
      );

      // Move hearts up and check collisions
      setHearts(prev => 
        prev
          .map(heart => ({
            ...heart,
            y: heart.y - 3,
          }))
          .filter(heart => heart.y > -10)
      );

      // Check heart-star collisions
      setStars(prevStars => {
        let letterCollected: string | null = null;
        
        const updatedStars = prevStars.map(star => {
          if (star.collected) return star;
          
          const hitHeart = hearts.some(heart => {
            const dx = Math.abs(star.x - heart.x);
            const dy = Math.abs(star.y - heart.y);
            return dx < 8 && dy < 8;
          });
          
          if (hitHeart) {
            letterCollected = star.letter;
            return { ...star, collected: true };
          }
          
          return star;
        });

        if (letterCollected) {
          playPopSound();
          setCollectedLetters(prev => new Set([...prev, letterCollected!]));
          setLetterQueue(q => q.slice(1));
        }

        return updatedStars;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [spawnStar, letterQueue, hearts, showPopup, playPopSound]);

  // Check completion
  useEffect(() => {
    const hasAllLetters = Array.from(UNIQUE_LETTERS).every(letter => 
      collectedLetters.has(letter)
    );
    
    if (hasAllLetters && !isComplete) {
      setIsComplete(true);
      setTimeout(() => setShowPopup(true), 1500);
    }
  }, [collectedLetters, isComplete]);

  // Reset game
  const handleReplay = useCallback(() => {
    setCharacterX(50);
    setStars([]);
    setHearts([]);
    setCollectedLetters(new Set());
    setLetterQueue([...REQUIRED_LETTERS]);
    setIsComplete(false);
    setShowPopup(false);
    lastStarTimeRef.current = 0;
  }, []);

  return (
    <div 
      className="h-full flex flex-col overflow-hidden select-none"
      onClick={handleFirstInteraction}
      onTouchStart={handleFirstInteraction}
    >
      {/* Author credit */}
      <div className="text-center pt-4 pb-2">
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

        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${40 + i * 20}px`,
                height: `${40 + i * 20}px`,
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                backgroundColor: i % 2 === 0 ? 'hsl(50 60% 85%)' : 'hsl(145 30% 80%)',
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <Controls
        onLeft={moveLeft}
        onRight={moveRight}
        onShoot={shootHeart}
        isMobile={isMobile}
      />

      {/* Keyboard hint for desktop */}
      {!isMobile && !hasInteracted && (
        <div className="text-center pb-4">
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
