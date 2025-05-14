import { RigidBody } from "@react-three/rapier";
import React from "react";

function Level2() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow position={[-5, 0.4, -66]}>
        <boxGeometry args={[70, 0.2, 160]} />
        <meshStandardMaterial color={"#527650"} />
      </mesh>
    </RigidBody>
  );
}

export default Level2;
