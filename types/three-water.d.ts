declare module "three/examples/jsm/objects/Water" {
  import { PlaneGeometry } from "three";
  import { Mesh } from "three";

  interface WaterOptions {
    textureWidth: number;
    textureHeight: number;
    waterNormals: THREE.Texture;
    alpha?: number;
    sunDirection: THREE.Vector3;
    sunColor: number | string;
    waterColor: number | string;
    distortionScale: number;
    fog: boolean;
    format?: number;
  }

  export class Water extends Mesh {
    constructor(geometry: PlaneGeometry, options: WaterOptions);
    material: THREE.ShaderMaterial;
    renderTarget: any;
  }
}
