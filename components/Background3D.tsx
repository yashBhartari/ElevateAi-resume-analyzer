
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 100, 100]} scale={1.5}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
        />
      </Sphere>
    </Float>
  );
};

export const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {/* Fix: Property 'ambientLight' and 'pointLight' does not exist on type 'JSX.IntrinsicElements' by using React.createElement */}
        {React.createElement('ambientLight', { intensity: 0.5 })}
        {React.createElement('pointLight', { position: [10, 10, 10], intensity: 1 })}
        <AnimatedShape />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};
