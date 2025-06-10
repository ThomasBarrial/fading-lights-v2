"use client";
import { useIsPlayerDied } from "@/store/useIsPlayerDied";
import React from "react";

function PlayerDiedOverlay() {
  const { isPlayerDiedState } = useIsPlayerDied();

  if (!isPlayerDiedState) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-50 pointer-events-none animate-fadeIn-diedOverlay"
      style={{
        background: `radial-gradient(circle at center, rgba(90,0,0,0) 60%, rgba(120,0,0,1) 100%)`,
      }}
    />
  );
}

export default PlayerDiedOverlay;
