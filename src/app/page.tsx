"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="h-screen w-screen  text-lg flex flex-col items-center justify-between font-jersey-10 text-center p-10">
      <div className="h-screen w-screen absolute top-0 left-0 z-[-1] ">
        <Image
          src="/images/fadingLightBg.webp"
          alt="Background Image"
          layout="fill"
          priority
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col-reverse md:flex-row w-full md:justify-between justify-start items-start">
        <div className="text-[10rem] flex text-white font-bold mb-8 font-jersey-25 uppercase leading-[0.7] flex-col items-start">
          <h1>Fading</h1>
          <h1>Lights</h1>
          <button
            className="px-10 py-4 border border-white text-xl text-white rounded cursor-pointer mt-12 hover:scale-105 duration-300 hidden md:flex uppercase hover:bg-white hover:text-black"
            onClick={() => router.push("/level1")}
          >
            Start Game
          </button>
          <h2 className="text-2xl font-jersey-10 md:text-lg mt-10 md:hidden flex">
            Experience not available on phone for now{" "}
          </h2>
        </div>
        <h2 className="font-jersey-10 mb-10 md:mb-0">
          A NextJS/React3Fiber/webgl experience
        </h2>
      </div>
      <div className=" flex justify-between w-full flex-col md:flex-row items-start md:items-end">
        <h2 className="font-jersey-10">Web Video Game Prototype</h2>
        <h2>Go through the journey of addiction</h2>
      </div>
    </div>
  );
}
