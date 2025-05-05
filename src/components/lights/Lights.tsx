import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

export default function Lights() {
  const light = useRef<THREE.DirectionalLight>(null);
  useFrame((state) => {
    if (!light.current) return;
    light.current.position.z = state.camera.position.z + 1 - 4;
    light.current.target.position.z = state.camera.position.z - 4;
    light.current.target.updateMatrixWorld();
  });
  return (
    <>
      <directionalLight
        color={"#CE9562"}
        ref={light}
        castShadow
        position={[4, 3, 1]}
        intensity={1.5}
        shadow-mapSize={[2024, 2024]}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-near={0.1}
        shadow-camera-far={100}
      />
      <ambientLight intensity={1} />
    </>
  );
}
