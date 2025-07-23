import { useTransitionStore } from "@/store/useTransitionStore";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

function TransitionPlateform() {
  const { scene: transition_plateform } = useGLTF(
    "/models/level1/level_1_block_4_transition_plateform.gltf",
  );

  const isActive = useRef<boolean>(false);
  const plateform = useRef<THREE.Object3D>(null);

  const { startTransition } = useTransitionStore();

  useFrame(() => {
    if (!plateform.current || !isActive.current) return;

    plateform.current.position.y -= 0.6; // ← vitesse de chute
  });
  return (
    <>
      <primitive
        ref={plateform}
        position={[-2.5, 1.1, -119]}
        rotation={[0, Math.PI / 2, 0]}
        object={transition_plateform}
        scale={1.1}
      />

      <RigidBody
        type="fixed"
        colliders="cuboid"
        position={[-2.5, 7, -119]}
        sensor
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "player") {
            isActive.current = true;
            startTransition();
          }
        }}
      >
        <mesh>
          <boxGeometry args={[3, 1, 3]} />
          <meshStandardMaterial color="hotpink" transparent opacity={0} />
        </mesh>
      </RigidBody>
    </>
  );
}

export default TransitionPlateform;
