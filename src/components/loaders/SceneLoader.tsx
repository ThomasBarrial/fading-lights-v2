import { Html } from "@react-three/drei";

export default function SceneLoader() {
  return (
    <Html center>
      <div className="flex items-center  font-bold justify-center bg-black p-4 rounded w-screen h-screen text-white font-jersey-25">
        <p className="text-2xl">Loading...</p>
      </div>
    </Html>
  );
}
