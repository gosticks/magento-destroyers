import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export interface IEnemy {
  mesh: THREE.Mesh;
  health: number;
  canShoot: boolean;
}

export interface IEnemyOptions {
  size: number;
  initialHealth: number;
}

let enemyMesh: THREE.Mesh | null = null;

export const loadEnemyMesh = async () => {
  const loader = new GLTFLoader();
  try {
    const asset = await loader.loadAsync("enemy-2.gltf");
    if (!asset) {
      return;
    }

    const enemy = asset.scene.getObjectByName("Magento") as THREE.Mesh;

    enemy.material = new THREE.MeshPhongMaterial({
      color: 0xf15c22,
    });
    enemy.scale.setX(303);
    enemy.scale.setY(303);
    enemy.scale.setZ(303);
    enemy.rotation.z = 3.15;
    enemy.rotation.x = 3.15;
    enemyMesh = enemy;
  } catch (e) {
    console.error(e);
  }
};

export default class BasicEnemy {
  public mesh: THREE.Mesh;

  // speed multiplier
  public speed: number = 1;

  // movement amount which will fall every tick
  public acceleration: number = 0;

  constructor(
    options: IEnemyOptions = {
      size: 5,
      initialHealth: 10,
    }
  ) {
    this.mesh = enemyMesh!.clone();
  }

  public update = () => {
    this.mesh.rotation.z += 0.02;
  };
}
