import * as THREE from "three";
import StarsEffect from "./effects/StarsEffect";
import { IEnemy, spawnEnemyGrid, loadEnemyMesh } from "./Enemy";
import createInputHandler, { KeyCodes } from "./utils/inputHandler";
import Player from "./Player";
import AbstractEffect from "./effects/AbstractEffect";
import ControlDelegate from "./ControlDelegate";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import CrtPass from "./effects/CrtEffect";

export interface IGameState {
  score: number;

  player: Player;
  enemies: IEnemy[];
  inputHandler: ReturnType<typeof createInputHandler>;

  // TODO: move this away
  options: {
    offset: number;
    direction: number;
  };
}

const targetMovement = 25;
const screenBounds = 75;
class Game {
  static globalOptions = {
    fov: 60,
    near: 0.1,
    far: 500,
  };

  public delegate?: ControlDelegate;

  private started: boolean = false;
  private paused: boolean = false;
  private loader = new THREE.TextureLoader();
  private renderer!: THREE.WebGLRenderer;
  private composer!: any;
  private state!: IGameState;
  private scene!: THREE.Scene;
  private camera!: THREE.Camera;
  private effectsPipeline: AbstractEffect[] = [];

  constructor(
    private width: number,
    private height: number,
    private pixelRatio: number,
    private el: HTMLElement
  ) {
    // setup texture loader
    this.loader.setPath("textures/");

    // setup all assets
    Promise.all([loadEnemyMesh()])
      .then(() => {
        this.setupGame();
      })
      .catch((e) => console.error("Failed to setup", e));
  }

  // update camera and renderer for a new resolution
  // this may also move the camera to fit the viewport
  public updateSize = (
    width: number,
    height: number,
    pixelRatio: number = 1
  ) => {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);

    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(
      Game.globalOptions.fov,
      aspect,
      Game.globalOptions.near,
      Game.globalOptions.far
    );
    camera.position.z = 80;
    camera.position.y = 130;
    // camera.position.x = 100;
    camera.rotation.set(-0.75, 0, 0);
    this.scene.add(camera);
    if (this.camera) {
      this.scene.remove(this.camera);
    }
    this.camera = camera;
    this.width = width;
    this.height = height;
    this.pixelRatio = pixelRatio;
  };

  public setupGameInputHandling = (player: Player) => {
    const stepSize = 2;

    // remove old key handlers if present
    if (this.state && this.state.inputHandler) {
      this.state.inputHandler.destroy();
    }

    const inputHandler = createInputHandler();
    inputHandler.keyHandlers = new Map<KeyCodes, () => void>([
      [
        KeyCodes.leftArrow,
        () => {
          player.mesh.position.x = Math.max(
            -screenBounds,
            player.mesh.position.x - stepSize
          );
        },
      ],
      [
        KeyCodes.rightArrow,
        () => {
          player.mesh.position.x = Math.min(
            screenBounds,
            player.mesh.position.x + stepSize
          );
        },
      ],
      [KeyCodes.space, player.shoot],
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
      [
        KeyCodes.keyL,
        () => {
          this.startLevel();
        },
      ],
    ]);

    return inputHandler;
  };

  public onStartGame = () => {
    if (this.delegate && this.delegate.onStartGame) {
      this.delegate.onStartGame();
    }

    // only start if not already started
    if (this.started) {
      return;
    }

    // setup initial game state
    this.state = this.setupGameState();

    this.started = true;
    this.startLevel();

    // start render loop
    this.render();
  };

  public startLevel = () => {
    // reset player position
    this.state.player.mesh.position.x = 0;

    // remove all enemies
    this.state.enemies.forEach((enemy) => this.scene.remove(enemy.mesh));

    // remove all projectiles
    this.state.player.projectiles.forEach((p) => this.scene.remove(p.mesh));

    // spawn new enemies
    this.state.enemies = spawnEnemyGrid(this.scene, {
      origin: new THREE.Vector3(-30, 0, 2 * -250),
      spacing: new THREE.Vector3(20, 0, 20),
      rows: 10,
      cols: 5,
      enemyOptions: { size: 5, initialHealth: 10 },
    });
  };

  private setupGame() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });

    this.renderer.setClearColor(0x000000, 1);

    const scene = new THREE.Scene();
    this.scene = scene;

    // Lights
    scene.add(new THREE.AmbientLight(0x111111));

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    this.updateSize(this.width, this.height, this.pixelRatio);

    this.el.appendChild(this.renderer.domElement);
    // this.state = this.setupGameState();
    this.drawDeadline();
    this.setupGameEffects();
  }

  private drawDeadline = () => {
    //create a blue LineBasicMaterial
    const material = new THREE.LineDashedMaterial({
      color: 0xff0000,
      linewidth: 100,
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

    const composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.camera);
    composer.addPass(renderPass);

    const bloomPass = new (UnrealBloomPass as any)();
    composer.addPass(bloomPass);

    const crtPass = new CrtPass();
    composer.addPass(crtPass);

    this.composer = composer;
  };

  private setupGameState = (): IGameState => {
    const player = new Player(this.scene);
    this.scene.add(player.mesh);
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
      inputHandler: this.setupGameInputHandling(player),
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
    this.composer.render(this.scene, this.camera);

    this.effectsPipeline.forEach((effect) => effect.update(this.state));
    // animateBgEffect(this.stars);
  };

  /**
   * update game state
   */
  // TODO: bind to external timer not the framerate
  private update = () => {
    this.state.player.projectiles.forEach((p) => {
      p.mesh.position.z -= 0.5;
      if (p.mesh.position.z >= Game.globalOptions.far) {
        p.mesh.remove();
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
      enemy.mesh.rotation.z += 0.02;
      enemy.mesh.position.z += 0.16;
      enemy.mesh.position.x += enemyStepX;

      if (enemy.mesh.position.z >= -5) {
        this.gameOver(enemy);
        return;
      }

      this.state.player.projectiles.forEach((p, j) => {
        if (
          enemy.mesh.position.z - p.mesh.position.z >= 0 &&
          Math.abs(enemy.mesh.position.x - p.mesh.position.x) <= 5
        ) {
          enemy.mesh.position.y -= 70;
          this.scene.remove(p.mesh);
          this.scene.remove(enemy.mesh);
          this.onEnemyKilled(enemy);
          this.state.player.projectiles.splice(j, 1);
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
