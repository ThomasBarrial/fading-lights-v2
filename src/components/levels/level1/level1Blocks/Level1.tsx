import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";

import Level1Bounds from "../Level1Bounds";
import Level1Block1 from "./Level1Block1";
import { useFrame } from "@react-three/fiber";
import Checkpoint from "../CheckPoint";
import Level1Block2 from "./Level1Block2";
import Boost from "@/components/models/Boost";
import { useBoostStore } from "@/store/useBoostStore";
// import Level1Block3 from "./Level1Block3";
import Level1Block4 from "./Level1Block4";

import Level1Block5 from "./Level1Block5";
import { useIsPlayerDied } from "@/store/useIsPlayerDied";
import { useIsMenuOpen } from "@/store/isMenuOpen";

function Level1({
  rigidBodyRef,
}: {
  rigidBodyRef: React.RefObject<RapierRigidBody | null>;
}) {
  const currentCheckpoint = useRef<string | null>(null);
  const boostStore = useBoostStore();
  const isPlayerDied = useRef(false);
  const { resetPlayerDied } = useIsPlayerDied();

  const onCheckpointactivated = (checkPointId: string) => {
    currentCheckpoint.current = checkPointId;
  };

  const { shouldRestartGame } = useIsMenuOpen();

  const checkpoints = [
    {
      name: "checkpoint1",
      position: [-1.9, 2.6, -8.8] as [number, number, number],
      size: [3.3, 0.4, 2] as [number, number, number],
      onActivate: () => onCheckpointactivated("checkpoint1"),
      lightPosition: [1.2, 1.3, 0.4] as [number, number, number],
      particlesPosition: [-0.75, 4, -8.5] as [number, number, number],
    },
    {
      name: "checkpoint2",
      position: [-2, 3.5, -22.6] as [number, number, number],
      size: [3.3, 0.4, 2] as [number, number, number],
      onActivate: () => onCheckpointactivated("checkpoint2"),
      lightPosition: [1.28, 1.1, 0.9] as [number, number, number],
      particlesPosition: [-0.75, 4.5, -21.7] as [number, number, number],
    },
    {
      name: "checkpoint3",
      position: [-1.8, 5, -48.2] as [number, number, number],
      size: [7.3, 0.4, 4] as [number, number, number],
      onActivate: () => onCheckpointactivated("checkpoint2"),
      lightPosition: [-2.5, 1.5, 0.9] as [number, number, number],
      particlesPosition: [-4.3, 6.4, -47] as [number, number, number],
    },
  ];

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    if (shouldRestartGame) {
      currentCheckpoint.current = null;
    }

    const translation = rigidBodyRef.current.translation();

    if (!currentCheckpoint.current) return;

    if (currentCheckpoint.current === "checkpoint1" && translation.y < 1) {
      rigidBodyRef.current?.setTranslation({ x: -2, y: 4, z: -9 }, true);
    }

    if (
      currentCheckpoint.current === "checkpoint2" &&
      translation.z > -85 &&
      (translation.y < 1 || isPlayerDied.current)
    ) {
      setTimeout(() => {
        resetPlayerDied();
      }, 400);
      rigidBodyRef.current?.setTranslation({ x: -2, y: 4.6, z: -23 }, true);
      isPlayerDied.current = false;

      // resetPlayerDied();
      boostStore.isBoosted = false;
      boostStore.resetBoosts();
    }
  });

  return (
    <group>
      <Level1Bounds />
      {/* Sol */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[-5, 0.4, -33]}>
          <boxGeometry args={[70, 0.2, 96]} />
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
          lightPosition={checkpoint.lightPosition}
          particlesPosition={checkpoint.particlesPosition}
          debug={false}
        />
      ))}

      <Boost
        id="boost1"
        position={[-0.3, 4, -28]}
        corruptionValue={0.1}
        lightPosition={[-0.3, 4.2, -28]}
      />
      <Boost
        id="boost2"
        position={[-3, 3, -52.5]}
        corruptionValue={0.15}
        lightPosition={[-3, 3.2, -52.5]}
      />
      <Boost
        id="boost3"
        position={[-2, 5.5, -56]}
        corruptionValue={0.17}
        lightPosition={[-2, 5.5, -56]}
      />
      {/* Blocks */}
      <Level1Block1 />
      <Level1Block2 isPlayerDied={isPlayerDied} />
      <Level1Block4 />
      <Level1Block5 />
      {/* <Level1Block3 /> */}
    </group>
  );
}

export default Level1;
