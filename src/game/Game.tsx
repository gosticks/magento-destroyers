import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { addBgEffect, animateBgEffect } from "./backgroundEffect";
import { IEnemy, spawnEnemyGrid } from "./Enemy";
import createInputHandler, { KeyCodes } from "./inputHandler";
import { createPlayerInstance, IPlayer } from "./Player";

export interface CanvasProps {
  width: number;
  height: number;
}

export interface IGame {
  player: IPlayer;
  enemies: IEnemy[];
  // TODO: create types
  projectiles: any[];
  inputHandler: any;

  // TODO: move this away
  options: {
    offset: number;
    direction: number;
  };
}

const loader = new THREE.TextureLoader();
loader.setPath("textures/");

const targetMovement = 50;

const globalOptions = {
  fov: 50,
  near: 0.1,
  far: 500,
};

let game: IGame;

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

  const aspect = width / height;

  const camera = new THREE.PerspectiveCamera(
    globalOptions.fov,
    aspect,
    globalOptions.near,
    globalOptions.far
  );
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

  game = setupGame(scene);

  const stars = addBgEffect(scene);

  // start render loop
  const render = () => {
    // update game logic
    updateGame(scene, game);

    requestAnimationFrame(render);

    // render scene and effects
    renderer.render(scene, camera);
    animateBgEffect(stars);
  };

  render();
};

const updateGame = (scene: THREE.Scene, game: IGame) => {
  game.inputHandler.run();

  game.projectiles.forEach((projectile) => {
    projectile.position.z -= 0.5;
    if (projectile.position.z >= globalOptions.far) {
      projectile.remove();
    }
  });

  if (game.options.offset < -targetMovement) {
    game.options.direction = +1;
  }
  if (game.options.offset > targetMovement) {
    game.options.direction = -1;
  }
  let enemyStepX = 0.2 * game.options.direction;
  game.options.offset += enemyStepX;
  game.enemies.forEach((enemy, i) => {
    enemy.mesh.rotation.y += 0.01;
    enemy.mesh.position.x += enemyStepX;

    game.projectiles.forEach((projectile, j) => {
      if (
        enemy.mesh.position.z - projectile.position.z >= 0 &&
        Math.abs(enemy.mesh.position.x - projectile.position.x) <= 5
      ) {
        enemy.mesh.position.y -= 70;
        scene.remove(projectile);
        scene.remove(enemy.mesh);
        game.projectiles.splice(j, 1);
        game.enemies.splice(i, 1);
      }
    });
  });
};

const setupGame = (scene: THREE.Scene): IGame => {
  const player = createPlayerInstance();
  scene.add(player.mesh);
  const stepSize = 2;

  // TODO: move
  const shoot = () => {
    if (!game.player.canShoot) {
      return;
    }
    game.projectiles.push(createProjectile(scene, game.player.mesh.position));
    game.player.canShoot = false;
    setTimeout(() => {
      game.player.canShoot = true;
    }, 500);
  };

  const inputHandler = createInputHandler();
  inputHandler.keyHandlers = new Map<KeyCodes, () => void>([
    [
      KeyCodes.leftArrow,
      () => {
        player.mesh.position.x -= stepSize;
      },
    ],

    [
      KeyCodes.rightArrow,
      () => {
        player.mesh.position.x += stepSize;
      },
    ],

    [
      KeyCodes.space,
      () => {
        shoot();
      },
    ],
  ]);

  return {
    player: player,
    enemies: spawnEnemyGrid(scene, {
      origin: new THREE.Vector3(-30, 0, -150),
      spacing: new THREE.Vector3(20, 0, 20),
      rows: 5,
      cols: 5,
      enemyOptions: { size: 5, initialHealth: 10 },
    }),
    projectiles: [],
    inputHandler: inputHandler,
    options: {
      offset: 0,
      direction: -1,
    },
  };
};

const createProjectile = (scene: THREE.Scene, origin: THREE.Vector3) => {
  const materials = new THREE.MeshPhongMaterial({ color: 0xddd500 });
  const boxGeometry = new THREE.SphereGeometry(1);

  const projectile = new THREE.Mesh(boxGeometry, materials);
  projectile.position.set(origin.x, origin.y, origin.z);
  scene.add(projectile);
  return projectile;
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
