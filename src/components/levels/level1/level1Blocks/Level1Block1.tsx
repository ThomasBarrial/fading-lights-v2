import { RigidBody } from "@react-three/rapier";
import React, { useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

function Level1Block1() {
  const { scene: block1 } = useGLTF("/models/level1/level_1_block_1.gltf");
  const { scene: boost } = useGLTF("/models/boost.gltf");

  const { scene: plantsGrass } = useGLTF(
    "/models/level1/plant_grass_level1.gltf",
  );

  function enableShadowsRecursively(object: THREE.Object3D) {
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  useEffect(() => {
    if (block1) {
      enableShadowsRecursively(block1);
      enableShadowsRecursively(plantsGrass);
      enableShadowsRecursively(boost);
    }
  }, [block1, plantsGrass, boost]);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        {/* WALLCLIMB 1*/}
        <primitive
          rotation={[0, Math.PI / 2, 0]}
          object={block1}
          scale={1.1}
          position={[0, 1.1, 0]}
        />
      </RigidBody>

      <primitive
        rotation={[0, Math.PI / 2, 0]}
        object={plantsGrass}
        scale={1.1}
        position={[0, 1.1, 0]}
      />
    </group>
  );
}

export default Level1Block1;
