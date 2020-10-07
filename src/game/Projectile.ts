import * as THREE from "three";

export interface IProjectile {}

export const createProjectile = (scene: THREE.Scene, origin: THREE.Vector3) => {
  // const materials = new THREE.MeshPhongMaterial({ color: 0xddd500 });
  // const boxGeometry = new THREE.SphereGeometry(1);

  // const projectile = new THREE.Mesh(boxGeometry, materials);
  let curve = new THREE.LineCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1)
  );
  let baseGeometry = new THREE.TubeBufferGeometry(curve, 25, 1, 8, false);
  let material = new THREE.MeshBasicMaterial({ color: 0x545454 });
  const projectile = new THREE.Mesh(baseGeometry, material);

  projectile.position.set(origin.x, origin.y, origin.z);
  scene.add(projectile);
  return projectile;
};

const materialShader: THREE.Shader = {
  uniforms: {
    uColor: new THREE.Uniform(new THREE.Color("0xdddddd")),
  },
  vertexShader: `
  varying vec2 texCoords;
  void main() {
    texCoords = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
  }`,
  fragmentShader: `
    uniform vec3 uColor;  
    varying vec2 texCoords;

    void main() {
        vec3 color = vec3(uColor * texCoords.y * 0.5 );
        gl_FragColor = vec4(color,0.1);
    }
  `,
};

class Projectile {
  public mesh: THREE.Mesh;

  constructor(origin: THREE.Vector3) {
    const baseGeometry = new THREE.SphereGeometry(1);
    // let baseGeometry = new THREE.TubeBufferGeometry(curve, 25, 1, 8, false);
    let material = new THREE.ShaderMaterial({ ...materialShader });
    this.mesh = new THREE.Mesh(baseGeometry, material);
    this.mesh.position.x = origin.x;
    this.mesh.position.y = -5;
  }
}

export default Projectile;
