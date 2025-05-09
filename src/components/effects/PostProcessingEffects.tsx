// components/PostProcessingEffects.tsx
import { EffectComposer, Vignette } from "@react-three/postprocessing";
import { useBoostStore } from "@/store/useBoostStore";
import { useMemo } from "react";

export default function PostProcessingEffects() {
  const { isBoosted, corruptionLevel } = useBoostStore();

  // On calcule l’intensité en fonction du contexte
  const vignetteDarkness = useMemo(() => {
    const base = 0.2;
    const corruptionEffect = corruptionLevel * 0.6;
    const boostEffect = isBoosted ? 0.4 : 0;
    return Math.min(base + corruptionEffect + boostEffect, 1);
  }, [isBoosted, corruptionLevel]);

  return (
    <EffectComposer>
      <Vignette eskil={false} offset={0.3} darkness={vignetteDarkness} />
    </EffectComposer>
  );
}
