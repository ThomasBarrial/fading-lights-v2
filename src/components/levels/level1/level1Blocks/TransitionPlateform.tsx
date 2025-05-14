import { useTransitionStore } from "@/store/useTransitionStore";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

function TransitionPlateform() {
  const { scene: transition_plateform } = useGLTF(
    "/models/level1/level_1_block_4_transition_plateform.gltf",
  );

  const isActive = useRef<boolean>(false);
  const plateform = useRef<RapierRigidBody>(null);

  const { startTransition } = useTransitionStore();

  useFrame(() => {
    if (!plateform.current) return;

    const plateformPosition = plateform.current.translation();

    if (isActive.current) {
      plateform.current.setTranslation(
        {
          x: plateformPosition.x,
          y: plateformPosition.y - 0.3,
          z: plateformPosition.z,
        },
        true,
      );
    }
  });
  return (
    <>
      <RigidBody
        ref={plateform}
        type="fixed"
        colliders="trimesh"
        position={[-2.5, 0, -119]}
      >
        <primitive
          rotation={[0, Math.PI / 2, 0]}
          object={transition_plateform}
          scale={1.1}
          position={[0, 1.1, 0]}
        />
      </RigidBody>
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
