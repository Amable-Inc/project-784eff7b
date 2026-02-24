'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { Vector3 } from 'three';

const MOVE_SPEED = 5;
const JUMP_FORCE = 8;

export default function Player() {
  const { camera } = useThree();
  
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: [0, 10, 5],
    args: [0.5],
    fixedRotation: true,
    material: {
      friction: 0.1,
      restitution: 0,
    },
    linearDamping: 0.9,
  }));

  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 10, 5]);
  const canJump = useRef(false);
  
  useEffect(() => {
    const unsubscribeVelocity = api.velocity.subscribe((v) => {
      velocity.current = v;
      // Player can jump if vertical velocity is very small (on ground)
      canJump.current = Math.abs(v[1]) < 0.5;
    });
    
    const unsubscribePosition = api.position.subscribe((p) => {
      position.current = p;
    });

    return () => {
      unsubscribeVelocity();
      unsubscribePosition();
    };
  }, [api]);

  const movement = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          movement.current.forward = true;
          break;
        case 'KeyS':
          movement.current.backward = true;
          break;
        case 'KeyA':
          movement.current.left = true;
          break;
        case 'KeyD':
          movement.current.right = true;
          break;
        case 'Space':
          movement.current.jump = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
          movement.current.forward = false;
          break;
        case 'KeyS':
          movement.current.backward = false;
          break;
        case 'KeyA':
          movement.current.left = false;
          break;
        case 'KeyD':
          movement.current.right = false;
          break;
        case 'Space':
          movement.current.jump = false;
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    camera.position.set(
      position.current[0],
      position.current[1],
      position.current[2]
    );

    const direction = new Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const right = new Vector3();
    right.crossVectors(camera.up, direction).normalize();

    const moveDirection = new Vector3();

    if (movement.current.forward) {
      moveDirection.add(direction);
    }
    if (movement.current.backward) {
      moveDirection.sub(direction);
    }
    if (movement.current.left) {
      moveDirection.add(right);
    }
    if (movement.current.right) {
      moveDirection.sub(right);
    }

    if (moveDirection.length() > 0) {
      moveDirection.normalize();
      api.velocity.set(
        moveDirection.x * MOVE_SPEED,
        velocity.current[1],
        moveDirection.z * MOVE_SPEED
      );
    } else {
      api.velocity.set(0, velocity.current[1], 0);
    }

    // Jump (only if on ground)
    if (movement.current.jump && canJump.current) {
      api.velocity.set(
        velocity.current[0],
        JUMP_FORCE,
        velocity.current[2]
      );
    }
  });

  return <mesh ref={ref as any} />;
}
