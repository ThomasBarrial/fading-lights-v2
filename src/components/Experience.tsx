"use client";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { KeyboardControls } from "@react-three/drei";
import Scene from "./Scene";
import Lights from "./lights/Lights";

export default function Experience() {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
      ]}
    >
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
        <color attach="background" args={["#d6e2e9"]} />

        <Lights />
        <Suspense fallback={null}>
          <Physics gravity={[0, -12, 0]} debug>
            <Scene />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}
