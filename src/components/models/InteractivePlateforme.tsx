import { useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import CheckpointParticles from "../effects/CheckPointParticles";
import enableShadowsRecursively from "@/utils/enableShadowsRecursively";
import { RigidBody } from "@react-three/rapier";
import { InteractivePlateformeType } from "../levels/level1/level1Blocks/Level1Block4";

function InteractivePlateforme({
  id,
  lightFlamePosition = [1.2, 1.3, 0.4],
  lightPlateformPosition = [0, 0, 0],
  plateformPosition = [0, 0, 0],
  particlesPosition = [0, 0, 0],
  onLightRefsReady,
  sequenceRef,
  setCurrentStep,
  currentStep,
  interactivePlateform,
  lightUp,
  lightsOff,
  oneLightUp,
  launchSequence,
  hasLaunched,
  plateFormActivated,
  isActive,
  setPlateFormActivated,
  isSequenceStarted,
  isSequenceSuccessed,
}: {
  id: string;
  lightFlamePosition?: [number, number, number];
  lightPlateformPosition?: [number, number, number];
  plateformPosition?: [number, number, number];
  particlesPosition?: [number, number, number];
  onLightRefsReady?: (refs: {
    flame: React.RefObject<THREE.PointLight>;
    plateform: React.RefObject<THREE.PointLight>;
  }) => void;
  sequenceRef: React.RefObject<string[]>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
  interactivePlateform: InteractivePlateformeType[];
  lightUp: (id: string, duration?: number) => void;
  lightsOff: () => void;
  oneLightUp: (id: string) => void;
  launchSequence: () => void;
  hasLaunched: React.RefObject<boolean>;
  plateFormActivated: string[];
  isActive: boolean;
  setPlateFormActivated: React.Dispatch<React.SetStateAction<string[]>>;
  isSequenceStarted: boolean;
  isSequenceSuccessed: React.RefObject<boolean>;
}) {
  const { scene: plateform } = useGLTF("/models/level1/plateform_block_4.gltf");
  const { lightColor } = useControls({
    lightColor: "#074EA4",
  });

  useEffect(() => {
    if (plateform) {
      enableShadowsRecursively(plateform);
    }
  }, [plateform]);

  useEffect(() => {
    if (onLightRefsReady && lightRef.current && lightRef2.current) {
      onLightRefsReady({
        flame: lightRef as React.RefObject<THREE.PointLight>,
        plateform: lightRef2 as React.RefObject<THREE.PointLight>,
      });
    }
  }, [onLightRefsReady]);

  const lightRef = useRef<THREE.PointLight>(null);
  const lightRef2 = useRef<THREE.PointLight>(null);

  //   useHelper(
  //     lightRef as React.RefObject<THREE.Object3D>,
  //     THREE.PointLightHelper,
  //     0.5,
  //     "hotpink",
  //   );

  //   useHelper(
  //     lightRef2 as React.RefObject<THREE.Object3D>,
  //     THREE.PointLightHelper,
  //     0.5,
  //     "red",
  //   );
  return (
    <group>
      {isActive && <CheckpointParticles position={particlesPosition} />}

      <pointLight
        ref={lightRef}
        position={lightFlamePosition}
        color={lightColor}
        decay={0.5}
        intensity={0}
        distance={1}
      />
      <pointLight
        ref={lightRef2}
        position={lightPlateformPosition}
        color={lightColor}
        decay={0.5}
        intensity={0}
        distance={1}
      />

      <RigidBody
        type="fixed"
        colliders="cuboid"
        position={plateformPosition}
        sensor
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "player") {
            if (plateFormActivated.includes(id) || isSequenceStarted) return;

            const current = sequenceRef.current[currentStep];

            oneLightUp(id);
            if (id === current) {
              setCurrentStep((prev) => {
                const next = prev + 1;
                if (next === sequenceRef.current.length) {
                  interactivePlateform.forEach(({ id }) => lightUp(id, 1000));
                  isSequenceSuccessed.current = true;
                }
                return next;
              });
            } else {
              hasLaunched.current = false;
              lightsOff();
              setCurrentStep(0);
              setPlateFormActivated([]);
              launchSequence();
            }
          }
        }}
      >
        <mesh name="launchSequence">
          <boxGeometry args={[0.6, 0.2, 0.6]} />
          <meshStandardMaterial color="hotpink" transparent opacity={0} />
        </mesh>
      </RigidBody>
    </group>
  );
}

export default InteractivePlateforme;
