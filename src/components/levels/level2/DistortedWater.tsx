import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import React, { useRef } from "react";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uDistortionMap;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 distortedUv = vUv + (texture2D(uDistortionMap, vUv * 4.0 + vec2(uTime * 0.1)).rg - 0.5) * 0.1;
    vec3 base = vec3(0.1, 0.2, 0.4); // base eau bleue foncée
    float strength = 0.4;

    vec3 color = mix(base, uColor, strength);
    gl_FragColor = vec4(color, 0.6);
  }
`;

export default function DistortedWater() {
  const ref = useRef<THREE.Mesh>(null);
  const distortionMap = useLoader(
    THREE.TextureLoader,
    "/textures/waternormals.png",
  );

  useFrame((state) => {
    if (
      ref.current?.material &&
      (ref.current.material as THREE.ShaderMaterial).uniforms
    ) {
      (ref.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
        state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={ref} position={[-5, 0.41, -66]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[70, 160]} />
      <shaderMaterial
        transparent
        uniforms={{
          uTime: { value: 0 },
          uDistortionMap: { value: distortionMap },
          uColor: { value: new THREE.Color("#4f5eff") },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
