"use client";

import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";

const ROCK_URL = "/models/env/oneGrass.gltf";

export type GrassData = {
  position: [number, number, number];
  scale: number;
  rotationY: number;
};

export default function GrassBackground({
  minZ,
  maxZ,
  grassPosition,
  maxX,
}: {
  minZ: number;
  maxZ: number;
  grassPosition?: GrassData[];
  maxX: number;
}) {
  const { scene } = useGLTF(ROCK_URL);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).castShadow = true;
        (child as THREE.Mesh).receiveShadow = true;
      }
    });
  }, [scene]);

  const grass = useMemo(() => {
    const grassArray = [];

    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 33 - 20;
      const z = Math.random() * 140 - 130;

      // Optionnel : zone sécurité parcours
      if (x > -4 && x < 0 && z > -110 && z < 1) {
        i--;
        continue;
      }

      if (z < minZ || z > maxZ || x < maxX) continue;

      grassArray.push({
        position: [x, 0, z] as [number, number, number],
        scale: 0.05 + Math.random() * 0.5,
        rotationY: Math.random() * Math.PI * 2,
      });
    }

    return grassArray;
  }, [minZ, maxZ, maxX]);

  return (
    <Suspense fallback={null}>
      <group position={[0, 0.6, 0]}>
        {grassPosition ? (
          <>
            {" "}
            {grassPosition.map((grass, idx) => (
              <group key={idx}>
                {grass.position[2] < 20 && (
                  <primitive
                    key={idx}
                    object={scene.clone()}
                    position={grass.position}
                    scale={grass.scale * 3}
                    rotation={[0, grass.rotationY, 0]}
                  />
                )}
              </group>
            ))}
          </>
        ) : (
          <>
            {" "}
            {grass.map((grass, idx) => (
              <group key={idx}>
                {grass.position[2] < 20 && (
                  <primitive
                    key={idx}
                    object={scene.clone()}
                    position={grass.position}
                    scale={grass.scale * 3}
                    rotation={[0, grass.rotationY, 0]}
                  />
                )}
              </group>
            ))}
          </>
        )}
      </group>
    </Suspense>
  );
}
