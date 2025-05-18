"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center font-atma  text-center">
      <div className="h-screen w-screen absolute top-0 left-0 z-[-1] ">
        <Image
          src="/images/bgfadinglight.webp"
          alt="Background Image"
          layout="fill"
          priority
          objectFit="cover"
        />
      </div>
      <h1 className="text-[10rem] text-[#FFFAD1] font-bold mb-8 ">
        Fading Lights
      </h1>
      <button
        className="px-10 py-4 bg-[#FFFAD1] text-2xl text-[#1A1A1A] rounded cursor-pointer mt-10 hover:scale-105 duration-300"
        onClick={() => router.push("/level1")}
      >
        Start Game
      </button>
    </div>
  );
}
