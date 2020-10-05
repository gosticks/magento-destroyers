import * as THREE from "three";
import { createProjectile } from "./Projectile";

export default class Player {
  public canShoot: Boolean = true;
  public mesh: THREE.Mesh;
  public projectiles: ReturnType<typeof createProjectile>[] = [];

  constructor(private scene: THREE.Scene) {
    const materials = new THREE.MeshPhongMaterial({ color: 0xddd500 });
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0, 4, 5, 3),
      materials
    );

    mesh.position.z = 10;
    this.mesh = mesh;
  }

  public shoot = () => {
    if (!this.canShoot) {
      return;
    }
    this.projectiles.push(createProjectile(this.scene, this.mesh.position));
    this.canShoot = false;
    setTimeout(() => {
      this.canShoot = true;
    }, 500);
  };
}
