'use client';

import { useEffect, useRef } from 'react';
import { Game } from '@/lib/game/Game';

export default function SpaceShooterPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 800;
      canvas.height = 600;
      
      gameRef.current = new Game(canvas);
      gameRef.current.start();
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative">
        <canvas 
          ref={canvasRef}
          className="border border-cyan-500 shadow-lg shadow-cyan-500/50"
          style={{ 
            width: '800px', 
            height: '600px',
            imageRendering: 'pixelated'
          }}
        />
        <div className="absolute top-4 left-4 text-cyan-400 font-mono text-sm">
          <div>Player 1: A/D + Space</div>
          <div>Player 2: Left/Right + Enter</div>
        </div>
      </div>
    </div>
  );
}
