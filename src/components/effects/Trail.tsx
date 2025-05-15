import { Trail } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

export default function TrailFollow({
  target,
  color,
  isDashing,
}: {
  target: React.RefObject<THREE.Object3D>;
  color: string;
  isDashing: boolean;
}) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isDashing) {
      setIsActive(true);
    } else {
      timeout = setTimeout(() => {
        setIsActive(false);
      }, 200); // Délai de 1 seconde avant de désactiver le trail
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isDashing]);

  if (!target.current) return null;
  return (
    <Trail
      width={isActive ? 3 : 0} // largeur du trail
      length={3} // nombre de points stockés
      decay={0.5} // vitesse de disparition
      color={color} // bleu clair
      attenuation={(t) => t * t} // forme du trail
    >
      <primitive object={target.current} />
    </Trail>
  );
}
