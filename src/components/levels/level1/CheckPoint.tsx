import { RigidBody } from "@react-three/rapier";
import { useControls } from "leva";
import { useRef, useState } from "react";
import * as THREE from "three";
export default function Checkpoint({
  args,
  position,
  onActivate,
  debug = false,
}: {
  position: [number, number, number];
  args?: [number, number, number];
  onActivate: () => void;
  debug?: boolean;
}) {
  const [isActive, setIsActive] = useState(false);
  const lightRef = useRef<THREE.PointLight>(null);
  const { lightColor } = useControls({
    lightColor: "#074EA4",
  });
  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
      position={position}
      sensor
      onIntersectionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "player") {
          setIsActive(true);
          onActivate(); // Appelle la fonction transmise
        }
      }}
    >
      {/* checkpointLight*/}

      <pointLight
        ref={lightRef}
        position={[1.2, 1.3, 0.4]}
        color={lightColor}
        decay={0.5}
        intensity={isActive ? 10 : 0}
        distance={2}
      />
      {/* Optionnel : visualisation temporaire */}
      <mesh name="checkpoint">
        <boxGeometry args={args} />
        <meshStandardMaterial
          color="hotpink"
          transparent
          opacity={debug ? 0.4 : 0}
        />
      </mesh>
    </RigidBody>
  );
}
