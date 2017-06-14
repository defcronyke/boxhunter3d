import BABYLON from 'babylonjs/dist/preview release/babylon.max.js';

export default class Level4 {
  constructor(game) {
    this.game = game;
  }

  start() {
    const floorTex = '../../assets/img/level1/floor.png';
    const crateTex = '../../assets/img/level1/crate.png';
    const ballTex = '../../assets/img/level1/ball.png';
    this.game.addGround(new BABYLON.Vector3(100, 100, 2), 0, 0.5, floorTex, floorTex, 3, () => {
      this.game.addBox(new BABYLON.Vector3(100, 100, 1), new BABYLON.Vector3(0, 3, 0), 0, 0.5, 1.1, crateTex);
      this.game.addBox(new BABYLON.Vector3(5, 5, 18), new BABYLON.Vector3(0, 18, 0), 3, 0.5, 0, crateTex);

      const boxMass = 0.25;
      for (let i = 4; i <= 18; i += 2) {
        this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(0, i, -6), boxMass, 0.1, 0, crateTex);
      }

      for (let i = 4; i <= 16; i += 2) {
        this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(0, i, -8), boxMass, 0.1, 0, crateTex);
      }

      for (let i = 4; i <= 14; i += 2) {
        this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(0, i, -10), boxMass, 0.1, 0, crateTex);
      }

      for (let i = 4; i <= 12; i += 2) {
        this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(0, i, -12), boxMass, 0.1, 0, crateTex);
      }

      for (let i = 4; i <= 10; i += 2) {
        this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(0, i, -14), boxMass, 0.1, 0, crateTex);
      }

      for (let i = 4; i <= 8; i += 2) {
        this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(0, i, -16), boxMass, 0.1, 0, crateTex);
      }

      for (let i = 4; i <= 6; i += 2) {
        this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(0, i, -18), boxMass, 0.1, 0, crateTex);
      }

      this.game.addBox(new BABYLON.Vector3(2, 2, 2), new BABYLON.Vector3(0, 4, -20), boxMass, 0.1, 0, crateTex);

      this.game.addGoalBox(new BABYLON.Vector3(0, 47, 0));
      this.game.addSphere(new BABYLON.Vector3(0, 10, -40), 2, 2, 0, 0.5, ballTex);
    });
  }
}
