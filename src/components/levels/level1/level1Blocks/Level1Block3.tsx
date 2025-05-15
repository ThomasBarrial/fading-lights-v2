import { useGLTF } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import TreesBackground from "../env/TreesBackground";
import RocksBackground from "../env/RocksBackground";
import Spike from "@/components/models/Spike";
import { useFrame } from "@react-three/fiber";
import trees_block3 from "@/utils/level1/block3/trees_block3";
import rocks_block3 from "@/utils/level1/block3/rocks_block3";
import enableShadowsRecursively from "@/utils/enableShadowsRecursively";
import { useCurrentPerfArea } from "@/store/useCurrentPerfArea";

function Level1Block3() {
  const { scene: block3 } = useGLTF("/models/level1/level_1_block_3.gltf");
  const { scene: spike } = useGLTF("/models/plate.gltf");

  const spikesGrp1Ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (block3) {
      enableShadowsRecursively(block3);
      enableShadowsRecursively(spike);
    }
  }, [block3, spike]);

  const { perfArea } = useCurrentPerfArea();

  const spikes = useMemo(() => {
    return [
      {
        ref: React.createRef<RapierRigidBody>(),
        position: [-1.3, 3, -56] as [number, number, number],
        scale: [1.8, 1.8, 1.8] as [number, number, number],
        rotation: [-Math.PI / 2, Math.PI / 2, -Math.PI / 2] as [
          number,
          number,
          number,
        ],
        frequency: 0.7,
        phase: 0,
        min: -1.8,
        max: -0.8,
      },
      {
        ref: React.createRef<RapierRigidBody>(),
        position: [-1.3, 2.65, -58] as [number, number, number],
        scale: [1.5, 1.5, 1.5] as [number, number, number],
        rotation: [Math.PI / 2, Math.PI / 2, -Math.PI / 2] as [
          number,
          number,
          number,
        ],
        frequency: 0.8,
        phase: 2,
        min: -1.8,
        max: -0.8,
      },
      {
        ref: React.createRef<RapierRigidBody>(),
        position: [-1.3, 2.8, -61] as [number, number, number],
        scale: [1.5, 1.5, 1.7] as [number, number, number],
        rotation: [Math.PI, Math.PI / 2, -Math.PI / 2] as [
          number,
          number,
          number,
        ],
        frequency: 0.55,
        phase: 5,
        min: -1.8,
        max: -0.8,
      },
      {
        ref: React.createRef<RapierRigidBody>(),
        position: [-0.9, 3.3, -65.4] as [number, number, number],
        scale: [1.3, 0.7, 2.9] as [number, number, number],
        rotation: [Math.PI, Math.PI / 2, -Math.PI / 2] as [
          number,
          number,
          number,
        ],
        frequency: 0.55,
        phase: 5,
        min: -2,
        max: -0.9,
      },
      {
        ref: React.createRef<RapierRigidBody>(),
        position: [1, 4, -71.2] as [number, number, number],
        scale: [1.8, 1.8, 1.3] as [number, number, number],
        rotation: [Math.PI, Math.PI / 2, Math.PI / 2] as [
          number,
          number,
          number,
        ],
        frequency: 0.5,
        phase: 1,
        min: 1.5,
        max: 0.6,
      },
    ];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    spikes.forEach((spike) => {
      const { ref, min, max, frequency, phase } = spike;

      if (!ref.current) return;
      const range = max - min;
      const osc = (Math.sin(t * frequency * Math.PI * 2 + phase) + 1) / 2;
      const x = min + osc * range;

      ref.current.setTranslation(
        {
          x: x,
          y: spike.position[1],
          z: spike.position[2],
        },
        true,
      );
    });
  });

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive
          rotation={[0, Math.PI / 2, 0]}
          object={block3}
          scale={1.1}
          position={[0, 0.8, 0]}
          // visible={
          //   perfArea === "perfArea1" ||
          //   perfArea === "perfArea2" ||
          //   perfArea === "start"
          // }
        />
      </RigidBody>
      <group ref={spikesGrp1Ref}>
        {spikes.map((spikeProps, index) => (
          <Spike
            key={index}
            object={spike}
            position={spikeProps.position}
            scale={spikeProps.scale}
            rotation={spikeProps.rotation}
            ref={spikeProps.ref}
          />
        ))}
      </group>
      {/* {(perfArea === "perfArea1" ||
        perfArea === "perfArea2" ||
        perfArea === "start") && ( */}
      <>
        <TreesBackground
          minZ={-88}
          maxZ={-50}
          treesPositions={trees_block3}
          maxX={-20}
        />
        <RocksBackground
          minZ={-88}
          maxZ={-50}
          rocksPosition={rocks_block3}
          maxX={-15}
        />
      </>
      {/* )} */}
    </group>
  );
}

export default Level1Block3;

useGLTF.preload("/models/level1/level_1_block_3.gltf");
useGLTF.preload("/models/plate.gltf");
