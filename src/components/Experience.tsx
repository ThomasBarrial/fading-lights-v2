"use client";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import Lights from "./lights/Lights";
import Charactere from "./Charactere";
import Level1 from "./levels/level1/Level1";
import { Leva, useControls } from "leva";
import GameOverOverlay from "./ui/GameOverOverlay";
import SceneLoader from "./loaders/SceneLoader";
// import PostProcessingEffects from "./effects/PostProcessingEffects";

export default function Experience() {
  const { fogColor } = useControls({
    fogColor: { value: "#D6E892" },
  });
  const rigidBodyRef = useRef(null);

  return (
    <>
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
          <color attach="background" args={["#D6E892"]} />
          <fog attach="fog" args={[fogColor, 12, 30]} />
          <OrbitControls />
          <Leva hidden />
          <Lights />
          <Suspense fallback={<SceneLoader />}>
            <Physics debug={false}>
              <Level1 rigidBodyRef={rigidBodyRef} />
              <Charactere rigidBodyRef={rigidBodyRef} />
            </Physics>
            {/* <PostProcessingEffects /> */}
          </Suspense>
        </Canvas>
      </KeyboardControls>

      <GameOverOverlay />
    </>
  );
}
