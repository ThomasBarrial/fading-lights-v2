// components/PostProcessingEffects.tsx
import {
  EffectComposer,
  Vignette,
  HueSaturation,
  Bloom,
} from "@react-three/postprocessing";
import { useBoostStore } from "@/store/useBoostStore";
import { useMemo } from "react";

export default function PostProcessingEffects() {
  const { isBoosted, corruptionLevel } = useBoostStore();

  // Calcule dynamique du vignette darkness
  const vignetteDarkness = useMemo(() => {
    const base = 0.2;
    const corruptionEffect = corruptionLevel * 0.9;
    const boostEffect = isBoosted ? 0.3 : 0;
    return Math.min(base + corruptionEffect + boostEffect, 0.6); // max 0.6
  }, [isBoosted, corruptionLevel]);

  return (
    <EffectComposer>
      {/* Vignette douce avec décalage vers les bords */}
      <Vignette eskil={false} offset={0.4} darkness={vignetteDarkness} />

      {/* Boost léger de saturation pour compenser l'assombrissement */}
      <HueSaturation saturation={0.03} />

      <Bloom intensity={1.0} />
    </EffectComposer>
  );
}
