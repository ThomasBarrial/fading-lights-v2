import { useCurrentPerfArea } from "@/store/useCurrentPerfArea";
import { RigidBody } from "@react-three/rapier";

interface IProps {
  position: [number, number, number];
  name: string;
  prevArea: string;
}

function PerfArea({ position, name, prevArea }: IProps) {
  const { setPerfArea } = useCurrentPerfArea();
  return (
    <group position={position} name={name}>
      <RigidBody
        type="fixed"
        colliders="cuboid"
        sensor
        onIntersectionEnter={({ other }) => {
          // Handle intersection enter event
          if (other.rigidBodyObject?.name === "player") {
            console.log("Player entered the performance area");
            setPerfArea(name);
          }
        }}
      >
        <mesh>
          <boxGeometry args={[15, 15, 0.1]} />
          <meshStandardMaterial color="hotpink" transparent opacity={0.5} />
        </mesh>
      </RigidBody>
      <RigidBody
        type="fixed"
        colliders="cuboid"
        sensor
        position={[0, 0, 2]}
        onIntersectionEnter={({ other }) => {
          // Handle intersection enter event
          if (other.rigidBodyObject?.name === "player") {
            if (prevArea === name) return;
            setPerfArea(prevArea);
          }
        }}
      >
        <mesh>
          <boxGeometry args={[15, 15, 0.1]} />
          <meshStandardMaterial color="hotpink" transparent opacity={0.5} />
        </mesh>
      </RigidBody>
    </group>
  );
}

export default PerfArea;
