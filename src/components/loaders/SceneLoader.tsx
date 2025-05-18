import { Html } from "@react-three/drei";

export default function SceneLoader() {
  return (
    <Html center>
      <div className="flex items-center  font-bold justify-center bg-[#FFFAD1] p-4 rounded w-screen h-screen text-[#1A1A1A] font-atma">
        <p className="text-2xl">Loading...</p>
      </div>
    </Html>
  );
}
