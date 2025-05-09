// components/ui/GameOverOverlay.tsx
import { useBoostStore } from "@/store/useBoostStore";
import React from "react";

export default function GameOverOverlay() {
  const isDead = useBoostStore((state) => state.isDeadFromCorruption);
  const resetAll = useBoostStore((state) => state.resetAll);

  if (!isDead) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "monospace",
        zIndex: 1000,
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>💀 Game Over</h1>
      <button
        style={{
          padding: "1rem 2rem",
          fontSize: "1.5rem",
          background: "#d62828",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          color: "white",
        }}
        onClick={() => {
          resetAll();
          window.location.reload(); // ← simple refresh pour redémarrer
        }}
      >
        Restart
      </button>
    </div>
  );
}
