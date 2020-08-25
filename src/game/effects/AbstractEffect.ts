import * as THREE from "three";

import { IGameState } from "../Game";

export interface IGameEffect {
  update: (state: IGameState) => void;
}

export default abstract class {
  constructor(private scene: THREE.Scene) {}

  update(state: IGameState) {}
}
