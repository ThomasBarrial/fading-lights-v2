"use client";
import { RigidBody } from "@react-three/rapier";

export default function Scene() {
  return (
    <>
      {/* Sol */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[20, 1, 20]} />
          <meshStandardMaterial color="#a3b18a" />
        </mesh>
      </RigidBody>
      {/* Blocs décoratifs */}
      <RigidBody type="fixed">
        <mesh position={[2, 0.5, 2]} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#588157" />
        </mesh>
      </RigidBody>
      sd
      <RigidBody type="fixed">
        <mesh position={[-3, 0.5, -1]} castShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#3a5a40" />
        </mesh>
      </RigidBody>
    </>
  );
}
