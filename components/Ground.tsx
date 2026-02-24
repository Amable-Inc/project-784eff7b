'use client';

import { usePlane } from '@react-three/cannon';
import { ThreeEvent } from '@react-three/fiber';

interface GroundProps {
  addBlock: (position: [number, number, number]) => void;
}

export function Ground({ addBlock }: GroundProps) {
  const [ref] = usePlane(() => ({
    type: 'Static',
    position: [0, -0.5, 0],
    rotation: [-Math.PI / 2, 0, 0],
    material: {
      friction: 0.5,
      restitution: 0,
    },
  }));

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.button === 2) {
      // Right click - add block
      e.stopPropagation();
      const [x, y, z] = e.point.toArray();
      addBlock([Math.round(x), 0, Math.round(z)]);
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
      receiveShadow
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  );
}
