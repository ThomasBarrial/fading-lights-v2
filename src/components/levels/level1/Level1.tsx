import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";

import TreesBackground from "./env/TreesBackground";
import RocksBackground from "./env/RocksBackground";
import GrassBackground from "./env/GrassBackground";
import Level1Bounds from "./Level1Bounds";
import Level1Block1 from "./level1Blocks/Level1Block1";
import Level1Block2 from "./level1Blocks/Level1Block2";
import { useFrame } from "@react-three/fiber";
import Checkpoint from "./CheckPoint";

function Level1({
  rigidBodyRef,
}: {
  rigidBodyRef: React.RefObject<RapierRigidBody | null>;
}) {
  const currentCheckpoint = useRef<string | null>(null);
  const onCheckpointactivated = (checkPointId: string) => {
    console.log(`Checkpoint activated with ID: ${checkPointId}`);
    currentCheckpoint.current = checkPointId;
  };

  const checkpoints = [
    {
      name: "checkpoint1",
      position: [-1.9, 2.6, -8.8] as [number, number, number],
      size: [3.3, 0.4, 2] as [number, number, number],
      onActivate: () => onCheckpointactivated("checkpoint1"),
      playerRespawn: { x: -2, y: 4, z: -8 },
    },
  ];

  useFrame(() => {
    if (!rigidBodyRef.current) return;
    const translation = rigidBodyRef.current.translation();

    if (!currentCheckpoint.current) return;

    if (
      currentCheckpoint.current === "checkpoint1" &&
      translation.y < 1 &&
      translation.z < -9
    ) {
      rigidBodyRef.current?.setTranslation({ x: -2, y: 4, z: -9 }, true);
      currentCheckpoint.current = null;
    }
  });
  return (
    <group>
      <Level1Bounds />
      {/* Sol */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, 0, -60]}>
          <boxGeometry args={[80, 1, 160]} />
          <meshStandardMaterial color={"#527650"} />
        </mesh>
      </RigidBody>

      {/* Checkpoints */}
      {checkpoints.map((checkpoint) => (
        <Checkpoint
          key={checkpoint.name}
          args={checkpoint.size}
          position={checkpoint.position}
          onActivate={checkpoint.onActivate}
          debug={false}
        />
      ))}

      {/* Blocks */}
      <Level1Block1 />
      <Level1Block2 />
      {/* Environnement */}
      <TreesBackground />
      <RocksBackground />
      <GrassBackground />
    </group>
  );
}

export default Level1;
