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
import { useDashStore } from "@/store/useDashStore";

import TrailFollow from "./effects/Trail";
import { useIsMenuOpen } from "@/store/isMenuOpen";
import { usePlatformStore } from "@/store/usePlateformLevel2Sore";

function Charactere({
  rigidBodyRef,
}: {
  rigidBodyRef: React.RefObject<RapierRigidBody | null>;
}) {
  const cameraFollowRef = useRef<THREE.Object3D>(null);
  const [subscribeKeys, get] = useKeyboardControls();
  const dashTrailRef = useRef<THREE.Object3D>(null);
  const { shouldRestartGame, resetShouldRestartGame } = useIsMenuOpen();
  const setPlatformVelocityX = usePlatformStore((s) => s.setPlatformVelocityX);
  const velocityByPlatformHandle = usePlatformStore(
    (s) => s.velocityByPlatformHandle,
  );
  const { platformVelocityX } = usePlatformStore();
  const boostTimer = useRef(0);

  const direction = useMemo(() => new THREE.Vector3(), []);
  const { rapier, world } = useRapier();
  const { triggerDash, dashAvailable, updateDash, isDashing } = useDashStore();
  const {
    baseSpeed,
    boostedSpeed,
    baseJump,
    boostedJump,
    isBoosted,
    baseDash,
    boostedDash,
    boostCount,
  } = useBoostStore();
  const currentSpeed = useMemo(
    () => (isBoosted ? boostedSpeed : baseSpeed),
    [isBoosted, baseSpeed, boostedSpeed],
  );
  const currentJump = useMemo(
    () => (isBoosted ? boostedJump : baseJump),
    [isBoosted, baseJump, boostedJump],
  );
  const currentDash = useMemo(
    () => (isBoosted ? boostedDash : baseDash),
    [isBoosted, baseDash, boostedDash],
  );

  const intialPostion = new THREE.Vector3(-1, 4, 0);
  // const intialPostion = new THREE.Vector3(-2, 5.6, -34);
  // const intialPostion = new THREE.Vector3(-2, 5.6, -23);
  // const intialPostion = new THREE.Vector3(-2, 5.6, -48);
  // const intialPostion = new THREE.Vector3(-2, 12, -72);
  // const intialPostion = new THREE.Vector3(-2, 9.6, -78);

  useEffect(() => {
    if (!isBoosted) return;

    const duration = 8 - boostCount;
    boostTimer.current = duration > 0 ? duration : 1; // évite valeur négative
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBoosted]);

  const isGrounded = useRef(false);
  const currentPlatformHandle = useRef<number | null>(null);

  const checkGrounded = () => {
    if (!rigidBodyRef.current) return;

    const rb = rigidBodyRef.current;
    const origin = rb.translation();
    const down = { x: 0, y: -1, z: 0 };
    const shape = new rapier.Capsule(0.2, 0.1); // radius, halfHeight

    const hit = world.castShape(
      { x: origin.x, y: origin.y - 0.25, z: origin.z },
      { x: 0, y: 0, z: 0, w: 1 },
      down,
      shape,
      0.05,
      1,
      false,
    );

    if (hit && hit.collider !== undefined) {
      const collider = world.getCollider(hit.collider.handle);
      const parent = collider?.parent();

      isGrounded.current = true;

      if (parent) {
        const handle = parent.handle;
        currentPlatformHandle.current = handle;

        // Récupère la vitesse depuis le store (mise à jour par Level2Block1)
        const platformVX = velocityByPlatformHandle[handle] ?? 0;
        setPlatformVelocityX(platformVX);
      } else {
        currentPlatformHandle.current = null;
        setPlatformVelocityX(0);
      }
    } else {
      isGrounded.current = false;
      currentPlatformHandle.current = null;
      setPlatformVelocityX(0);
    }
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

  useEffect(() => {
    const handleDash = (e: KeyboardEvent) => {
      if (e.code === "ShiftLeft" && dashAvailable) {
        triggerDash();

        const impulse = direction
          .clone()
          .normalize()
          .multiplyScalar(currentDash); // à ajuster
        rigidBodyRef.current?.applyImpulse(
          { x: impulse.x, y: 0, z: impulse.z },
          true,
        );
      }
    };

    window.addEventListener("keydown", handleDash);
    return () => window.removeEventListener("keydown", handleDash);
  }, [dashAvailable, direction, rigidBodyRef, triggerDash, currentDash]);

  useFrame((state, delta) => {
    const body = rigidBodyRef.current;

    if (shouldRestartGame) {
      if (body) {
        body.setTranslation(intialPostion, true);
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
      useBoostStore.getState().resetBoost(); // met isBoosted à false
      useDashStore.getState().resetDash(); // met isDashing à false
      resetShouldRestartGame();
      return;
    }
    if (!body) return;
    if (isBoosted) {
      boostTimer.current -= delta;
      if (boostTimer.current <= 0) {
        useBoostStore.getState().resetBoost(); // met isBoosted à false
      }
    }
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

    body.setLinvel(
      {
        x: direction.x + platformVelocityX * 1.12,
        y: linvel.y,
        z: direction.z,
      },
      true,
    );

    // CAMERA;
    if (!cameraFollowRef.current) return;
    // On récupère la position actuelle et on lisse sur le ref visuel
    const bodyPos = new THREE.Vector3().copy(body.translation());

    // Smooth follow
    cameraFollowRef.current.position.lerp(bodyPos, 8 * delta);

    const idealOffset = new THREE.Vector3(5.5, 8.5, 4.5); // (inversé selon besoin)
    const idealLookAt = new THREE.Vector3(0, 0, 0);

    const cameraPos = cameraFollowRef.current.position.clone().add(idealOffset);

    const target = cameraFollowRef.current.position.clone().add(idealLookAt);

    state.camera.position.lerp(cameraPos, 5 * delta);
    state.camera.lookAt(target);

    // Dash
    updateDash(delta, isBoosted);

    if (dashTrailRef.current && rigidBodyRef.current) {
      const p = rigidBodyRef.current.translation();
      dashTrailRef.current.position.set(p.x, p.y, p.z);
    }
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
        <object3D ref={dashTrailRef} />

        <CapsuleCollider args={[0.25, 0.25]} />
        <CharactereModel />
      </RigidBody>

      <TrailFollow
        isDashing={isDashing || isBoosted}
        color={"#feffcf"}
        target={dashTrailRef as React.RefObject<THREE.Object3D>}
      />
    </>
  );
}

export default Charactere;
