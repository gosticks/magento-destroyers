import * as THREE from "three";
import { getTextureLoader } from "./textureUtils";

export interface IEnemy {
  mesh: THREE.Mesh;
  health: number;
  canShoot: boolean;
}

export interface IEnemyOptions {
  size: number;
  initialHealth: number;
}

const createEnemyMesh = (size: number, pos?: THREE.Vector3) => {
  const enemyTexture = getTextureLoader().load("enemy.png");
  const materials = [
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
  ];
  const boxGeometry = new THREE.BoxGeometry(size, size, size);

  return new THREE.Mesh(boxGeometry, materials);
};

// EnemySpawner method creates enemies in a scene
export type EnemySpawner<T extends object = {}> = (
  scene: THREE.Scene,
  options: T
) => IEnemy[];

interface IEnemyGridSpawnOptions {
  rows: number;
  cols: number;
  spacing: THREE.Vector3;
  origin: THREE.Vector3;
  enemyOptions: IEnemyOptions;
}

/**
 * creates a grid of enemies in the scene
 * @param scene THREE.Scene
 * @param options enemy creation, layout options
 */
export const spawnEnemyGrid: EnemySpawner<IEnemyGridSpawnOptions> = (
  scene,
  options
) => {
  let enemies: IEnemy[] = [];
  for (let row = 0; row < options.rows; row++) {
    for (let col = 0; col < options.cols; col++) {
      // create enemy
      const enemy = createEnemyInstance(options.enemyOptions);

      // set enemy position in grid
      enemy.mesh.position.x =
        options.origin.x +
        col * (options.spacing.x + options.enemyOptions.size);
      enemy.mesh.position.y = options.origin.y + options.spacing.y;
      enemy.mesh.position.z =
        options.origin.z +
        row * (options.spacing.z + options.enemyOptions.size);

      enemies.push(enemy);
      scene.add(enemy.mesh);
    }
  }
  return enemies;
};

export const createEnemyInstance = (
  options: IEnemyOptions = {
    size: 5,
    initialHealth: 10,
  }
): IEnemy => {
  return {
    mesh: createEnemyMesh(options.size),
    health: options.initialHealth,
    canShoot: true,
  };
};

export const addPlayerToScene = (scene: THREE.Scene): IEnemy => {
  const player = createEnemyInstance();
  scene.add(player.mesh);
  return player;
};
