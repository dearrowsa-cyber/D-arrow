'use client';

import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';

function BackgroundShapes() {
  return (
    <group>
      <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.2, 64, 64]} position={[-2, 2, -5]}>
          <MeshDistortMaterial color="#FF6F4F" speed={2} distort={0.3} radius={1} />
        </Sphere>
      </Float>
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[0.8, 64, 64]} position={[2, -2, -3]}>
          <MeshDistortMaterial color="#FF4D6D" speed={4} distort={0.5} radius={1} />
        </Sphere>
      </Float>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} />
    </group>
  );
}

export default function ChatBotScene() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#0B0D1F]">
      <Canvas>
        <color attach="background" args={['#0B0D1F']} />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <BackgroundShapes />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
      </Canvas>
    </div>
  );
}
