import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useMemo, useRef } from "react";

import Level1Bounds from "./Level1Bounds";
import Level1Block1 from "./level1Blocks/Level1Block1";
import { useFrame } from "@react-three/fiber";
import Checkpoint from "./CheckPoint";
import Level1Block2 from "./level1Blocks/Level1Block2";
import Boost from "@/components/models/Boost";
import { useBoostStore } from "@/store/useBoostStore";
import Level1Block3 from "./level1Blocks/Level1Block3";
import Level1Block4 from "./level1Blocks/Level1Block4";
import PerfArea from "@/components/PerfArea";
import { useCurrentPerfArea } from "@/store/useCurrentPerfArea";

function Level1({
  rigidBodyRef,
}: {
  rigidBodyRef: React.RefObject<RapierRigidBody | null>;
}) {
  const currentCheckpoint = useRef<string | null>("start");
  const boostStore = useBoostStore();
  const isPlayerDied = useRef(false);

  const onCheckpointactivated = (checkPointId: string) => {
    currentCheckpoint.current = checkPointId;
  };

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
    {
      name: "checkpoint3",
      position: [-2, 2.5, -51.3] as [number, number, number],
      size: [8, 0.4, 2] as [number, number, number],
      onActivate: () => onCheckpointactivated("checkpoint3"),
      lightPosition: [-2.1, 1.5, -0.3] as [number, number, number],
      particlesPosition: [-4.1, 4, -51.6] as [number, number, number],
    },
    {
      name: "checkpoint4",
      position: [-1.5, 5.9, -80.5] as [number, number, number],
      size: [7, 0.4, 2] as [number, number, number],
      onActivate: () => onCheckpointactivated("checkpoint4"),
      lightPosition: [-2.8, 1.2, -0.1] as [number, number, number],
      particlesPosition: [-4.3, 7, -80.6] as [number, number, number],
    },
  ];

  const perfAreas = useMemo(() => {
    return [
      {
        name: "perfArea1",
        position: [-2, 3.5, -28] as [number, number, number],
        size: [8, 8, 0.1] as [number, number, number],
        prevArea: "start",
      },
      {
        name: "perfArea2",
        position: [-2, 3.5, -65] as [number, number, number],
        size: [8, 8, 0.1] as [number, number, number],
        prevArea: "perfArea1",
      },
      {
        name: "perfArea3",
        position: [-2, 3.5, -95] as [number, number, number],
        size: [8, 8, 0.1] as [number, number, number],
        prevArea: "perfArea2",
      },
    ];
  }, []);

  const { setPerfArea } = useCurrentPerfArea();

  useFrame(() => {
    if (!rigidBodyRef.current) return;
    const translation = rigidBodyRef.current.translation();

    if (!currentCheckpoint.current) return;

    if (currentCheckpoint.current === "checkpoint1" && translation.y < 3) {
      rigidBodyRef.current?.setTranslation({ x: -2, y: 4, z: -9 }, true);
      setPerfArea("start");
    }

    if (
      currentCheckpoint.current === "checkpoint2" &&
      (translation.y < 1 || isPlayerDied.current)
    ) {
      rigidBodyRef.current?.setTranslation({ x: -2, y: 2.6, z: -23 }, true);
      isPlayerDied.current = false;
      boostStore.isBoosted = false;
      boostStore.resetBoosts();
      setPerfArea("start");
    }
    if (currentCheckpoint.current === "checkpoint3" && translation.y < 1) {
      rigidBodyRef.current?.setTranslation({ x: -2, y: 2.6, z: -51 }, true);
      isPlayerDied.current = false;
      boostStore.isBoosted = false;
      boostStore.resetBoosts();
      setPerfArea("perfArea1");
    }
    if (currentCheckpoint.current === "checkpoint4" && translation.y < 1) {
      rigidBodyRef.current?.setTranslation({ x: -2, y: 9.6, z: -80.5 }, true);
      isPlayerDied.current = false;
      boostStore.isBoosted = false;
      boostStore.resetBoosts();
      setPerfArea("perfArea2");
    }
  });

  return (
    <group>
      <Level1Bounds />
      {/* Sol */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[-5, 0.4, -66]}>
          <boxGeometry args={[70, 0.2, 160]} />
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

      {/* Perf Areas */}
      {perfAreas.map((perfArea) => (
        <PerfArea
          prevArea={perfArea.prevArea}
          name={perfArea.name}
          key={perfArea.name}
          position={perfArea.position}
        />
      ))}

      {/* boost test */}
      <Boost id="boost1" position={[-0.3, 3, -29]} corruptionValue={0.1} />
      <Boost id="boost2" position={[-3, 3, -52.5]} corruptionValue={0.15} />
      <Boost id="boost3" position={[-2, 6, -85]} corruptionValue={0.17} />

      {/* Blocks */}
      <Level1Block1 />
      <Level1Block2 isPlayerDied={isPlayerDied} />
      <Level1Block3 />
      <Level1Block4 />
    </group>
  );
}

export default Level1;
