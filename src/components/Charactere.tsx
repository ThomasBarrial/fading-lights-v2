import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { CharactereModel } from "./models/CharactereModel";

function Charactere() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const cameraFollowRef = useRef<THREE.Object3D>(null);
  const jumpCooldown = useRef(0);
  const [subscribeKeys, get] = useKeyboardControls();
  const speed = 3;
  const direction = new THREE.Vector3();
  const isGrounded = useRef(false);
  const { rapier, world } = useRapier();
  const rayHelper = useRef<THREE.ArrowHelper>(null);

  const jump = React.useCallback(() => {
    if (!rigidBodyRef.current) return;
    if (jumpCooldown.current > 0) return;

    const base = rigidBodyRef.current.translation();
    const origin = { x: base.x, y: base.y - 0.6, z: base.z };
    const ray = new rapier.Ray(origin, { x: 0, y: -1, z: 0 });
    const hit = world.castRayAndGetNormal(ray, 0.5, true);

    if (hit && hit.timeOfImpact < 0.1) {
      rigidBodyRef.current.applyImpulse({ x: 0, y: 4, z: 0 }, true);
      jumpCooldown.current = 1;
    }
  }, [rapier, world]);

  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) jump();
      },
    );

    return () => {
      unsubscribeJump();
    };
  }, [subscribeKeys, jump]);

  useFrame((state, delta) => {
    const body = rigidBodyRef.current;
    if (!body) return;

    if (rayHelper.current && rigidBodyRef.current) {
      const origin = rigidBodyRef.current.translation();
      const rayOrigin = new THREE.Vector3(origin.x, origin.y - 0.5, origin.z);

      rayHelper.current.position.copy(rayOrigin);
      rayHelper.current.setDirection(new THREE.Vector3(0, -1, 0));
    }

    const { forward, backward, leftward, rightward } = get();

    direction.set(0, 0, 0);
    if (forward) direction.z -= 1;
    if (backward) direction.z += 1;
    if (leftward) direction.x -= 1;
    if (rightward) direction.x += 1;

    // Mouvement horizontal
    direction.normalize().multiplyScalar(speed);
    // Récupère la vélocité actuelle
    const linvel = body.linvel();
    body.setLinvel({ x: direction.x, y: linvel.y, z: direction.z }, true);

    // Tentative de saut
    if (jumpCooldown.current > 0) {
      jumpCooldown.current -= delta;
    }

    // CAMERA
    if (!cameraFollowRef.current) return;
    // On récupère la position actuelle et on lisse sur le ref visuel
    const bodyPos = new THREE.Vector3().copy(body.translation());

    // Smooth follow
    cameraFollowRef.current.position.lerp(bodyPos, 8 * delta);

    const idealOffset = new THREE.Vector3(8, 15, 8); // (inversé selon besoin)
    const idealLookAt = new THREE.Vector3(0, 1, 0);

    const cameraPos = cameraFollowRef.current.position.clone().add(idealOffset);
    const target = cameraFollowRef.current.position.clone().add(idealLookAt);

    state.camera.position.lerp(cameraPos, 5 * delta);
    state.camera.lookAt(target);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={1}
      position={[0, 1, 0]}
      enabledRotations={[false, false, false]} // empêche de tomber ou tourner
      friction={1}
      canSleep={false} // empêche de dormir
    >
      <object3D ref={cameraFollowRef} />
      <CapsuleCollider args={[0.4, 0.4]} />
      {/* <primitive
        ref={rayHelper}
        object={
          new THREE.ArrowHelper(
            new THREE.Vector3(0, -1, 0), // direction
            new THREE.Vector3(0, 0, 0), // origin
            1, // length
            0xff0000, // color
          )
        }
      /> */}

      <CharactereModel isGrounded={isGrounded.current} />
    </RigidBody>
  );
}

export default Charactere;
