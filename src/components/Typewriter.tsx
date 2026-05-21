import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number; // ms per char
  onComplete?: () => void;
  playTickSound?: boolean;
  key?: React.Key;
}

export default function Typewriter({ text, speed = 18, onComplete, playTickSound = true }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    let timer: any = null;

    // Direct mini tone synthesis for typewriter tick sound
    const playTick = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {
        // Suppress browser block logs
      }
    };

    const nextChar = () => {
      if (index < text.length) {
        // Don't add markup words immediately, just add characters
        setDisplayedText(prev => prev + text[index]);
        if (playTickSound && index % 2 === 0) {
          playTick();
        }
        index++;
        timer = setTimeout(nextChar, speed);
      } else {
        if (onComplete) onComplete();
      }
    };

    timer = setTimeout(nextChar, speed);

    return () => {
      clearTimeout(timer);
    };
  }, [text, speed, playTickSound, onComplete]);

  return <span>{displayedText}</span>;
}
