import * as THREE from "three";
import { IEnemy } from "./Enemy";

export interface IPlayer extends IEnemy {}

export const createPlayerInstance = (): IPlayer => {
  const materials = new THREE.MeshPhongMaterial({ color: 0xddd500 });
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0, 4, 5, 3),
    materials
  );

  mesh.position.z = 10;
  return {
    mesh,
    health: 10,
    canShoot: true,
  };
};

export const addPlayerToScene = (scene: THREE.Scene): IPlayer => {
  const player = createPlayerInstance();
  scene.add(player.mesh);
  return player;
};
