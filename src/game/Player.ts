import * as THREE from "three";
import Projectile from "./Projectile";

export default class Player {
  public canShoot: Boolean = true;
  public mesh: THREE.Mesh;
  public projectiles: Projectile[] = [];

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
    const p = new Projectile(this.mesh.position);
    this.projectiles.push(p);
    this.scene.add(p.mesh);
    this.canShoot = false;
    setTimeout(() => {
      this.canShoot = true;
    }, 500);
  };
}
