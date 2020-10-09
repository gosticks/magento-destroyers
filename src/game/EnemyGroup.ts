import * as THREE from "three";
import Enemy, { IEnemyOptions } from "./Enemy";

export interface IEnemyGridSpawnOptions {
  spacing: THREE.Vector3;
  origin: THREE.Vector3;
  enemyOptions: IEnemyOptions;
  movementSpeedX: number;
  movementSpeedZ: number;
}

const targetMovement = 25;

export default class EnemyGroup {
  /**
   * create a grid of enemies and spawn them
   * @param scene THREE js rendering scene
   * @param rows
   * @param cols
   * @param options
   */
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
        const enemy = new Enemy();

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

  private moveDirectionX = Math.round(Math.random()) === 0 ? -1 : 1;
  private moveOffsetX = 0;
  public isEmpty: boolean = true;

  private group: THREE.Group;
  private entities: Enemy[] = [];
  private movementSpeedX = 0.4;
  private movementSpeedZ = 0.2;

  // onscreen bounding box size of enemy group including all entities
  public size: { width: number; height: number } = { width: 0, height: 0 };

  constructor(private scene: THREE.Scene) {
    this.group = new THREE.Group();
    this.scene.add(this.group);
  }

  public add = (enemy: Enemy) => {
    this.group.add(enemy.mesh);
    this.entities.push(enemy);
    this.isEmpty = false;
  };

  public removeEntity = (enemy: Enemy) => {
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

  public getCollidingEntity = (pos: THREE.Vector3): Enemy | undefined => {
    const adjustedPos = new THREE.Vector3(
      pos.x - this.group.position.x,
      0,
      pos.z - this.group.position.z
    );
    return this.entities.find(
      (e) =>
        Math.abs(e.mesh.position.z - adjustedPos.z) <= 10 &&
        Math.abs(e.mesh.position.x - adjustedPos.x) <= 10
    );
  };
}
