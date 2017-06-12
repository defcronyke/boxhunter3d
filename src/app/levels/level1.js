import BABYLON from 'babylonjs/dist/preview release/babylon.max.js';

export default class Level1 {
  constructor(game) {
    this.game = game;
  }

  start() {
    this.game.addGround();
    this.game.addBox(new BABYLON.Vector3(3, 3, 3), new BABYLON.Vector3(0, 2, -20), 0.25, 0.5, 0.5);
    this.game.addBox(new BABYLON.Vector3(3, 3, 3), new BABYLON.Vector3(0, 5, -20), 0.25, 0.5, 0.5);
    this.game.addBox(new BABYLON.Vector3(3, 3, 3), new BABYLON.Vector3(0, 8, -20), 0.25, 0.5, 0.5);
    this.game.addGoalBox(new BABYLON.Vector3(0, 10, -20));
    this.game.addSphere(new BABYLON.Vector3(0, 10, -40));
  }
}
