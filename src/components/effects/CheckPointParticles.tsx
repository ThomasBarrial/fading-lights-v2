// CheckpointParticles.tsx
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";

export default function CheckpointParticles({
  position,
}: {
  position: [number, number, number];
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const velocities = useRef<THREE.Vector3[]>([]);
  const originRef = useRef<THREE.Mesh>(null);

  // Init particles
  useEffect(() => {
    const count = 50;
    const vels: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      vels.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          Math.random() * 1,
          (Math.random() - 0.5) * 0.5,
        ),
      );
    }
    velocities.current = vels;
  }, []);

  useFrame((_, delta) => {
    const points = particlesRef.current;
    if (!points) return;

    const origin = originRef.current?.position;
    if (origin) {
      particlesRef.current!.position.copy(origin);
    }

    const positions = points.geometry.attributes
      .position as THREE.BufferAttribute;

    for (let i = 0; i < positions.count; i++) {
      const v = velocities.current[i];
      positions.setXYZ(
        i,
        positions.getX(i) + v.x * delta,
        positions.getY(i) + v.y * delta,
        positions.getZ(i) + v.z * delta,
      );
    }

    positions.needsUpdate = true;
  });

  const count = 10;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions.set(
      [(Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5],
      i * 3,
    );
  }

  return (
    <>
      <Sparkles
        position={position}
        scale={0.5}
        size={10}
        color="#87bdff"
        count={5}
      />
      {/* <mesh ref={originRef} position={position} scale={10}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="hotpink" visible />
      </mesh> */}
    </>
  );
}
