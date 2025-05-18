// import { useBoostStore } from "@/store/useBoostStore";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

export default function Lights() {
  const light = useRef<THREE.DirectionalLight>(null);
  // const { isBoosted } = useBoostStore();
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
        position={[4, 3, 0]}
        intensity={1.2}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-near={-20}
        shadow-camera-far={100}
      />
      <ambientLight intensity={1.2} />
    </>
  );
}
