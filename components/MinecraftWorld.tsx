'use client';

import { useState, useCallback } from 'react';
import { Block as BlockComponent } from './Block';
import { Ground } from './Ground';
import { Block, BlockType } from '@/lib/types';

interface MinecraftWorldProps {
  selectedBlock: BlockType;
}

export default function MinecraftWorld({ selectedBlock }: MinecraftWorldProps) {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    const initialBlocks: Block[] = [];
    
    // Create a small initial structure
    for (let x = -3; x <= 3; x++) {
      for (let z = -3; z <= 3; z++) {
        if (Math.random() > 0.7) {
          initialBlocks.push({
            position: [x, 0, z],
            type: 'grass',
          });
        }
      }
    }
    
    return initialBlocks;
  });

  const addBlock = useCallback((position: [number, number, number]) => {
    setBlocks((prev) => [
      ...prev,
      { position, type: selectedBlock },
    ]);
  }, [selectedBlock]);

  const removeBlock = useCallback((position: [number, number, number]) => {
    setBlocks((prev) =>
      prev.filter(
        (block) =>
          block.position[0] !== position[0] ||
          block.position[1] !== position[1] ||
          block.position[2] !== position[2]
      )
    );
  }, []);

  return (
    <>
      <Ground addBlock={addBlock} />
      {blocks.map((block, index) => (
        <BlockComponent
          key={index}
          position={block.position}
          type={block.type}
          removeBlock={removeBlock}
          addBlock={addBlock}
        />
      ))}
    </>
  );
}
