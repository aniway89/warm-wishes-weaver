import { useRef, useCallback } from 'react';

export const useAudio = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const bgMusicStartedRef = useRef(false);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playPopSound = useCallback(() => {
    const ctx = initAudioContext();
    if (!ctx) return;

    // Create a gentle pop sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.type = 'sine';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }, [initAudioContext]);

 

    // Ambient chord progression
    const chords = [
      [261.63, 329.63, 392.00], // C major
      [293.66, 349.23, 440.00], // D minor
      [329.63, 392.00, 493.88], // E minor
      [349.23, 440.00, 523.25], // F major
    ];

    const playLoop = () => {
      if (!audioContextRef.current) return;
      
      const now = audioContextRef.current.currentTime;
      const noteDuration = 4;
      
      chords.forEach((chord, chordIndex) => {
        chord.forEach((freq) => {
          playAmbientNote(freq, now + chordIndex * noteDuration, noteDuration);
        });
      });

      setTimeout(playLoop, chords.length * noteDuration * 1000);
    };

    playLoop();
  }, [initAudioContext]);

  return { playPopSound };
};
