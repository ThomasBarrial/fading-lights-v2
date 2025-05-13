import { RigidBody } from "@react-three/rapier";
import React from "react";

function Level1Bounds() {
  return (
    <group visible={false}>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-9, 0, -65]}>
          <boxGeometry args={[1, 10, 140]} />
          <meshStandardMaterial color={"#ffffff"} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={"#ffffff"} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-2, 0, 4]}>
          <boxGeometry args={[15, 10, 1]} />
          <meshStandardMaterial color={"#ffffff"} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[4, 0, -65]}>
          <boxGeometry args={[1, 10, 140]} />
          <meshStandardMaterial color={"#ffffff"} />
        </mesh>
      </RigidBody>
    </group>
  );
}

export default Level1Bounds;
