import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Projectile from "./Projectile";

export const loadMesh = async () => {
  const loader = new GLTFLoader();
  try {
    const asset = await loader.loadAsync("player.gltf");
    if (!asset) {
      return;
    }

    const playerMesh = asset.scene.getObjectByName("Player") as THREE.Mesh;

    playerMesh.material = new THREE.MeshPhongMaterial({
      color: 0x3498db,
    });
    playerMesh.scale.setX(300);
    playerMesh.scale.setY(300);
    playerMesh.scale.setZ(300);
    playerMesh.rotation.x = 0; //3.15;
    Player.mesh = playerMesh;
  } catch (e) {
    console.error(e);
  }
};

export default class Player {
  static mesh: THREE.Mesh;
  public canShoot: Boolean = true;
  public mesh: THREE.Mesh;
  public projectiles: Projectile[] = [];

  // speed multiplier
  public speed: number = 1;
  // movement amount which will fall every tick
  public acceleration: number = 0;

  public dampening = 0.35;
  public fireTimeout = 250;
  public stepSize = 0.7;

  // movement limitations

  constructor(private scene: THREE.Scene, public minX = -90, public maxX = 90) {
    const mesh = Player.mesh.clone();
    mesh.position.z = 10;
    this.mesh = mesh;
  }

  public shoot = () => {
    if (!this.canShoot) {
      return;
    }
    const p = new Projectile(this.mesh.position, this.scene);
    this.projectiles.push(p);
    this.scene.add(p.mesh);
    this.canShoot = false;
    setTimeout(() => {
      this.canShoot = true;
    }, this.fireTimeout);
  };

  public move = (direction: number, diff: number = this.stepSize) => {
    const newValue = this.acceleration + diff * direction;

    this.acceleration =
      newValue < 0 ? Math.max(newValue, -3) : Math.min(newValue, 3);
  };

  public update = () => {
    let posX = this.mesh.position.x + this.acceleration * this.speed;
    this.mesh.position.x = Math.min(Math.max(posX, this.minX), this.maxX);

    if (!this.acceleration) {
      return;
    }

    this.mesh.rotation.z = this.acceleration * -0.2;
    this.acceleration =
      this.acceleration < 0
        ? Math.min(0, this.acceleration + this.dampening)
        : Math.max(0, this.acceleration - this.dampening);
  };
}
