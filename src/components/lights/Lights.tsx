// import { useBoostStore } from "@/store/useBoostStore";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import React, { useRef } from "react";
import * as THREE from "three";

export default function Lights({ level = 1 }: { level?: number }) {
  const light = useRef<THREE.DirectionalLight>(null);
  const { lightColor, ambientLightIntensity } = useControls({
    lightColor: { value: "#CE9562" },
    ambientLightIntensity: { value: level === 1 ? 1.5 : 0 },
  });
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
        color={lightColor}
        ref={light}
        castShadow
        position={[1, 3, 0]}
        intensity={1}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-near={-20}
        shadow-camera-far={100}
      />
      <ambientLight intensity={ambientLightIntensity} />
    </>
  );
}
