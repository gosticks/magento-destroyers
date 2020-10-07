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

const createEnemyMesh = (size: number, pos?: THREE.Vector3) => {
  return enemyMesh!.clone(); //new THREE.Mesh(boxGeometry, materials);
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
    enemy.scale.setX(300);
    enemy.scale.setY(300);
    enemy.scale.setZ(300);
    enemy.rotation.z = 3.15;
    enemy.rotation.x = 3.15;
    enemyMesh = enemy;
  } catch (e) {
    console.error(e);
  }
};

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
