import * as THREE from "three";

export interface IProjectile {}

export const createProjectile = (scene: THREE.Scene, origin: THREE.Vector3) => {
  const materials = new THREE.MeshPhongMaterial({ color: 0xddd500 });
  const boxGeometry = new THREE.SphereGeometry(1);

  const projectile = new THREE.Mesh(boxGeometry, materials);
  projectile.position.set(origin.x, origin.y, origin.z);
  scene.add(projectile);
  return projectile;
};
