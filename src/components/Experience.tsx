"use client";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useRef } from "react";
import { KeyboardControls } from "@react-three/drei";
import Lights from "./lights/Lights";
import Charactere from "./Charactere";
import Level1 from "./levels/level1/level1Blocks/Level1";
import { Leva, useControls } from "leva";
import GameOverOverlay from "./ui/GameOverOverlay";
import SceneLoader from "./loaders/SceneLoader";
import ScreenTransition from "./ui/ScreenTransition";
import Level2 from "./levels/level2/Level2";
import { Perf } from "r3f-perf";

interface ExperienceProps {
  level: 1 | 2 | 3;
}

export default function Experience({ level }: ExperienceProps) {
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
        <Canvas shadows camera={{ fov: 45 }}>
          <Perf />

          <color attach="background" args={["#D6E892"]} />
          <fog attach="fog" args={[fogColor, 10, 30]} />
          {/* <OrbitControls /> */}
          <Leva hidden />
          <Lights />
          <Suspense fallback={<SceneLoader />}>
            <Physics debug={false}>
              {level === 1 && <Level1 rigidBodyRef={rigidBodyRef} />}
              {level === 2 && <Level2 />}
              <Charactere rigidBodyRef={rigidBodyRef} />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
      <ScreenTransition />
      <GameOverOverlay />
    </>
  );
}
