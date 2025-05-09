import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useRef } from "react";

// import RocksBackground from "./env/RocksBackground";
// import GrassBackground from "./env/GrassBackground";
import Level1Bounds from "./Level1Bounds";
import Level1Block1 from "./level1Blocks/Level1Block1";
import { useFrame } from "@react-three/fiber";
import Checkpoint from "./CheckPoint";
import Level1Block2 from "./level1Blocks/Level1Block2";
import Boost from "@/components/models/Boost";
import { useBoostStore } from "@/store/useBoostStore";

function Level1({
  rigidBodyRef,
}: {
  rigidBodyRef: React.RefObject<RapierRigidBody | null>;
}) {
  const currentCheckpoint = useRef<string | null>("start");
  const onCheckpointactivated = (checkPointId: string) => {
    currentCheckpoint.current = checkPointId;
    setCurrentCheckpointId(checkPointId);
  };
  const boostStore = useBoostStore();
  const isPlayerDied = useRef(false);
  const [currentCheckpointId, setCurrentCheckpointId] = React.useState<
    string | null
  >("start");

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
      position: [-2, 2.5, -23.3] as [number, number, number],
      size: [3.3, 0.4, 2] as [number, number, number],
      onActivate: () => onCheckpointactivated("checkpoint2"),
      lightPosition: [1.28, 1.7, 0.65] as [number, number, number],
      particlesPosition: [-0.75, 4, -22.7] as [number, number, number],
    },
  ];

  useFrame(() => {
    if (!rigidBodyRef.current) return;
    const translation = rigidBodyRef.current.translation();

    if (!currentCheckpoint.current) return;

    if (
      currentCheckpoint.current === "checkpoint1" &&
      translation.y < 2 &&
      translation.z < -8
    ) {
      rigidBodyRef.current?.setTranslation({ x: -2, y: 4, z: -9 }, true);
    }

    if (
      currentCheckpoint.current === "checkpoint2" &&
      (translation.y < 1 || translation.z > -20 || isPlayerDied.current)
    ) {
      rigidBodyRef.current?.setTranslation({ x: -2, y: 2.6, z: -23 }, true);
      isPlayerDied.current = false;
      boostStore.isBoosted = false;
      boostStore.resetBoosts();
    }
  });

  console.log(currentCheckpointId);

  return (
    <group>
      <Level1Bounds />
      {/* Sol */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[-5, 0.4, -60]}>
          <boxGeometry args={[60, 0.2, 160]} />
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
        />
      ))}

      {/* boost test */}
      <Boost id="boost1" position={[-0.3, 3, -29]} corruptionValue={0.15} />

      {/* Blocks */}
      {/* {(currentCheckpointId === "start" ||
        currentCheckpointId === "checkpoint1") && <Level1Block1 />} */}

      <Level1Block1 />
      <Level1Block2 isPlayerDied={isPlayerDied} />
    </group>
  );
}

export default Level1;
