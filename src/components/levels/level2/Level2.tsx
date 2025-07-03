import { RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import React from "react";

function Level2() {
  const { floorColor } = useControls({
    floorColor: { value: "#000141" },
  });
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow position={[-5, 0.4, -66]}>
        <boxGeometry args={[70, 0.2, 160]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>
    </RigidBody>
  );
}

export default Level2;
