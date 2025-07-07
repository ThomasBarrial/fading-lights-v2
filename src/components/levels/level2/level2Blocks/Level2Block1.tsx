import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useHelper } from "@react-three/drei";
import enableShadowsRecursively from "@/utils/enableShadowsRecursively";
import { useControls } from "leva";
import * as THREE from "three";
import DebugLight from "./DebutLight";
import { useFrame } from "@react-three/fiber";
import { usePlatformStore } from "@/store/usePlateformLevel2Sore";

type MovingBlocksConfig = {
  id: string;
  ref: React.RefObject<RapierRigidBody | null>;
  node: THREE.Object3D;
  min: number;
  max: number;
  z: number;
  frequency: number;
  phase: number;
};

function Level2Block1({
  rigidBodyRef,
}: {
  rigidBodyRef: React.RefObject<RapierRigidBody | null>;
}) {
  const { scene: block1, nodes } = useGLTF(
    "/models/level2/level_2_block_1.gltf",
  );

  const currentPlatformRef = useRef<RapierRigidBody | null>(null);
  const prevPositions = useRef<Record<string, number>>({});
  const setPlatformVelocityX = usePlatformStore((s) => s.setPlatformVelocityX);
  useEffect(() => {
    if (block1) {
      enableShadowsRecursively(block1);
    }
  }, [block1]);

  const { pointLightColor } = useControls({
    pointLightColor: "#86abd8",
  });

  const pointLights = [
    { position: [-3.1, 6.3, -4.8] },
    { position: [-4.1, 6.3, -25] },
    // { position: [-1.5, 7.0, 2] },
  ];

  const movingBlocks: MovingBlocksConfig[] = useMemo(() => {
    return [
      {
        id: "plateform1",
        ref: React.createRef<RapierRigidBody>(),
        node: nodes.movingplateform1,
        min: 0,
        max: 4,
        z: -0.2,
        frequency: 0.1,
        phase: 0,
      },
    ];
  }, [nodes]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    movingBlocks.forEach(({ ref, min, max, z, frequency, phase, id }) => {
      if (!ref.current) return;

      const range = max - min;
      const osc = (Math.sin(t * frequency * Math.PI * 2 + phase) + 1) / 2;
      const x = min + osc * range;

      // calcule vitesse
      const prevX = prevPositions.current[id] ?? x;
      const velocityX = (x - prevX) / delta;
      prevPositions.current[id] = x;

      ref.current.setTranslation({ x, y: 1, z }, true);

      // Appliquer au joueur si il est dessus
      const player = rigidBodyRef.current;
      const platform = currentPlatformRef.current;

      if (
        player &&
        platform &&
        platform.handle === ref.current.handle
        // + tu peux ici ajouter `isGrounded.current === true` si tu l’as
      ) {
        setPlatformVelocityX(velocityX);
      } else {
        setPlatformVelocityX(0); // reset si pas sur la plateforme
      }
    });
  });

  console.log(nodes.movingplateform1);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive
          rotation={[0, Math.PI / 2, 0]}
          object={block1}
          scale={1.8}
          position={[0, 1.1, 0]}
        />
      </RigidBody>

      {pointLights.map((light, i) => (
        <DebugLight
          key={i}
          position={light.position as [number, number, number]}
          color={pointLightColor}
          intensity={20}
          decay={0.5}
          distance={20}
          showHelper={false}
        />
      ))}

      {movingBlocks.map(({ ref, node, z, id }, i) => (
        <RigidBody
          key={i}
          ref={ref}
          type="kinematicPosition"
          colliders="cuboid"
          restitution={0.2}
          friction={1}
          position={[-1.5, 1, z]}
          scale={0.018}
          rotation={[0, Math.PI / 2, 0]}
          name={`platform-${id}`}
          onCollisionEnter={({ other }) => {
            if (other.rigidBodyObject?.name === "player") {
              console.log("enter plateform");
              currentPlatformRef.current = ref.current;
            }
          }}
          onCollisionExit={({ other }) => {
            if (other.rigidBodyObject?.name === "player") {
              console.log("exit plateform");
              currentPlatformRef.current = null;
            }
          }}
        >
          <primitive object={node} />
        </RigidBody>
      ))}
    </group>
  );
}

export default Level2Block1;

useGLTF.preload("/models/level2/level_2_block1.gltf");
