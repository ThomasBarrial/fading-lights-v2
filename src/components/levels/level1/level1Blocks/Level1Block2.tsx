import { useGLTF } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { RefObject, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import TreesBackground from "../env/TreesBackground";
import trees_block2 from "@/utils/level1/block2/trees_block2";
import enableShadowsRecursively from "@/utils/enableShadowsRecursively";
import { useIsPlayerDied } from "@/store/useIsPlayerDied";

type BarConfig = {
  ref: React.RefObject<RapierRigidBody | null>;
  node: THREE.Object3D;
  min: number;
  max: number;
  z: number;
  frequency: number;
  phase: number;
};

function Level1Block2({ isPlayerDied }: { isPlayerDied: RefObject<boolean> }) {
  const { scene: block2, nodes } = useGLTF(
    "/models/level1/block_2/level_1_block_2.gltf",
  );
  const { scene: grass } = useGLTF("/models/level1/block_2/grass_block_2.gltf");

  const { scene: plantsGrass } = useGLTF(
    "/models/level1/block_2/plants_block_2.gltf",
  );

  const { markAsPlayerDied } = useIsPlayerDied();

  useEffect(() => {
    if (block2) {
      enableShadowsRecursively(block2);
      enableShadowsRecursively(plantsGrass);
      enableShadowsRecursively(grass);
    }
  }, [block2, grass, plantsGrass]);

  const bars: BarConfig[] = useMemo(() => {
    return [
      {
        ref: React.createRef<RapierRigidBody>(),
        node: nodes.bar1_obs_2,
        min: -0.3,
        max: -1.9,
        z: -31.8,
        frequency: 0.4,
        phase: 0,
      },
      {
        ref: React.createRef<RapierRigidBody>(),
        node: nodes.bar2_obs_2,
        min: -2.9,
        max: -1.7,
        z: -32,
        frequency: 0.3,
        phase: Math.PI / 2,
      },
      {
        ref: React.createRef<RapierRigidBody>(),
        node: nodes.bar3_obs_2,
        min: 0.2,
        max: -1.8,
        z: -32.4,
        frequency: 0.4,
        phase: Math.PI,
      },
    ];
  }, [nodes]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    bars.forEach(({ ref, min, max, z, frequency, phase }) => {
      if (!ref.current) return;

      const range = max - min;
      const osc = (Math.sin(t * frequency * Math.PI * 2 + phase) + 1) / 2;
      const x = min + osc * range;

      ref.current.setTranslation({ x, y: 3.5, z }, true);
    });
  });

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh" restitution={0}>
        <primitive
          object={block2}
          position={[0, 1.1, 0]}
          rotation={[0, Math.PI / 2, 0]}
          scale={1.1}
        />
      </RigidBody>

      {bars.map(({ ref, node, z }, i) => (
        <RigidBody
          key={i}
          ref={ref}
          type="kinematicPosition"
          colliders="cuboid"
          restitution={0.2}
          friction={1}
          position={[-1.5, 3.5, z]}
          scale={0.01}
          rotation={[0, Math.PI / 2, 0]}
          sensor
          onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject?.name === "player") {
              markAsPlayerDied();
              isPlayerDied.current = true;
            }
          }}
        >
          <primitive object={node} />
        </RigidBody>
      ))}
      <primitive
        rotation={[0, Math.PI / 2, 0]}
        object={grass}
        scale={1.1}
        position={[0, 1.1, 0]}
      />
      <primitive
        rotation={[0, Math.PI / 2, 0]}
        object={plantsGrass}
        scale={1.1}
        position={[0, 1.1, 0]}
      />

      <TreesBackground
        minZ={-50}
        maxZ={-15}
        treesPositions={trees_block2}
        maxX={-15}
      />
    </group>
  );
}

export default Level1Block2;

useGLTF.preload("/models/level1/block_2/level_1_block_2.gltf");
useGLTF.preload("/models/level1/block_2/grass_block_2.gltf");
useGLTF.preload("/models/level1/block_2/plants_block_2.gltf");
