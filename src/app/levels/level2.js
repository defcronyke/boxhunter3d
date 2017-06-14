import BABYLON from 'babylonjs/dist/preview release/babylon.max.js';

export default class Level2 {
  constructor(game) {
    this.game = game;
  }

  start() {
    const floorTex = '../../assets/img/level1/floor.png';
    const crateTex = '../../assets/img/level1/crate.png';
    const ballTex = '../../assets/img/level1/ball.png';
    this.game.addGround(new BABYLON.Vector3(100, 100, 2), 0, 0.5, floorTex, floorTex, 3, () => {
      this.game.addBox(new BABYLON.Vector3(10, 10, 1), new BABYLON.Vector3(0, 4, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(-1, 6, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(-1, 8, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(-1, 10, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(-1, 12, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(-1, 14, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(-1, 16, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(1, 6, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(1, 8, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(1, 10, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(1, 12, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(1, 14, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(1, 16, -20), 0.25, 0.5, 0.5, crateTex);
      this.game.addGoalBox(new BABYLON.Vector3(0, 18, -20));
      this.game.addSphere(new BABYLON.Vector3(0, 10, -40), 2, 2, 0, 0.5, ballTex);
    });
  }
}
