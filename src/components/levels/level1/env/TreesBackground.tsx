"use client";

// import treelevel1 from "@/utils/treelevel";
import { useGLTF, Instances, Instance } from "@react-three/drei";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

const TREE_URL = "/models/env/treeModel.gltf"; // Remplacez par l'URL de votre modèle

export type TreeData = {
  position: [number, number, number];
  rotationY: number;
  scale: number;
};

function TreesBackground({
  minZ,
  maxZ,
  treesPositions,
}: {
  minZ: number;
  maxZ: number;
  treesPositions?: TreeData[];
}) {
  const { scene } = useGLTF(TREE_URL);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat) => {
                mat.transparent = false;
                mat.needsUpdate = true;
                mat.depthWrite = true; // ✅ Ecrit bien dans le buffer de profondeur
                mat.depthTest = true; // ✅ Teste bien la profondeur
                mat.opacity = 1;
              });
            } else {
              mesh.material.transparent = false;
              mesh.material.depthWrite = true;
              mesh.material.needsUpdate = true;
            }
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        }
      });
    }
  }, [scene]);

  const trees = useMemo(() => {
    const treeArray = [];

    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 35 - 25;
      const z = Math.random() * 100 - 90;

      if (x > -8 && x < 3.5 && z > -110 && z < 5) {
        i--;
        continue;
      }

      if (z < minZ || z > maxZ) continue;

      treeArray.push({
        position: [x, 0.5, z] as [number, number, number],
        scale: 0.25 + Math.random() * 0.1,
        rotationY: Math.random() * Math.PI * 2,
      });
    }

    return treeArray;
  }, [minZ, maxZ]);

  if (!scene.children[0]) return null;

  return (
    <Instances
      geometry={(scene.children[0] as THREE.Mesh).geometry}
      material={(scene.children[0] as THREE.Mesh).material}
      limit={500}
      castShadow // 🛠 Ajoute le flag castShadow ici aussi sur les instances
      receiveShadow // 🛠 Et receiveShadow pour que ça reçoive la lumière du sol
    >
      {treesPositions ? (
        <>
          {" "}
          {treesPositions.map((tree, idx) => (
            <group key={idx}>
              {tree.position[2] < 20 && (
                <Instance
                  position={tree.position}
                  rotation={[0, tree.rotationY, 0]}
                  scale={tree.scale * 0.8}
                  frustumCulled={false}
                />
              )}
            </group>
          ))}
        </>
      ) : (
        <>
          {trees.map((tree, idx) => (
            <group key={idx}>
              {tree.position[2] < 20 && (
                <Instance
                  position={tree.position}
                  rotation={[0, tree.rotationY, 0]}
                  scale={tree.scale * 0.8}
                  frustumCulled={false}
                />
              )}
            </group>
          ))}
        </>
      )}
    </Instances>
  );
}

export default TreesBackground;
