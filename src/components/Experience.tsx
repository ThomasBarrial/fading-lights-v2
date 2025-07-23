"use client";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useRef, useState } from "react";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import Lights from "./lights/Lights";
import Charactere from "./Charactere";
import Level1 from "./levels/level1/level1Blocks/Level1";
import { Leva, useControls } from "leva";
import GameOverOverlay from "./ui/GameOverOverlay";
import SceneLoader from "./loaders/SceneLoader";
import ScreenTransition from "./ui/ScreenTransition";
import Level2 from "./levels/level2/Level2";
// import { Perf } from "r3f-perf";
import PlayerDiedOverlay from "./ui/PlayerDiedOverlay";
import ControlsOverlay from "./ui/ControlsOverlay";
import GlobalOverlay from "./ui/GlobalOverlay";
import BackgroundMusic from "./BackgroundMusic";

interface ExperienceProps {
  level: 1 | 2 | 3;
}

export default function Experience({ level }: ExperienceProps) {
  const { fogColor, fogColor2, backgroundLevel1, backgroundLevel2 } =
    useControls({
      fogColor: { value: "#D6E892" },
      fogColor2: { value: "#041b55" },
      backgroundLevel1: { value: "#D6E892" },
      backgroundLevel2: { value: "#00144e" },
    });
  const rigidBodyRef = useRef(null);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pixelRatio = window.devicePixelRatio;
      setDpr(pixelRatio > 1 ? 1.5 : 1);
    }
  }, []);

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
        <Leva />
        <Canvas
          shadows
          camera={{ fov: 45, near: 0.1, far: 100 }}
          dpr={dpr}
          gl={{
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
          }} // important
        >
          {/* <Perf /> */}

          <color
            attach="background"
            args={[level === 1 ? backgroundLevel1 : backgroundLevel2]}
          />
          {/* <fog
            attach="fog"
            args={[level === 1 ? fogColor : fogColor2, 10, 25]}
          /> */}
          <OrbitControls />
          <Lights level={level} />
          <Suspense fallback={<SceneLoader />}>
            <Physics debug={false}>
              {level === 1 && <Level1 rigidBodyRef={rigidBodyRef} />}
              {level === 2 && <Level2 rigidBodyRef={rigidBodyRef} />}
              <Charactere rigidBodyRef={rigidBodyRef} />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>
      <ScreenTransition />
      <PlayerDiedOverlay />
      <ControlsOverlay />
      <GlobalOverlay />
      <GameOverOverlay />
      <BackgroundMusic />
    </>
  );
}
