"use client";

import { useEffect, useRef, useState } from "react";

function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const audio = new Audio("/audio/whispered-sunrise.mp3");
    audio.loop = true;
    audio.volume = 0.3; // volume doux
    audioRef.current = audio;

    const playAudio = () => {
      audio.play().catch((err) => {
        console.warn("Autoplay prevented:", err.message);
      });
    };

    // Chrome requires user interaction to autoplay => jouer au premier input
    window.addEventListener("click", playAudio, { once: true });
    return () => {
      audio.pause();
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggleAudio}
      className="fixed bottom-4 right-4 z-50 bg-[#1A1A1A] text-[#FFFAD1] px-4 py-2 rounded-lg hover:bg-[#333] transition-colors duration-300 font-atma"
    >
      {isPlaying ? "Music On" : "Music Off"}
    </button>
  );
}

export default BackgroundMusic;
