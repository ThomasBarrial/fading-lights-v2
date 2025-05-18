import { useGLTF } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import TreesBackground from "../env/TreesBackground";
import { useFrame } from "@react-three/fiber";
import trees_block3 from "@/utils/level1/block3/trees_block3";
import enableShadowsRecursively from "@/utils/enableShadowsRecursively";
import Spike from "@/components/models/Spike";

function Level1Block3() {
  const { scene: block3 } = useGLTF(
    "/models/level1/block_3/level_1_block_3.gltf",
  );
  const { scene: spike } = useGLTF("/models/level1/block_3/plate_block3.gltf");
  const { scene: grass } = useGLTF("/models/level1/block_3/grass_block_3.gltf");
  const { scene: plants } = useGLTF(
    "/models/level1/block_3/plants_block_3.gltf",
  );
  const spikesGrp1Ref = useRef<THREE.Group>(null);

  useEffect(() => {
    if (block3) {
      enableShadowsRecursively(block3);
      enableShadowsRecursively(grass);
      enableShadowsRecursively(plants);
    }
  }, [block3, grass, plants]);

  const spikes = useMemo(() => {
    return [
      {
        ref: React.createRef<RapierRigidBody>(),
        position: [-1.3, 3, -56] as [number, number, number],
        scale: [1.2, 1.3, 1.8] as [number, number, number],
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
        position: [-1.3, 2.62, -58] as [number, number, number],
        scale: [1.2, 1.3, 1.5] as [number, number, number],
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
        scale: [1.2, 1.3, 1.7] as [number, number, number],
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
        position: [1.2, 4, -71.2] as [number, number, number],
        scale: [1.3, 1.3, 1.3] as [number, number, number],
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

      <primitive
        rotation={[0, Math.PI / 2, 0]}
        object={plants}
        scale={1.1}
        position={[0, 0.8, 0]}
      />

      <primitive
        rotation={[0, Math.PI / 2, 0]}
        object={grass}
        scale={1.1}
        position={[0, 0.8, 0]}
      />

      <TreesBackground
        minZ={-88}
        maxZ={-50}
        treesPositions={trees_block3}
        maxX={-20}
      />
    </group>
  );
}

export default Level1Block3;

useGLTF.preload("/models/level1/block_3/level_1_block_3.gltf");
useGLTF.preload("/models/level1/block_3/plate_block3.gltf");
useGLTF.preload("/models/level1/block_3/grass_block_3.gltf");
useGLTF.preload("/models/level1/block_3/plants_block_3.gltf");
