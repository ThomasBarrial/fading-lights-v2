import { Html } from "@react-three/drei";

export default function SceneLoader() {
  return (
    <Html center>
      <div className="flex items-center justify-center bg-black p-4 rounded w-screen h-screen text-white">
        <p className="text-xl">Loading scene...</p>
      </div>
    </Html>
  );
}
