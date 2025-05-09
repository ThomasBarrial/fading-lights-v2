import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CharactereModel } from "./models/CharactereModel";
import { useBoostStore } from "@/store/useBoostStore";

function Charactere({
  rigidBodyRef,
}: {
  rigidBodyRef: React.RefObject<RapierRigidBody | null>;
}) {
  const cameraFollowRef = useRef<THREE.Object3D>(null);
  const [subscribeKeys, get] = useKeyboardControls();
  // const speed = 3;
  const direction = new THREE.Vector3();
  const { rapier, world } = useRapier();

  const {
    baseSpeed,
    boostedSpeed,
    baseJump,
    boostedJump,
    isBoosted,
    updateBoostTimer,
  } = useBoostStore();
  const currentSpeed = useMemo(
    () => (isBoosted ? boostedSpeed : baseSpeed),
    [isBoosted, baseSpeed, boostedSpeed],
  );
  const currentJump = useMemo(
    () => (isBoosted ? boostedJump : baseJump),
    [isBoosted, baseJump, boostedJump],
  );

  // const intialPostion = new THREE.Vector3(-1, 2, 0);
  // const intialPostion = new THREE.Vector3(-2, 5.6, -34);
  const intialPostion = new THREE.Vector3(-2, 5.6, -23);

  const isGrounded = useRef(false);

  const checkGrounded = () => {
    if (!rigidBodyRef.current) return;

    const rb = rigidBodyRef.current;
    const origin = rb.translation();
    const down = { x: 0, y: -1, z: 0 };

    // On lance une capsule fictive directement sous le joueur
    const shape = new rapier.Capsule(0.2, 0.1); // radius, halfHeight

    const hit = world.castShape(
      { x: origin.x, y: origin.y - 0.25, z: origin.z }, // Position
      { x: 0, y: 0, z: 0, w: 1 }, // Pas de rotation
      down,
      shape,
      0.05, // max distance
      1, // ignore RB itself
      false, // stopAtPenetration
    );
    isGrounded.current = !!hit && hit.time_of_impact < 0.05;
  };

  const canJump = useRef(true);

  const jump = React.useCallback(() => {
    if (!rigidBodyRef.current) return;
    if (!isGrounded.current || !canJump.current || !isGrounded.current) return;
    canJump.current = false;

    const velocity = rigidBodyRef.current.linvel();
    rigidBodyRef.current.setLinvel(
      { x: velocity.x, y: 0, z: velocity.z },
      true,
    );
    rigidBodyRef.current.applyImpulse({ x: 0, y: currentJump, z: 0 }, true);

    if (isGrounded.current && !canJump.current) {
      canJump.current = true;
    }
  }, [rigidBodyRef, currentJump]);

  useEffect(() => {
    subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump();
      },
    );
  }, [subscribeKeys, jump]);

  useFrame((state, delta) => {
    updateBoostTimer(delta * 1.1);
    const body = rigidBodyRef.current;

    if (!body) return;

    checkGrounded();

    const { forward, backward, leftward, rightward } = get();

    direction.set(0, 0, 0);
    if (forward) direction.z -= 1;
    if (backward) direction.z += 1;
    if (leftward) direction.x -= 1;
    if (rightward) direction.x += 1;

    // Mouvement horizontal
    direction.normalize().multiplyScalar(currentSpeed);
    // Récupère la vélocité actuelle
    const linvel = body.linvel();
    body.setLinvel({ x: direction.x, y: linvel.y, z: direction.z }, true);

    // CAMERA;
    if (!cameraFollowRef.current) return;
    // On récupère la position actuelle et on lisse sur le ref visuel
    const bodyPos = new THREE.Vector3().copy(body.translation());

    // Smooth follow
    cameraFollowRef.current.position.lerp(bodyPos, 8 * delta);

    const idealOffset = new THREE.Vector3(6, 10, 5); // (inversé selon besoin)
    const idealLookAt = new THREE.Vector3(0, 0, 0);

    const cameraPos = cameraFollowRef.current.position.clone().add(idealOffset);

    const target = cameraFollowRef.current.position.clone().add(idealLookAt);

    state.camera.position.lerp(cameraPos, 5 * delta);
    state.camera.lookAt(target);
  });

  return (
    <>
      <RigidBody
        name="player"
        ref={rigidBodyRef}
        mass={1}
        position={intialPostion.toArray()}
        colliders={false}
        restitution={0.2}
        friction={1}
        canSleep={false}
        enabledRotations={[false, false, false]}
        linearDamping={0.5}
        angularDamping={0.5}
      >
        <object3D ref={cameraFollowRef} />
        <CapsuleCollider args={[0.25, 0.25]} />
        <CharactereModel />
      </RigidBody>
    </>
  );
}

export default Charactere;
