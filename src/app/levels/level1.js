import BABYLON from 'babylonjs/dist/preview release/babylon.max.js';

export default class Level1 {
  constructor(game) {
    this.game = game;
  }

  start() {
    this.game.addGround(new BABYLON.Vector3(100, 100, 2), 0, 0.5, '../../assets/img/level1/floor.png', '../../assets/img/level1/floor.png', 3, () => {
      this.game.addBox(new BABYLON.Vector3(10, 10, 1), new BABYLON.Vector3(0, 3, -20), 0.25, 1, 0.5, '../../assets/img/level1/crate.png');
      this.game.addBox(new BABYLON.Vector3(3, 3, 3), new BABYLON.Vector3(0, 5, -20), 0.25, 1, 0.5, '../../assets/img/level1/crate.png');
      this.game.addBox(new BABYLON.Vector3(3, 3, 3), new BABYLON.Vector3(0, 8, -20), 0.25, 1, 0.5, '../../assets/img/level1/crate.png');
      this.game.addBox(new BABYLON.Vector3(3, 3, 3), new BABYLON.Vector3(0, 11, -20), 0.25, 1, 0.5, '../../assets/img/level1/crate.png');
      this.game.addGoalBox(new BABYLON.Vector3(0, 13, -20));
      this.game.addSphere(new BABYLON.Vector3(0, 10, -40), 2, 2, 0, 0.5, '../../assets/img/level1/ball.png');
    });
  }
}
