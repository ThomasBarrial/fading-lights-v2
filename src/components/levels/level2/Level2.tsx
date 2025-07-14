import { RapierRigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import React, { useRef } from "react";
import * as THREE from "three";
import Level2Block1 from "./level2Blocks/Level2Block1";

function Level2({
  rigidBodyRef,
}: {
  rigidBodyRef: React.RefObject<RapierRigidBody | null>;
}) {
  const waterRef = useRef<THREE.Mesh>(null);

  const { floorColor2 } = useControls({
    floorColor2: { value: "#303172" },
  });

  return (
    <group>
      {/* Surface d'eau */}

      <mesh ref={waterRef} receiveShadow position={[-5, 0.4, -66]}>
        <boxGeometry args={[70, , 160]} />
        <meshPhysicalMaterial
          color={floorColor2}
          transparent
          opacity={0.3}
          roughness={0}
          ior={1.33} // eau
        />
      </mesh>

      <Level2Block1 rigidBodyRef={rigidBodyRef} />
    </group>
  );
}

export default Level2;
