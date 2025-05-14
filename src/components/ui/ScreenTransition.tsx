"use client";

import { useEffect, useState } from "react";
import { useTransitionStore } from "@/store/useTransitionStore";
import { useRouter } from "next/navigation";

const DURATION = 1800; // durée totale en ms

export default function ScreenTransition() {
  const { isTransitioning, endTransition } = useTransitionStore();
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isTransitioning) return;

    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / DURATION, 1); // clamp entre 0 et 1
      setProgress(p);

      if (p < 1) {
        requestAnimationFrame(animate);
      } else {
        console.log("Transition terminée");
        // Quand tout est noir
        setShowText(true);
        setTimeout(() => {
          endTransition();
          router.push("/level2");
        }, 3000);
      }
    };

    requestAnimationFrame(animate);
  }, [isTransitioning, router, endTransition]);

  const inverse = 1 - progress;

  if (!isTransitioning && progress === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: `radial-gradient(circle at center, transparent ${inverse * 100}%, black ${inverse * 100}%)`,
        transition: "background 0.1s linear",
      }}
    >
      {showText && (
        <p className="text-white text-2xl font-serif animate-fadeIn">
          “Il faut toucher le fond pour remonter.”
        </p>
      )}
    </div>
  );
}
