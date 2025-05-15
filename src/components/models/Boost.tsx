import { useBoostStore } from "@/store/useBoostStore";
import { Clone, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export default function Boost({
  id,
  position = [0, 1, 0],
  corruptionValue = 0.15,
  duration = undefined,
}: {
  id: string;
  position?: [number, number, number];
  corruptionValue?: number;
  duration?: number;
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

    // if (lightRef.current) {
    //   lightRef.current.intensity = 1 + Math.sin(t * 3) * 0.2;
    // }
  });

  useEffect(() => {
    console.log("Boost mounted");
  }, []);

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

  if (collectedBoosts[id]) return null;

  return (
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
          markBoostAsCollected(id);
        }
      }}
    >
      <group ref={visualRef}>
        <primitive object={boostModel} />
        <pointLight
          ref={lightRef}
          position={[0, 0.5, 0]}
          distance={2}
          intensity={1}
          color="#c7f59e"
        />
      </group>
    </RigidBody>
  );
}

useGLTF.preload("/models/boost.gltf");
