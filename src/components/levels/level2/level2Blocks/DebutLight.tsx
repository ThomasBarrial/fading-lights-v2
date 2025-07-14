import React, { useRef } from "react";
import { useHelper } from "@react-three/drei";
import * as THREE from "three";

type DebugLightProps = {
  position: [number, number, number];
  color?: THREE.ColorRepresentation;
  intensity?: number;
  distance?: number;
  decay?: number;
  showHelper?: boolean;
  shadow?: boolean;
};

export default function DebugLight({
  position,
  color = "#ffffff",
  intensity = 10,
  distance = 20,
  decay = 1,
  showHelper = true,
  shadow = true,
}: DebugLightProps) {
  const lightRef = useRef<THREE.PointLight>(null!);

  // Always call useHelper to respect React Hooks rules
  useHelper(
    showHelper ? lightRef : undefined,
    THREE.PointLightHelper,
    0.5,
    "red",
  );

  return (
    <pointLight
      ref={lightRef}
      position={position}
      color={color}
      intensity={intensity}
      distance={distance}
      decay={decay}
      castShadow={shadow}
      shadow-mapSize={[512, 512]}
      shadow-bias={-0.005}
    />
  );
}
