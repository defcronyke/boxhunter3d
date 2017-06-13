import BABYLON from 'babylonjs/dist/preview release/babylon.max.js';

export default class Level2 {
  constructor(game) {
    this.game = game;
  }

  start() {
    this.game.addGround(new BABYLON.Vector3(100, 100, 2), 0, 0.5);
    this.game.addBox(new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(0, 1, -20), 0.25, 0.5, 0.5, '../../assets/img/level1/crate.png');
    this.game.addBox(new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(0, 2, -20), 0.25, 0.5, 0.5, '../../assets/img/level1/crate.png');
    this.game.addBox(new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(0, 3, -20), 0.25, 0.5, 0.5, '../../assets/img/level1/crate.png');
    this.game.addGoalBox(new BABYLON.Vector3(0, 4, -20));
    this.game.addSphere(new BABYLON.Vector3(0, 10, -40));
  }
}
