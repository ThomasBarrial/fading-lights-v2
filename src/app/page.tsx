"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black">
      <h1 className="text-4xl font-bold mb-8">Fading Lights</h1>
      <button
        className="px-6 py-3 bg-black text-white rounded"
        onClick={() => router.push("/level1")}
      >
        Start Game
      </button>
    </div>
  );
}
