'use client';

import { useBox } from '@react-three/cannon';
import { ThreeEvent } from '@react-three/fiber';
import { BlockType } from '@/lib/types';

interface BlockProps {
  position: [number, number, number];
  type: BlockType;
  removeBlock: (position: [number, number, number]) => void;
  addBlock: (position: [number, number, number]) => void;
}

const blockColors: Record<BlockType, string> = {
  grass: '#4ade80',
  dirt: '#92400e',
  stone: '#6b7280',
  wood: '#78350f',
  sand: '#fef08a',
};

export function Block({ position, type, removeBlock, addBlock }: BlockProps) {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: [1, 1, 1],
    material: {
      friction: 0.5,
      restitution: 0,
    },
  }));

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    
    if (e.button === 0) {
      // Left click - remove block
      removeBlock(position);
    } else if (e.button === 2) {
      // Right click - add block
      const { face } = e;
      if (face) {
        const newPosition: [number, number, number] = [
          position[0] + face.normal.x,
          position[1] + face.normal.y,
          position[2] + face.normal.z,
        ];
        addBlock(newPosition);
      }
    }
  };

  return (
    <mesh
      ref={ref as any}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.stopPropagation();
        handleClick(e as any);
      }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={blockColors[type]} />
    </mesh>
  );
}
