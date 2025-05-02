"use client";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function CameraController({
  target,
}: {
  target: React.RefObject<THREE.Object3D | null>;
}) {
  const { camera } = useThree();

  useFrame(() => {
    if (!target.current) return;

    const targetPos = target.current.position.clone();
    const offset = new THREE.Vector3(6, 8, 6); // isométrique douce

    const desiredPos = targetPos.clone().add(offset);
    camera.position.lerp(desiredPos, 0.1);
    camera.lookAt(targetPos);
  });

  return null;
}

export default CameraController;
