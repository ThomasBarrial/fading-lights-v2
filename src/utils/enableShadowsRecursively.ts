import * as THREE from "three";

function enableShadowsRecursively(object: THREE.Object3D) {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

export default enableShadowsRecursively;
