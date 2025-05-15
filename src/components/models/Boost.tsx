import { useBoostStore } from "@/store/useBoostStore";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export default function Boost({
  id,
  position = [0, 1, 0],
  corruptionValue = 0.15,
  duration = undefined,
  lightPosition = [0, 2, 0],
}: {
  id: string;
  position?: [number, number, number];
  corruptionValue?: number;
  duration?: number;
  lightPosition?: [number, number, number];
}) {
  const ref = useRef<RapierRigidBody>(null);
  const visualRef = useRef<THREE.Object3D>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const { applyBoost, markBoostAsCollected, collectedBoosts } = useBoostStore();
  const { scene } = useGLTF("/models/boost.gltf");

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    if (visualRef.current) {
      visualRef.current.position.y = Math.sin(t * 2) * 0.09;
      visualRef.current.rotation.y += delta * 0.5;
    }
  });

  const boostModel = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  return (
    <>
      {!collectedBoosts[id] && (
        <RigidBody
          type="fixed"
          colliders="cuboid"
          sensor
          ref={ref}
          position={position}
          scale={1.2}
          onIntersectionEnter={({ other }) => {
            if (other.rigidBodyObject?.name === "player") {
              console.log("Boost collected", id);
              applyBoost(corruptionValue, duration);
              // On retarde la suppression dans Zustand pour laisser Three.js respirer
              markBoostAsCollected(id);
            }
          }}
        >
          <primitive ref={visualRef} object={boostModel} />
        </RigidBody>
      )}

      <pointLight
        ref={lightRef}
        position={lightPosition}
        distance={2}
        intensity={!collectedBoosts[id] ? 0.5 : 0}
        color="#c7f59e"
      />
    </>
  );
}

useGLTF.preload("/models/boost.gltf");
