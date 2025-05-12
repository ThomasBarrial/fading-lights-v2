import { RigidBody } from "@react-three/rapier";
import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import TreesBackground from "../env/TreesBackground";
import trees_block1_level1 from "@/utils/level1/block1/trees_block1";
import RocksBackground from "../env/RocksBackground";
import rocks_block1 from "@/utils/level1/block1/rocks_block1";
import enableShadowsRecursively from "@/utils/enableShadowsRecursively";

function Level1Block1() {
  const { scene: block1 } = useGLTF("/models/level1/level_1_block_1.gltf");

  const { scene: plantsGrass } = useGLTF(
    "/models/level1/plants_level_1_block_1.gltf",
  );

  useEffect(() => {
    if (block1) {
      enableShadowsRecursively(block1);
      enableShadowsRecursively(plantsGrass);
    }
  }, [block1, plantsGrass]);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive
          rotation={[0, Math.PI / 2, 0]}
          object={block1}
          scale={1.1}
          position={[0, 1.1, 0]}
        />
      </RigidBody>

      <primitive
        rotation={[0, Math.PI / 2, 0]}
        object={plantsGrass}
        scale={1.1}
        position={[0, 1.1, 0]}
      />

      <TreesBackground
        maxX={-20}
        minZ={-15}
        maxZ={8}
        treesPositions={trees_block1_level1}
      />
      <RocksBackground
        minZ={-15}
        maxZ={8}
        rocksPosition={rocks_block1}
        maxX={-15}
      />
    </group>
  );
}

export default Level1Block1;
