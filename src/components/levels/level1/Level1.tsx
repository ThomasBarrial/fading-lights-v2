import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import React from "react";
import * as THREE from "three";

function Level1() {
  const { scene } = useGLTF("/models/level1/level_1_block_1.gltf");
  const group = React.useRef<THREE.Group>(null);
  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        {/* Collider invisible sous le sol */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[20, 1, 280]} />
          <meshStandardMaterial color={"#22222"} />
        </mesh>

        <primitive
          rotation={[0, Math.PI / 2, 0]}
          object={scene}
          ref={group}
          position={[0, 1.01, 0]}
        />
      </RigidBody>
    </group>
  );
}

export default Level1;
