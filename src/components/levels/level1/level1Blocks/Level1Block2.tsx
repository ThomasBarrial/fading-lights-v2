import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import React, { useEffect } from "react";
import * as THREE from "three";

function Level1Block2() {
  const { scene: block2 } = useGLTF(
    "/models/level1/blocks/block2/level_1_block_2.gltf",
  );
  const group = React.useRef<THREE.Group>(null);

  function enableShadowsRecursively(object: THREE.Object3D) {
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  useEffect(() => {
    if (block2) {
      enableShadowsRecursively(block2);
    }
  }, [block2]);
  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive
          rotation={[0, Math.PI / 2, 0]}
          object={block2}
          ref={group}
          scale={1.1}
          position={[0, 1.1, 0]}
        />
      </RigidBody>
    </group>
  );
}

export default Level1Block2;
