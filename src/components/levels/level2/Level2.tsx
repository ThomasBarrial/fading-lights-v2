import { RapierRigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import React, { useRef } from "react";
import * as THREE from "three";
import Level2Block1 from "./level2Blocks/Level2Block1";
import Checkpoint from "../level1/CheckPoint";
import { useFrame } from "@react-three/fiber";
import { useIsPlayerDied } from "@/store/useIsPlayerDied";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

function Level2({
  rigidBodyRef,
}: {
  rigidBodyRef: React.RefObject<RapierRigidBody | null>;
}) {
  const waterRef = useRef<THREE.Mesh>(null);
  const currentCheckpoint = useRef<string | null>(null);
  const { floorColor2 } = useControls({
    floorColor2: { value: "#303172" },
  });
  const isPlayerDied = useRef(false);
  const { resetPlayerDied } = useIsPlayerDied();

  const checkpoints = [
    {
      name: "checkpoint1",
      position: [-1.9, 2.5, -27] as [number, number, number],
      size: [7, 0.4, 5] as [number, number, number],
      respawnPosition: [-1.9, 3.5, -27] as [number, number, number],
      onActivate: () => onCheckpointactivated("checkpoint1"),
      lightPosition: [4, 2.4, 1.7] as [number, number, number],
      particlesPosition: [1.9, 4.8, -25.4] as [number, number, number],
    },
  ];

  const onCheckpointactivated = (checkPointId: string) => {
    currentCheckpoint.current = checkPointId;
  };

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const translation = rigidBodyRef.current.translation();

    if (translation.y < -1 || isPlayerDied.current) {
      if (currentCheckpoint.current) {
        setTimeout(() => {
          resetPlayerDied();
        }, 400);
        rigidBodyRef.current.setTranslation(
          new THREE.Vector3(...checkpoints[0].respawnPosition),
          true,
        );
        isPlayerDied.current = false;
      } else {
        rigidBodyRef.current.setTranslation(new THREE.Vector3(-1, 7, 0), true);
      }
    }
  });

  return (
    <group>
      {/* Surface d'eau */}
      {/* Checkpoints */}
      {checkpoints.map((checkpoint) => (
        <Checkpoint
          key={checkpoint.name}
          args={checkpoint.size}
          position={checkpoint.position}
          onActivate={checkpoint.onActivate}
          lightPosition={checkpoint.lightPosition}
          particlesPosition={checkpoint.particlesPosition}
          debug={true}
        />
      ))}
      <mesh ref={waterRef} receiveShadow position={[-5, 0.4, -66]}>
        <boxGeometry args={[70, , 160]} />
        <meshPhysicalMaterial
          color={floorColor2}
          transparent
          opacity={0.3}
          roughness={0}
          ior={1.33} // eau
        />
      </mesh>

      <Level2Block1 rigidBodyRef={rigidBodyRef} isPlayerDied={isPlayerDied} />
    </group>
  );
}

export default Level2;
