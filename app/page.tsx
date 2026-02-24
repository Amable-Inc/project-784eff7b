'use client';

import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Suspense, useState, useEffect } from 'react';
import MinecraftWorld from '@/components/MinecraftWorld';
import Player from '@/components/Player';
import { BlockType } from '@/lib/types';

export default function Home() {
  const [selectedBlock, setSelectedBlock] = useState<BlockType>('grass');
  const [isLocked, setIsLocked] = useState(false);

  const blockTypes: BlockType[] = ['grass', 'dirt', 'stone', 'wood', 'sand'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) {
        setSelectedBlock(blockTypes[num - 1]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-screen h-screen relative">
      {/* UI Overlay */}
      {!isLocked && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black/80 text-white p-8 rounded-lg text-center pointer-events-auto">
            <h1 className="text-3xl font-bold mb-4">Minecraft-like Game</h1>
            <p className="mb-2">Click anywhere to start</p>
            <div className="text-sm text-gray-300 mt-4">
              <p>WASD - Move</p>
              <p>Space - Jump</p>
              <p>Mouse - Look around</p>
              <p>Left Click - Remove block</p>
              <p>Right Click - Place block</p>
              <p>1-5 - Select block type</p>
              <p>ESC - Release mouse</p>
            </div>
          </div>
        </div>
      )}

      {/* Crosshair */}
      {isLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <div className="relative w-5 h-5">
            {/* Horizontal line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white -translate-y-1/2"></div>
            {/* Vertical line */}
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white -translate-x-1/2"></div>
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      )}

      {/* Block selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {blockTypes.map((type, index) => (
          <div
            key={type}
            className={`w-12 h-12 border-2 cursor-pointer transition-all ${
              selectedBlock === type
                ? 'border-white scale-110'
                : 'border-gray-500'
            } ${
              type === 'grass'
                ? 'bg-green-600'
                : type === 'dirt'
                ? 'bg-amber-700'
                : type === 'stone'
                ? 'bg-gray-500'
                : type === 'wood'
                ? 'bg-amber-900'
                : 'bg-yellow-200'
            }`}
            onClick={() => setSelectedBlock(type)}
          >
            <div className="text-white text-xs text-center mt-1">{index + 1}</div>
          </div>
        ))}
      </div>

      {/* Current block indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-black/80 text-white px-4 py-2 rounded">
        Selected: {selectedBlock.toUpperCase()}
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ fov: 75 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[50, 50, 25]} intensity={0.8} castShadow />
        
        <Suspense fallback={null}>
          <Physics gravity={[0, -20, 0]}>
            <Player />
            <MinecraftWorld selectedBlock={selectedBlock} />
          </Physics>
        </Suspense>

        <PointerLockControls 
          onLock={() => setIsLocked(true)}
          onUnlock={() => setIsLocked(false)}
        />
      </Canvas>
    </div>
  );
}
