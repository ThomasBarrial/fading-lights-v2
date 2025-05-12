import InteractivePlateforme from "@/components/models/InteractivePlateforme";
import enableShadowsRecursively from "@/utils/enableShadowsRecursively";
import { useGLTF } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import React, { useEffect, useMemo, useRef, useState } from "react";

export type InteractivePlateformeType = {
  id: string;
  lightFlamePosition?: [number, number, number];
  lightPlateformPosition?: [number, number, number];
  plateformPosition?: [number, number, number];
  particlesPosition?: [number, number, number];
  ref: React.RefObject<RapierRigidBody | null>;
};

function Level1Block4() {
  const { scene: block4 } = useGLTF("/models/level1/level_1_block_4.gltf");

  const sequenceRef = useRef<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const hasLaunched = useRef(false); // pour éviter relance
  const [plateFormActivated, setPlateFormActivated] = useState<string[]>([]);
  const [activeFlames, setActiveFlames] = useState<Set<string>>(new Set());
  const [isSequenceStarted, setIsSequenceStarted] = useState(false);
  const lightRefs = useRef(
    new Map<string, { flame: THREE.PointLight; plateform: THREE.PointLight }>(),
  );

  useEffect(() => {
    if (block4) {
      enableShadowsRecursively(block4);
    }
  }, [block4]);

  const lightUp = (id: string, duration = 600) => {
    const ref = lightRefs.current.get(id);
    if (!ref) return;
    setActiveFlames((prev) => new Set(prev).add(id));
    ref.flame.intensity = 10;
    ref.plateform.intensity = 8;

    setTimeout(() => {
      ref.flame.intensity = 0;
      ref.plateform.intensity = 0;
      setActiveFlames((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, duration);
  };

  const oneLightUp = (id: string) => {
    const ref = lightRefs.current.get(id);
    if (!ref) return;
    ref.flame.intensity = 10;
    ref.plateform.intensity = 8;
    setActiveFlames((prev) => new Set(prev).add(id));
    setPlateFormActivated((prev) => [...prev, id]);
  };

  const lightsOff = () => {
    interactivePlateform.forEach(({ id }) => {
      const ref = lightRefs.current.get(id);
      if (!ref) return;
      ref.flame.intensity = 0;
      ref.plateform.intensity = 0;
      setActiveFlames((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    });
  };

  const launchSequence = () => {
    setIsSequenceStarted(true);
    if (hasLaunched.current) return;
    hasLaunched.current = true;

    // Étape 1 : allumer tous les piliers
    interactivePlateform.forEach(({ id }) => {
      lightUp(id, 1000);
    });

    // Étape 2 : ordre aléatoire
    setTimeout(() => {
      const order = [...interactivePlateform.map((p) => p.id)];
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }

      sequenceRef.current = order;

      // Défilement visuel
      order.forEach((id, index) => {
        setTimeout(
          () => {
            lightUp(id);
          },
          1500 + index * 800,
        );
      });
    }, 1000);
    setIsSequenceStarted(false);
  };

  const interactivePlateform = useMemo(() => {
    return [
      {
        id: "1",
        ref: React.createRef<RapierRigidBody>(),
        lightFlamePosition: [0.35, 8.8, -106.7] as [number, number, number],
        lightPlateformPosition: [0.35, 7.5, -106.1] as [number, number, number],
        plateformPosition: [0.35, 7.4, -106.08] as [number, number, number],
        particlesPosition: [0.35, 8.8, -106.7] as [number, number, number],
      },
      {
        id: "2",
        ref: React.createRef<RapierRigidBody>(),
        lightFlamePosition: [-0.79, 8.8, -106.7] as [number, number, number],
        lightPlateformPosition: [-0.79, 7.5, -106.1] as [
          number,
          number,
          number,
        ],
        plateformPosition: [-0.79, 7.4, -106.08] as [number, number, number],
        particlesPosition: [-0.79, 8.8, -106.7] as [number, number, number],
      },
      {
        id: "3",
        ref: React.createRef<RapierRigidBody>(),
        lightFlamePosition: [-3.98, 8.8, -106.7] as [number, number, number],
        lightPlateformPosition: [-3.98, 7.5, -106.1] as [
          number,
          number,
          number,
        ],
        plateformPosition: [-3.98, 7.4, -106.08] as [number, number, number],
        particlesPosition: [-3.98, 8.8, -106.7] as [number, number, number],
      },
      {
        id: "4",
        ref: React.createRef<RapierRigidBody>(),
        lightFlamePosition: [-5, 8.8, -106.7] as [number, number, number],
        lightPlateformPosition: [-5, 7.5, -106.1] as [number, number, number],
        plateformPosition: [-5, 7.4, -106.08] as [number, number, number],
        particlesPosition: [-5, 8.8, -106.7] as [number, number, number],
      },
    ];
  }, []);
  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive
          rotation={[0, Math.PI / 2, 0]}
          object={block4}
          scale={1.1}
          position={[0, 0.8, 0]}
        />
      </RigidBody>

      {interactivePlateform.map((plateform, index) => (
        <InteractivePlateforme
          isSequenceStarted={isSequenceStarted}
          id={plateform.id}
          key={index}
          lightFlamePosition={plateform.lightFlamePosition}
          lightPlateformPosition={plateform.lightPlateformPosition}
          plateformPosition={plateform.plateformPosition}
          particlesPosition={plateform.particlesPosition}
          onLightRefsReady={({ flame, plateform: plate }) => {
            lightRefs.current.set(plateform.id, {
              flame: flame.current as THREE.PointLight,
              plateform: plate.current as THREE.PointLight,
            });
          }}
          setCurrentStep={setCurrentStep}
          currentStep={currentStep}
          sequenceRef={sequenceRef}
          interactivePlateform={interactivePlateform}
          lightUp={lightUp}
          lightsOff={lightsOff}
          oneLightUp={oneLightUp}
          launchSequence={launchSequence}
          hasLaunched={hasLaunched}
          plateFormActivated={plateFormActivated}
          isActive={activeFlames.has(plateform.id)}
          setPlateFormActivated={setPlateFormActivated}
        />
      ))}
      <RigidBody
        type="fixed"
        colliders="cuboid"
        position={[-2.5, 7.2, -103.7]}
        sensor
        onIntersectionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === "player") {
            launchSequence();
          }
        }}
      >
        <mesh name="launchSequence">
          <boxGeometry args={[6, 0.4, 2]} />
          <meshStandardMaterial color="hotpink" transparent opacity={0} />
        </mesh>
      </RigidBody>
    </group>
  );
}

export default Level1Block4;
