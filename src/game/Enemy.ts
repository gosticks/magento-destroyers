import { group } from "console";
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
  spacing: THREE.Vector3;
  origin: THREE.Vector3;
  enemyOptions: IEnemyOptions;
  movementSpeedX: number;
  movementSpeedZ: number;
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

export class BasicEnemy {
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
    this.mesh = createEnemyMesh(options.size);
  }

  public update = () => {
    this.mesh.rotation.z += 0.02;
  };
}

const targetMovement = 25;

export class EnemyGroup {
  public static createGrid = (
    scene: THREE.Scene,
    rows: number,
    cols: number,
    options: IEnemyGridSpawnOptions
  ): EnemyGroup => {
    // compute enemy size
    const group = new EnemyGroup(scene);
    group.movementSpeedX = options.movementSpeedX;
    group.movementSpeedZ = options.movementSpeedZ;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // create enemy
        const enemy = new BasicEnemy();

        // set enemy position in grid
        enemy.mesh.position.x =
          options.origin.x +
          col * (options.spacing.x + options.enemyOptions.size);
        enemy.mesh.position.y = options.origin.y + options.spacing.y;
        enemy.mesh.position.z =
          options.origin.z +
          row * (options.spacing.z + options.enemyOptions.size);

        group.add(enemy);
      }
    }
    return group;
  };

  private moveDirectionX = 1;
  private moveOffsetX = 0;
  public isEmpty: boolean = true;

  private group: THREE.Group;
  private entities: BasicEnemy[] = [];
  private movementSpeedX = 0.4;
  private movementSpeedZ = 0.2;

  // onscreen bounding box size of enemy group including all entities
  public size: { width: number; height: number } = { width: 0, height: 0 };

  constructor(private scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.scene.add(this.group);
  }

  public add = (enemy: BasicEnemy) => {
    this.group.add(enemy.mesh);
    this.entities.push(enemy);
    this.isEmpty = false;
  };

  public removeEntity = (enemy: BasicEnemy) => {
    this.group.remove(enemy.mesh);
    const index = this.entities.indexOf(enemy);

    if (index !== -1) {
      this.entities.splice(index, 1);
    }

    this.isEmpty = this.entities.length === 0;
  };

  public remove = () => {
    this.scene.remove(this.group);
  };

  public update = () => {
    if (this.group.position.x < -targetMovement) {
      this.moveDirectionX = +1;
    }
    if (this.group.position.x > targetMovement) {
      this.moveDirectionX = -1;
    }
    let enemyStepX = this.movementSpeedX * this.moveDirectionX;

    this.group.position.z += this.movementSpeedZ;
    this.group.position.x += enemyStepX;

    this.entities.forEach((e) => e.update());
  };

  public checkPlaneCollision = (plane: THREE.Plane) => {
    const box = new THREE.Box3().setFromObject(this.group);
    return box.intersectsPlane(plane);
  };

  public getCollidingEntity = (pos: THREE.Vector3): BasicEnemy | undefined => {
    const adjustedPos = new THREE.Vector3(
      pos.x - this.group.position.x,
      0,
      pos.z - this.group.position.z
    );
    return this.entities.find(
      (e) =>
        Math.abs(e.mesh.position.z - adjustedPos.z) <= 10 &&
        Math.abs(e.mesh.position.x - adjustedPos.x) <= 5
    );
  };
}
