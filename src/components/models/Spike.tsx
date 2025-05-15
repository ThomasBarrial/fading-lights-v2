import { Clone } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React from "react";
import * as THREE from "three";

interface IProps {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  object: THREE.Object3D;
  ref: React.RefObject<RapierRigidBody | null>;
}

function Spike({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
  object,
  ref,
}: IProps) {
  return (
    <RigidBody
      type="fixed"
      position={position}
      colliders="trimesh"
      ref={ref as React.RefObject<RapierRigidBody>}
    >
      {/* <primitive object={object} scale={scale} rotation={rotation} /> */}
      <Clone object={object} scale={scale} rotation={rotation} />
    </RigidBody>
  );
}

export default Spike;
