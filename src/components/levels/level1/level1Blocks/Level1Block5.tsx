"use client";
import { useGLTF } from "@react-three/drei";
import React from "react";
import TreesBackground from "../env/TreesBackground";
import trees_block5 from "@/utils/level1/block5/trees_block5";

function Level1Block5() {
  const { scene: block5 } = useGLTF("/models/level1/level_1_block_5.gltf");
  return (
    <group>
      <primitive
        rotation={[0, Math.PI / 2, 0]}
        scale={1.1}
        position={[0, 1.1, 0]}
        object={block5}
      />
      <TreesBackground
        maxZ={-124.4}
        minZ={-130}
        maxX={-15}
        Ypositions={7.4}
        treesPositions={trees_block5}
      />
    </group>
  );
}

export default Level1Block5;
