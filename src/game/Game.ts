import * as THREE from "three";
import StarsEffect from "./effects/StarsEffect";
import BasicEnemy, { loadEnemyMesh } from "./Enemy";
import createInputHandler, {
  KeyCodes,
  waitForOrientationRequest,
} from "./utils/inputHandler";
import Player, { loadMesh } from "./Player";
import AbstractEffect from "./effects/AbstractEffect";
import ControlDelegate from "./ControlDelegate";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import CrtPass from "./effects/CrtEffect";
import EnemyGroup from "./EnemyGroup";

export interface IGameState {
  score: number;

  player: Player;
  enemies: EnemyGroup[];
  finishPlane: THREE.Plane;
  enemyMovementSpeedX: number;
  enemymovementSpeedZ: number;
}

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
  private inputHandler: ReturnType<typeof createInputHandler> | undefined;

  constructor(
    private width: number,
    private height: number,
    private pixelRatio: number,
    private el: HTMLElement
  ) {
    // setup texture loader
    this.loader.setPath("textures/");

    // setup all assets
    Promise.all([loadEnemyMesh(), loadMesh()])
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

    let fov = Game.globalOptions.fov;
    if (width < 768) {
      fov = 90;
    }

    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(
      fov,
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

  public handleDeviceOrientationChange = (e: DeviceOrientationEvent) => {
    if (!e.gamma) {
      return;
    }
    console.log("Gamma", e.gamma);
    const gamma = Math.min(Math.max(e.gamma, -40), +40) / 80;
    this.state.player.mesh.position.x = gamma * 140;
  };

  public setupGameInputHandling = (player: Player) => {
    // remove old key handlers if present
    if (this.inputHandler) {
      this.el.removeEventListener("touchstart", player.shoot);
      this.inputHandler.destroy();
    }

    const inputHandler = createInputHandler(this.handleDeviceOrientationChange);
    this.el.addEventListener("touchstart", player.shoot);
    inputHandler.keyHandlers = new Map<KeyCodes, () => void>([
      [
        KeyCodes.leftArrow,
        () => {
          player.move(-1);
        },
      ],
      [
        KeyCodes.rightArrow,
        () => {
          player.move(1);
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

    this.inputHandler = inputHandler;
  };

  public onStartGame = async () => {
    // wait till the orientation event was either allowed or not
    try {
      await waitForOrientationRequest();
    } catch (e) { }

    if (this.delegate && this.delegate.onStartGame) {
      this.delegate.onStartGame();
    }

    // setup initial game state
    this.resetGameState();

    // setup input handler
    this.setupGameInputHandling(this.state.player);

    this.started = true;
    this.paused = true;
    this.startLevel();

    // start render loop
    this.render();
    this.paused = false;
  };

  public startLevel = () => {
    // remove all enemies
    this.state.enemies.forEach((g) => g.remove());
    this.state.enemies = [];

    // remove all projectiles
    this.state.player.projectiles.forEach((p) => this.scene.remove(p.mesh));
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
      color: 0xeeeeee,
      linewidth: 100,
      scale: 2,
      dashSize: 10,
      gapSize: 10,
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

  /**
   * clears old game state if present
   */
  private resetGameState = () => {
    if (!this.state) {
      this.state = this.setupGameState();
      return;
    }

    // remove everything
    this.state.player.projectiles.forEach((p) => p.delete());
    this.scene.remove(this.state.player.mesh);
    this.state.enemies.forEach((e) => e.remove());

    this.state = this.setupGameState();
  };

  private setupGameState = (): IGameState => {
    const player = new Player(this.scene);
    this.scene.add(player.mesh);
    return {
      score: 0,
      player: player,
      enemies: [],
      finishPlane: new THREE.Plane(new THREE.Vector3(0, 0, 1)),
      enemyMovementSpeedX: 0.3,
      enemymovementSpeedZ: 0.2,
    };
  };

  public pause = () => {
    this.paused = true;
    if (this.delegate?.onPaused) {
      this.delegate!.onPaused();
    }
  };

  public resume = () => {
    this.paused = false;
    if (this.delegate?.onResumed) {
      this.delegate!.onResumed();
    }
    // this.render();
  };

  private render = () => {
    if (!this.started) {
      return;
    }
    this.inputHandler!.run();

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
    // update player
    this.state.player.update();

    this.state.player.projectiles.forEach((p) => p.update());

    // filter out unused projectiles
    this.state.player.projectiles = this.state.player.projectiles.filter(
      (p) => !p.deleted
    );

    this.state.enemies = this.state.enemies.filter((e) => !e.isEmpty);
    this.state.enemies.forEach((group) => {
      group.update();

      // check for collision
      this.state.player.projectiles.forEach((proj, j) => {
        const enemy = group.getCollidingEntity(proj.mesh.position);
        if (!enemy) {
          return;
        }

        group.removeEntity(enemy);
        this.onEnemyKilled(enemy);
        this.state.player.projectiles.splice(j, 1);
        this.scene.remove(proj.mesh);
      });

      // check if enemy collides with finish
      if (group.checkPlaneCollision(this.state.finishPlane)) {
        this.gameOver();
      }
    });

    // if no more enemies spawn new ones
    if (this.state.enemies.length === 0) {
      this.spawnNextWave();
    }
  };

  private spawnNextWave = () => {
    this.state.enemies.push(
      EnemyGroup.createGrid(this.scene, 5, 5, {
        origin: new THREE.Vector3(-30, 0, -250),
        spacing: new THREE.Vector3(20, 0, 20),
        enemyOptions: { size: 5, initialHealth: 10 },
        movementSpeedX: this.state.enemyMovementSpeedX,
        movementSpeedZ: this.state.enemymovementSpeedZ,
      })
    );

    this.state.enemyMovementSpeedX += 0.1;
    this.state.enemymovementSpeedZ += 0.05;
    this.state.player.fireTimeout = Math.max(
      0.01,
      this.state.player.fireTimeout - 0.09
    );
    this.state.player.stepSize = Math.min(10, this.state.player.stepSize + 0.1);
  };

  private gameOver = () => {
    this.started = false;
    if (this.delegate?.onGameOver) {
      this.delegate.onGameOver(this.state.score, "You are just bad!");
    }
  };

  private onEnemyKilled = (enemy: BasicEnemy) => {
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
