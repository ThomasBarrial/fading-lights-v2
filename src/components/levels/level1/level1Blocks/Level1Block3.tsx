import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import React, { useEffect } from "react";
import * as THREE from "three";
import TreesBackground from "../env/TreesBackground";
import RocksBackground from "../env/RocksBackground";

function Level1Block3() {
  const { scene: block3 } = useGLTF("/models/level1/level_1_block_3.gltf");

  function enableShadowsRecursively(object: THREE.Object3D) {
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  useEffect(() => {
    if (block3) {
      enableShadowsRecursively(block3);
    }
  }, [block3]);
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
      <TreesBackground minZ={-88} maxZ={-50} treesPositions={undefined} />
      <RocksBackground
        minZ={-88}
        maxZ={-50}
        rocksPosition={undefined}
        maxX={-15}
      />
    </group>
  );
}

export default Level1Block3;
