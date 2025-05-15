import Boost from "@/components/models/Boost";
import { RigidBody } from "@react-three/rapier";
import React from "react";

function Level2() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow position={[-5, 0.4, -66]}>
        <boxGeometry args={[70, 0.2, 160]} />
        <meshStandardMaterial color={"#527650"} />
      </mesh>
      <Boost position={[1, 1, 2]} id={"boost1"} />
      <Boost position={[1, 1, 3]} id={"boost2"} />
      <Boost position={[1, 1, 6]} id={"boost3"} />
    </RigidBody>
  );
}

export default Level2;
