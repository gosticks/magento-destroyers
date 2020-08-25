import * as THREE from "three";

const textureLoaderInstance = new THREE.TextureLoader();
textureLoaderInstance.setPath("textures/");

export const getTextureLoader = () => {
  return textureLoaderInstance;
};
