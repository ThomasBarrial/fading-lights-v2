import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import enableShadowsRecursively from "@/utils/enableShadowsRecursively";
import { useControls } from "leva";
import * as THREE from "three";
import DebugLight from "./DebutLight";
import { useFrame } from "@react-three/fiber";
import { usePlatformStore } from "@/store/usePlateformLevel2Sore";
import { useIsPlayerDied } from "@/store/useIsPlayerDied";

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
  isPlayerDied,
}: {
  rigidBodyRef: React.RefObject<RapierRigidBody | null>;
  isPlayerDied: React.RefObject<boolean>;
}) {
  const { scene: block1, nodes } = useGLTF(
    "/models/level2/level_2_block_1.gltf",
  );

  const currentPlatformRef = useRef<RapierRigidBody | null>(null);
  const prevPositions = useRef<Record<string, number>>({});
  const setPlatformVelocityX = usePlatformStore((s) => s.setPlatformVelocityX);
  const setPlatformVelocityByHandle = usePlatformStore(
    (s) => s.setPlatformVelocityByHandle,
  );
  const { markAsPlayerDied } = useIsPlayerDied();

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
    { position: [-4.3, 8, -38.7] },
    { position: [-2.7, 8.9, -47.8] },
  ];

  const movingBlocks: MovingBlocksConfig[] = useMemo(() => {
    return [
      {
        id: "plateform1",
        ref: React.createRef<RapierRigidBody>(),
        node: nodes.movingplateform1,
        min: 0,
        max: 4,
        z: -0.1,
        frequency: 0.1,
        phase: 0,
      },
      {
        id: "plateform2",
        ref: React.createRef<RapierRigidBody>(),
        node: nodes.movingplatforme2,
        min: -3,
        max: 2,
        z: -0.3,
        frequency: 0.08,
        phase: 3,
      },
      {
        id: "plateform3",
        ref: React.createRef<RapierRigidBody>(),
        node: nodes.movingplateforme3,
        min: -1,
        max: 3,
        z: -0.4,
        frequency: 0.1,
        phase: 2,
      },
      {
        id: "plateform4",
        ref: React.createRef<RapierRigidBody>(),
        node: nodes.Movingplateform4,
        min: -2,
        max: 2,
        z: -0.5,
        frequency: 0.07,
        phase: 1,
      },
    ];
  }, [nodes]);

  const pics: MovingBlocksConfig[] = useMemo(() => {
    {
      return [
        {
          id: "pic1",
          ref: React.createRef<RapierRigidBody>(),
          node: nodes.pics1,
          min: 0,
          max: 1,
          z: 0,
          frequency: 0.2,
          phase: 1,
        },
        {
          id: "pic2",
          ref: React.createRef<RapierRigidBody>(),
          node: nodes.pics2,
          min: 0,
          max: 1,
          z: 0,
          frequency: 0.2,
          phase: 2,
        },
      ];
    }
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

      if (ref.current) {
        setPlatformVelocityByHandle(ref.current.handle, velocityX);
      }
    });

    const descendDuration = 3.2; // descente douce
    const waitBottomDuration = 0.5; // pause en bas
    const ascendDuration = 0.2; // montée rapide
    const waitTopDuration = 1.2; // ✅ pause en haut

    const totalDuration =
      descendDuration + waitBottomDuration + ascendDuration + waitTopDuration;

    pics.forEach(({ ref, min, max, z, phase }) => {
      if (!ref.current) return;

      const time = (clock.getElapsedTime() + phase) % totalDuration;

      let y = min;

      if (time < descendDuration) {
        // Phase 1: descente douce
        const t = time / descendDuration;
        y = THREE.MathUtils.lerp(max, min, t); // max → min
      } else if (time < descendDuration + waitBottomDuration) {
        // Phase 2: pause en bas
        y = min;
      } else if (time < descendDuration + waitBottomDuration + ascendDuration) {
        // Phase 3: montée rapide
        const t =
          (time - descendDuration - waitBottomDuration) / ascendDuration;
        y = THREE.MathUtils.lerp(min, max, t); // min → max
      } else {
        // Phase 4: pause en haut
        y = max;
      }

      ref.current.setTranslation({ x: 0, y, z }, true);
    });
  });

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
        >
          <primitive object={node} />
        </RigidBody>
      ))}

      {pics.map(({ ref, node, z, id }, i) => (
        <RigidBody
          key={i}
          ref={ref}
          type="kinematicPosition"
          colliders="cuboid"
          restitution={0.2}
          friction={1}
          position={[-1.5, 1.5, z]}
          scale={0.018}
          rotation={[0, Math.PI / 2, 0]}
          name={`pic-${id}`}
          sensor
          onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject?.name === "player") {
              markAsPlayerDied();
              setTimeout(() => {
                isPlayerDied.current = true;
              }, 400);
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
