"use client";

import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";

const ROCK_URL = "/models/env/rocksModel.gltf";

export default function RocksBackground() {
  const { scene } = useGLTF(ROCK_URL);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).castShadow = true;
        (child as THREE.Mesh).receiveShadow = true;
      }
    });
  }, [scene]);

  const rocks = useMemo(() => {
    const rockArray = [];

    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 32 - 20;
      const z = Math.random() * 140 - 130;

      // Optionnel : zone sécurité parcours
      if (x > -6 && x < 6 && z > -110 && z < 1) {
        i--;
        continue;
      }

      rockArray.push({
        position: [x, 0, z] as [number, number, number],
        scale: 0.05 + Math.random() * 0.5,
        rotationY: Math.random() * Math.PI * 2,
      });
    }

    return rockArray;
  }, []);

  return (
    <Suspense fallback={null}>
      <group position={[0, 0.5, 0]}>
        {rocks.map((rock, idx) => (
          <group key={idx}>
            {rock.position[2] < 20 && (
              <primitive
                key={idx}
                object={scene.clone()}
                position={rock.position}
                scale={rock.scale * 0.5}
                rotation={[0, rock.rotationY, 0]}
              />
            )}
          </group>
        ))}
      </group>
    </Suspense>
  );
}
