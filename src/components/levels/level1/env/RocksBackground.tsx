"use client";

import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";

const ROCK_URL = "/models/env/rocksModel.gltf";

export interface RocksData {
  position: [number, number, number];
  scale: number;
  rotationY: number;
}

export default function RocksBackground({
  maxZ,
  minZ,
  maxX,
  rocksPosition,
}: {
  maxZ: number;
  minZ: number;
  maxX: number;
  rocksPosition?: RocksData[];
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

  const rocks = useMemo(() => {
    const rockArray = [];

    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 35 - 25;
      const z = Math.random() * 100 - 90;

      // Optionnel : zone sécurité parcours
      if (x > -7 && x < 4 && z > -110 && z < 2) {
        i--;
        continue;
      }

      if (z < minZ || z > maxZ || x < -15 || x < maxX) continue;

      rockArray.push({
        position: [x, 0, z] as [number, number, number],
        scale: 0.05 + Math.random() * 0.5,
        rotationY: Math.random() * Math.PI * 2,
      });
    }

    return rockArray;
  }, [maxZ, minZ, maxX]);

  return (
    <Suspense fallback={null}>
      <group position={[0, 0.5, 0]}>
        {rocksPosition ? (
          <>
            {" "}
            {rocksPosition.map((rock, idx) => (
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
          </>
        ) : (
          <>
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
          </>
        )}
      </group>
    </Suspense>
  );
}
