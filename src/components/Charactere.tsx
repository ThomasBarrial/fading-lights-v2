import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function Charactere() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const cameraFollowRef = useRef<THREE.Object3D>(null);
  const modelRef = useRef<THREE.Object3D>(null);
  const jumpCooldown = useRef(0);
  const { scene } = useGLTF("/models/charactere.gltf");
  const [subscribeKeys, get] = useKeyboardControls();
  const speed = 5;
  const direction = new THREE.Vector3();

  const { rapier, world } = useRapier();

  const jump = React.useCallback(() => {
    if (!rigidBodyRef.current) return;
    if (jumpCooldown.current > 0) return; // ← AJOUT ESSENTIEL

    const origin = rigidBodyRef.current.translation();
    origin.y -= 0.6;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 1, true);

    if (hit && hit.timeOfImpact < 0.05) {
      rigidBodyRef.current.applyImpulse({ x: 0, y: 3.5, z: 0 }, true);
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

  function enableShadowRecursively(obj: THREE.Object3D) {
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
      }
    });
  }

  useEffect(() => {
    enableShadowRecursively(scene);
  }, [scene]);

  useFrame((state, delta) => {
    const body = rigidBodyRef.current;
    if (!body) return;

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
    // On applique la rotation
    if (modelRef.current && direction.lengthSq() > 0.0001) {
      const targetRotation = new THREE.Quaternion();
      const lookAtDir = direction.clone().normalize();

      // Calcule la direction de regard normale
      const dummy = new THREE.Object3D();
      dummy.lookAt(lookAtDir.x, 0, lookAtDir.z);

      // Appliquer une rotation de +90° autour de Y à la direction
      const rotationOffset = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, -1, 0),
        Math.PI / 2,
      );

      // Combine avec l’offset de 90°
      targetRotation.multiplyQuaternions(rotationOffset, dummy.quaternion);

      modelRef.current.quaternion.slerp(targetRotation, 10 * delta);
    }

    // CAMERA
    if (!cameraFollowRef.current) return;
    // On récupère la position actuelle et on lisse sur le ref visuel
    const bodyPos = new THREE.Vector3().copy(body.translation());

    // Smooth follow
    cameraFollowRef.current.position.lerp(bodyPos, 8 * delta);

    const idealOffset = new THREE.Vector3(5, 10, 5); // (inversé selon besoin)
    const idealLookAt = new THREE.Vector3(0, 1, 0);

    const cameraPos = cameraFollowRef.current.position.clone().add(idealOffset);
    const target = cameraFollowRef.current.position.clone().add(idealLookAt);

    state.camera.position.lerp(cameraPos, 5 * delta);
    state.camera.lookAt(target);

    // }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={30}
      position={[0, 1, 0]}
      enabledRotations={[false, false, false]} // empêche de tomber ou tourner
      friction={1}
      canSleep={false} // empêche de dormir
    >
      <object3D ref={cameraFollowRef} />
      <CapsuleCollider args={[0.4, 0.4]} />
      <primitive
        ref={modelRef}
        object={scene}
        scale={0.2}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </RigidBody>
  );
}

export default Charactere;
