import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import BadTvShader from "./badTvShader";

const scene = new THREE.Scene();

export interface CanvasProps {
  width: number;
  height: number;
}

const loader = new THREE.TextureLoader();
loader.setPath("textures/");

const targetMovement = 50;
const game = {};

const init = (width: number, height: number, el: HTMLElement) => {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 1);

  // setup texture loader

  const scene = new THREE.Scene();

  // Lights

  scene.add(new THREE.AmbientLight(0x111111));

  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // var pointLight = new THREE.PointLight(0xffffff, 1.75, 800);
  // const particleLight = new THREE.Mesh(
  //   new THREE.SphereBufferGeometry(4, 8, 8),
  //   new THREE.MeshBasicMaterial({ color: 0xffffff })
  // );
  // particleLight.add(pointLight);

  const fov = 50; // AKA Field of View
  const aspect = width / height;
  const near = 0.1; // the near clipping plane
  const far = 500; // the far clipping plane

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 80;
  camera.position.y = 60;
  camera.rotation.set(-0.45, 0, 0);
  scene.add(camera);

  // const composer = new EffectComposer(renderer);
  // const renderPass = new RenderPass(scene, camera);
  // const badTVPass = new ShaderPass(BadTvShader);
  // composer.addPass(renderPass);
  // composer.addPass(badTVPass);

  el.appendChild(renderer.domElement);

  const enemies = createEnemies(
    scene,
    new THREE.Vector3(-30, 0, -150),
    new THREE.Vector3(20, 0, 20),
    5,
    5,
    5
  );

  const player = createPlayer(scene);

  const projectiles: THREE.Mesh[] = [];
  let canShoot = true;

  const shoot = () => {
    if (!canShoot) {
      return;
    }
    projectiles.push(createProjectile(scene, player.position));
    canShoot = false;
    setTimeout(() => {
      canShoot = true;
    }, 500);
  };

  const pressedKeys = new Map<number, boolean>();

  const setupKeyControls = () => {
    document.onkeydown = (e) => {
      pressedKeys.set(e.keyCode, true);
    };

    document.onkeyup = (e) => {
      pressedKeys.delete(e.keyCode);
    };
  };

  const update = () => {
    const stepSize = 2;
    pressedKeys.forEach((value, key) => {
      switch (key) {
        case 37:
          player.position.x -= stepSize;
          break;
        case 38:
          player.rotation.x -= stepSize;
          break;
        case 39:
          player.position.x += stepSize;
          break;
        case 40:
          player.rotation.z += stepSize;
          break;
        case 32:
          shoot();
          break;
      }
    });
  };

  let stars = addSphere(scene);

  const animateStars = () => {
    // loop through each star
    stars.forEach((star, i) => {
      star = stars[i];

      // and move it forward dependent on the mouseY position.
      star.position.z += i / 10;

      // if the particle is too close move it to the back
      if (star.position.z > 1000) star.position.z -= 2000;
    });
  };

  let offset = 0;
  let direction = -1;
  // start render loop
  const render = () => {
    update();
    requestAnimationFrame(render);
    renderer.render(scene, camera);

    projectiles.forEach((projectile) => {
      projectile.position.z -= 0.5;
      if (projectile.position.z >= far) {
        projectile.remove();
      }
    });

    if (offset < -targetMovement) {
      direction = +1;
    }
    if (offset > targetMovement) {
      direction = -1;
    }
    let enemyStepX = 0.2 * direction;
    offset += enemyStepX;
    enemies.forEach((enemy, i) => {
      enemy.rotation.y += 0.01;
      enemy.position.x += enemyStepX;

      projectiles.forEach((projectile, j) => {
        if (
          enemy.position.z - projectile.position.z >= 0 &&
          Math.abs(enemy.position.x - projectile.position.x) <= 5
        ) {
          enemy.position.y -= 70;
          scene.remove(projectile);
          scene.remove(enemy);
          projectiles.splice(j, 1);
          enemies.splice(i, 1);
        }
      });
    });

    animateStars();
  };

  setupKeyControls();
  render();
};

const addSphere = (scene: THREE.Scene) => {
  let stars: THREE.Mesh[] = [];
  // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position.
  for (var z = -1000; z < 1000; z += 20) {
    // Make a sphere (exactly the same as before).
    var geometry = new THREE.SphereGeometry(0.5, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var sphere = new THREE.Mesh(geometry, material);

    // This time we give the sphere random x and y positions between -500 and 500
    sphere.position.x = Math.random() * 1000 - 500;
    sphere.position.y = Math.random() * 1000 - 500;

    // Then set the z position to where it is in the loop (distance of camera)
    sphere.position.z = z;

    // scale it up a bit
    sphere.scale.x = sphere.scale.y = 2;

    //add the sphere to the scene
    scene.add(sphere);

    //finally push it to the stars array
    stars.push(sphere);
  }
  return stars;
};

const createExplosion = (
  scene: THREE.Scene,
  origin: THREE.Vector3,
  elements: number = 10
) => {
  const explosion = {
    center: origin,
    elements: [],
  };
};

const createProjectile = (scene: THREE.Scene, origin: THREE.Vector3) => {
  const materials = new THREE.MeshStandardMaterial({ color: 0xddd500 });
  const boxGeometry = new THREE.SphereGeometry(1);

  const projectile = new THREE.Mesh(boxGeometry, materials);
  projectile.position.set(origin.x, origin.y, origin.z);
  scene.add(projectile);
  return projectile;
};

const createPlayer = (scene: THREE.Scene) => {
  const player = createPlayerGeometry(10, new THREE.Vector3(0, 0, 10));
  scene.add(player);
  return player;
};

const createPlayerGeometry = (size: number, pos: THREE.Vector3) => {
  const materials = new THREE.MeshStandardMaterial({ color: 0x0095dd });
  const boxGeometry = new THREE.BoxGeometry(size, size, size);

  const enemy = new THREE.Mesh(boxGeometry, materials);
  enemy.position.set(pos.x, pos.y, pos.z);
  return enemy;
};

const createEnemies = (
  scene: THREE.Scene,
  origin: THREE.Vector3,
  spacing: THREE.Vector3,
  rows: number,
  cols: number,
  size: number
) => {
  let enemies: THREE.Mesh[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cube = createEnemyGeometry(
        size,
        new THREE.Vector3(
          origin.x + col * (spacing.x + size),
          origin.y + spacing.y,
          origin.z + row * (spacing.z + size)
        )
      );
      enemies.push(cube);
      cube.rotation.set(0, 0.0, 0);
      scene.add(cube);
    }
  }

  return enemies;
};

const createEnemyGeometry = (size: number, pos: THREE.Vector3) => {
  const enemyTexture = loader.load("enemy.png");
  const materials = [
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
    new THREE.MeshStandardMaterial({ map: enemyTexture }),
  ];
  const boxGeometry = new THREE.BoxGeometry(size, size, size);

  const enemy = new THREE.Mesh(boxGeometry, materials);
  enemy.position.set(pos.x, pos.y, pos.z);
  return enemy;
};

export default (props: CanvasProps) => {
  const container = useRef<HTMLCanvasElement | undefined>();
  const gl = useRef<WebGLRenderingContext | null>(null);

  // setup gl and canvas when it is setup
  useEffect(() => {
    if (!container.current) {
      return;
    }
    init(props.width, props.height, container.current);
    return () => {
      // TODO: perform any future cleanup here
    };
  }, [container, props.height, props.width]);

  // FIXME: read up on ref usage with modern TS
  return <div ref={container as any}></div>;
};
