import * as THREE from "three";
import StarsEffect from "./effects/StarsEffect";
import { IEnemy, spawnEnemyGrid } from "./Enemy";
import createInputHandler, { KeyCodes } from "./utils/inputHandler";
import { createPlayerInstance, IPlayer } from "./Player";
import { createProjectile } from "./Projectile";
import AbstractEffect from "./effects/AbstractEffect";
import ControlDelegate from "./ControlDelegate";

export interface IGameState {
  score: number;

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

const targetMovement = 50;

class Game {
  static globalOptions = {
    fov: 50,
    near: 0.1,
    far: 500,
  };

  public delegate?: ControlDelegate;

  private paused: boolean = false;
  private loader = new THREE.TextureLoader();
  private renderer!: THREE.WebGLRenderer;
  private state!: IGameState;
  private scene!: THREE.Scene;
  private camera!: THREE.Camera;
  private effectsPipeline: AbstractEffect[] = [];

  constructor(
    private width: number,
    private height: number,
    private el: HTMLElement
  ) {
    // setup texture loader
    this.loader.setPath("textures/");

    this.setupGame();
  }

  private setupGame() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);

    const scene = new THREE.Scene();

    // Lights
    scene.add(new THREE.AmbientLight(0x111111));

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const aspect = this.width / this.height;

    const camera = new THREE.PerspectiveCamera(
      Game.globalOptions.fov,
      aspect,
      Game.globalOptions.near,
      Game.globalOptions.far
    );
    camera.position.z = 80;
    camera.position.y = 150;
    camera.rotation.set(-0.75, 0, 0);
    scene.add(camera);

    this.scene = scene;
    this.camera = camera;

    this.el.appendChild(this.renderer.domElement);
    this.state = this.setupGameState();
    this.drawDeadline();
    this.setupGameEffects();

    // start render loop
    this.render();
  }

  private drawDeadline = () => {
    //create a blue LineBasicMaterial
    const material = new THREE.LineDashedMaterial({
      color: 0xff0000,
      linewidth: 10,
      scale: 2,
      dashSize: 5,
      gapSize: 5,
    });
    const points = [];
    points.push(new THREE.Vector3(-1000, 0, 0));
    points.push(new THREE.Vector3(1000, 0, 0));

    const geometry = new THREE.Geometry();
    geometry.vertices = points;

    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    this.scene.add(line);
  };

  private setupGameEffects = () => {
    this.effectsPipeline.push(new StarsEffect(this.scene));
  };

  private setupGameState = (): IGameState => {
    const player = createPlayerInstance();
    this.scene.add(player.mesh);
    const stepSize = 2;

    // TODO: move
    const shoot = () => {
      if (!this.state.player.canShoot) {
        return;
      }
      this.state.projectiles.push(
        createProjectile(this.scene, this.state.player.mesh.position)
      );
      this.state.player.canShoot = false;
      setTimeout(() => {
        this.state.player.canShoot = true;
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

    // setup handlers that should only be triggered on key up
    inputHandler.keySingleHandlers = new Map<KeyCodes, () => void>([
      [
        KeyCodes.escape,
        () => {
          console.log("Escape pressed");
          this.paused ? this.resume() : this.pause();
        },
      ],
    ]);

    return {
      score: 0,
      player: player,
      enemies: spawnEnemyGrid(this.scene, {
        origin: new THREE.Vector3(-30, 0, -250),
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

  private pause = () => {
    this.paused = true;
    if (this.delegate?.onPaused) {
      this.delegate!.onPaused();
    }
  };
  
  private resume = () => {
    console.log("Resume!!!");
    this.paused = false;
    if (this.delegate?.onResumed) {
      this.delegate!.onResumed();
    }
    // this.render();
  };

  private render = () => {
    this.state.inputHandler.run();

    requestAnimationFrame(this.render);

    if (this.paused) {
      return;
    }

    // update game logic
    this.update();

    // render scene and effects
    this.renderer.render(this.scene, this.camera);

    this.effectsPipeline.forEach((effect) => effect.update(this.state));
    // animateBgEffect(this.stars);
  };

  /**
   * update game state
   */
  // TODO: bind to external timer not the framerate
  private update = () => {
    this.state.projectiles.forEach((projectile) => {
      projectile.position.z -= 0.5;
      if (projectile.position.z >= Game.globalOptions.far) {
        projectile.remove();
      }
    });

    if (this.state.options.offset < -targetMovement) {
      this.state.options.direction = +1;
    }
    if (this.state.options.offset > targetMovement) {
      this.state.options.direction = -1;
    }
    let enemyStepX = 0.2 * this.state.options.direction;
    this.state.options.offset += enemyStepX;
    this.state.enemies.forEach((enemy, i) => {
      enemy.mesh.rotation.y += 0.01;
      enemy.mesh.position.z += 0.08;
      enemy.mesh.position.x += enemyStepX;

      if (enemy.mesh.position.z >= -5) {
        this.gameOver(enemy);
        return;
      }

      this.state.projectiles.forEach((projectile, j) => {
        if (
          enemy.mesh.position.z - projectile.position.z >= 0 &&
          Math.abs(enemy.mesh.position.x - projectile.position.x) <= 5
        ) {
          enemy.mesh.position.y -= 70;
          this.scene.remove(projectile);
          this.scene.remove(enemy.mesh);
          this.onEnemyKilled(enemy);
          this.state.projectiles.splice(j, 1);
          this.state.enemies.splice(i, 1);
        }
      });
    });
  };

  private gameOver = (enemy: IEnemy) => {
    this.paused = true;
    if (this.delegate?.onGameOver) {
      this.delegate.onGameOver("You suck!");
    }
  };

  private onEnemyKilled = (enemy: IEnemy) => {
    this.updateScore(50);
  };

  private updateScore = (amount: number) => {
    const oldScore = this.state.score;
    this.state.score += amount;

    if (this.delegate?.onScoreChanged) {
      this.delegate?.onScoreChanged(this.state.score, oldScore);
    }
  };
}

export default Game;
