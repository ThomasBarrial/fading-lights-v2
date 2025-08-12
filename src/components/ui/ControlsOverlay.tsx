"use client";

import { useIsMenuOpen } from "@/store/isMenuOpen";
import Image from "next/image";
import { useEffect, useState } from "react";

const CONTROL_KEYS = [
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "Space",
  "ShiftLeft",
] as const;
type ControlKey = (typeof CONTROL_KEYS)[number];

export default function ControlsOverlay() {
  const { isControlsOpen, closeControls, openControls } = useIsMenuOpen();
  const [pressedKeys, setPressedKeys] = useState<Set<ControlKey>>(new Set());

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenControlsOverlay");
    if (!hasSeen) {
      openControls();
      localStorage.setItem("hasSeenControlsOverlay", "true");
    }
  }, [openControls]);

  // Listen to keydown/up events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (CONTROL_KEYS.includes(e.code as ControlKey)) {
        setPressedKeys((prev) => new Set(prev).add(e.code as ControlKey));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (CONTROL_KEYS.includes(e.code as ControlKey)) {
        setPressedKeys((prev) => {
          const updated = new Set(prev);
          updated.delete(e.code as ControlKey);
          return updated;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const isPressed = (key: ControlKey) => pressedKeys.has(key);

  return (
    <>
      {isControlsOpen && (
        <div
          className={`bg-white fixed bottom-4 left-4 px-5 py-3 rounded-xl flex flex-col items-center gap-4 transition-all duration-300 ease-in-out overflow-hidden font-jersey-10 z-20`}
        >
          <div className="w-full flex justify-between items-center text-black">
            <p>Controls</p>
          </div>

          {/* MOVE UP */}
          <div className="space-y-2 text-black text-center">
            <p>MOVE</p>
            <div
              className={`w-16 h-16 gap-1 flex flex-col items-center justify-center border-black border-2 rounded-md transition-colors duration-200
                ${isPressed("KeyW") ? "bg-black/40 text-black" : "text-black "}`}
            >
              <Image src="/arrow.svg" alt="Up arrow" width={10} height={10} />
              <div>W(z)</div>
            </div>
          </div>

          {/* LEFT / DOWN / RIGHT */}
          <div className="flex gap-4">
            {[
              { key: "KeyA", label: "A(q)", rotation: "-rotate-90" },
              { key: "KeyS", label: "S", rotation: "rotate-180" },
              { key: "KeyD", label: "D", rotation: "rotate-90" },
            ].map(({ key, label, rotation }) => (
              <div
                key={key}
                className={`w-16 h-16 gap-1 flex flex-col items-center justify-center border-2 border-black rounded-md transition-colors duration-200
                  ${isPressed(key as ControlKey) ? "bg-black/40 text-black" : "text-black "}`}
              >
                <Image
                  src="/arrow.svg"
                  alt="Arrow"
                  width={10}
                  height={10}
                  className={rotation}
                />
                <div>{label}</div>
              </div>
            ))}
          </div>

          {/* SPACE */}
          <div className="space-y-2 text-black text-center w-full">
            <p>JUMP</p>
            <div
              className={`w-full h-12 flex items-center justify-center border-2 border-black rounded-md transition-colors duration-200
                ${isPressed("Space") ? "bg-black text-white" : "text-black "}`}
            >
              Space (Jump)
            </div>
          </div>

          {/* SHIFT */}
          <div className="space-y-2 text-black text-center w-full">
            <p>DASH</p>
            <div
              className={`w-full h-12 flex items-center justify-center border-2 border-black rounded-md transition-colors duration-200
                ${isPressed("ShiftLeft") ? "bg-black text-white" : "text-black "}`}
            >
              Left Shift (Dash)
            </div>
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={closeControls}
            className="text-white cursor-pointer focus:outline-none hover:scale-105 transition-transform duration-200 bg-black w-full py-1 rounded-sm"
          >
            CLOSE
          </button>
        </div>
      )}
    </>
  );
}
