/* eslint-disable no-alert, max-params */
import BABYLON from 'babylonjs/dist/preview release/babylon.max.js';
import CANNON from 'cannon';
import Level1 from './levels/level1';

export default class Game {
  constructor(container) {
    this.level = 1;
    this.container = container;
    console.log('game started');

    window.addEventListener('keydown', e => {
      // console.log('keyCode: ', e.keyCode);
      this.speed = 1;
      this.speedX = 0;
      this.speedY = 0;
      this.speedZ = 0;

      if (e.keyCode === 87) { // W
        this.speedZ = this.speed;
      }

      if (e.keyCode === 83) { // S
        this.speedZ = -this.speed;
      }

      if (e.keyCode === 65) { // A
        this.speedX = -this.speed;
      }

      if (e.keyCode === 68) { // D
        this.speedX = this.speed;
      }

      if (e.keyCode === 32) { // Spacebar
        this.jump();
      }

      if (e.keyCode === 78) { // N
        let pos = new BABYLON.Vector3.Zero();
        switch (this.level) {
          case 1:
            pos = new BABYLON.Vector3(0, 10, -40);
            break;
          default:
        }
        this.addSphere(pos);
      }
    });

    window.addEventListener('keyup', e => {
      if (e.keyCode === 87) { // W
        this.speedZ = 0;
      }

      if (e.keyCode === 83) { // S
        this.speedZ = 0;
      }

      if (e.keyCode === 65) { // A
        this.speedX = 0;
      }

      if (e.keyCode === 68) { // D
        this.speedX = 0;
      }
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });

    this.step = () => {
      this.engine.runRenderLoop(() => {
        this.scene.render();
        if (!this.checkGoalBoxCollision()) {
          return;
        }
        this.move();
      });
    };

    this.move = () => {
      this.drag = 0.98;
      if (this.sphere && this.camera) {
        if (this.sphere.position.y >= this.lastY) {
          const angVel = this.sphere.physicsImpostor.getAngularVelocity();
          angVel.x *= this.drag;
          angVel.y *= this.drag;
          angVel.z *= this.drag;
          this.sphere.physicsImpostor.setAngularVelocity(angVel);
        }
        this.lastY = this.sphere.position.y;

        this.camera.position.x = this.sphere.position.x;
        this.camera.position.y = this.sphere.position.y + 25;
        this.camera.position.z = this.sphere.position.z - 30;
        this.camera.setTarget(this.sphere.position);

        if ((this.speedX === 0) && (this.speedY === 0) && (this.speedZ === 0)) {
          return;
        }
        this.sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(this.speedX, this.speedY, this.speedZ), this.sphere.getAbsolutePosition());
      }
    };

    this.levels = [
      new Level1(this)
    ];

    this.init(container);
  }

  init(container) {
    this.speedX = 0;
    this.speedY = 0;
    this.speedZ = 0;
    this.sceneObjects = [];
    this.goalBoxSettled = false;
    this.initGraphics(container);
    this.initPhysics();
    if (!this.createScene()) {
      return;
    }
    this.step();
  }

  initGraphics(container) {
    this.container = container;
    this.engine = new BABYLON.Engine(this.container, true);
  }

  initPhysics() {
    const grav = -9.81;
    this.gravity = new BABYLON.Vector3(0, grav, 0);
    this.physics = new BABYLON.CannonJSPlugin();
  }

  createScene() {
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3(0.2, 0.5, 0.5);
    this.scene.enablePhysics(this.gravity, this.physics);
    this.scene.getPhysicsEngine().getPhysicsPlugin().world.allowSleep = true;
    this.addCamera();
    this.addLight();

    if (this.level > this.levels.length) {
      alert('Congratulations, you beat the game!');
      return false;
    }
    this.levels[this.level - 1].start();
    console.log('level ' + this.level + ' started');
    return true;
  }

  addCamera() {
    this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 25, -30), this.scene);
    this.camera.attachControl(this.container);
  }

  addLight() {
    this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
    this.light.intensity = 0.5;
  }

  addGround() {
    this.ground = BABYLON.Mesh.CreateGround('ground1', 100, 100, 2, this.scene);
    this.ground.checkCollisions = true;
    this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {mass: 0, restitution: 0.5, friction: 0.5},
      this.scene
    );
    const material = new BABYLON.StandardMaterial('groundMat', this.scene);
    material.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);
    this.ground.material = material;
    this.sceneObjects.push(this.ground);
  }

  addSphere(pos) {
    this.sphereDiameter = 2;
    this.sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, this.sphereDiameter, this.scene);
    this.sphere.position = pos;
    this.lastY = this.sphere.position.y;
    this.sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.sphere,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {mass: 2, restitution: 0, friction: 1},
      this.scene
    );
    this.sphere.physicsImpostor.physicsBody.allowSleep = false;
    this.camera.setTarget(this.sphere.position);
  }

  addBox(size, pos, mass, friction, restitution, texture) {
    const box = BABYLON.MeshBuilder.CreateBox('box', {depth: size.x, width: size.y, height: size.z});
    box.position = pos;
    box.impostor = new BABYLON.PhysicsImpostor(
      box,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {mass, restitution, friction},
      this.scene
    );
    if (texture) {
      const material = new BABYLON.StandardMaterial('boxMat', this.scene);
      material.diffuseTexture = new BABYLON.Texture(texture, this.scene);
      box.material = material;
    }
    this.sceneObjects.push(box);
  }

  addGoalBox(pos) {
    this.goalBox = BABYLON.MeshBuilder.CreateBox('goalBox', {depth: 1, width: 1, height: 1});
    this.goalBox.position = pos;
    this.goalBox.impostor = new BABYLON.PhysicsImpostor(
      this.goalBox,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {mass: 1, restitution: 0, friction: 0.8},
      this.scene
    );
    const material = new BABYLON.StandardMaterial('goalBoxMat', this.scene);
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    this.goalBox.material = material;
  }

  checkGoalBoxCollision() {
    const loseThreshold = 2;
    let dontBreak = true;

    if (this.goalBox.intersectsMesh(this.sphere, true)) {
      alert('You got the box. You win!');
      this.level++;
      dontBreak = false;
      this.engine.stopRenderLoop();
      this.init(this.container);
      return dontBreak;
    }

    if (this.goalBox.impostor.physicsBody.sleepState === CANNON.Body.SLEEPING) {
      this.goalBoxSettled = true;
      return dontBreak;
    }
    if (this.goalBoxSettled) {
      this.sceneObjects.forEach(object => {
        if (this.goalBox.intersectsMesh(object, true)) {
          if (Math.abs(this.goalBox.impostor.physicsBody.velocity.y) > loseThreshold) {
            // console.log(this.goalBox.impostor.physicsBody.velocity);
            console.log('you lose');
            dontBreak = false;
            this.engine.stopRenderLoop();
            if (confirm('You dropped the box, you lose. Try again?')) {
              this.init(this.container);
            }
            return;
          }
        }
      });
    }
    return dontBreak;
  }

  jump() {
    const jumpForce = 15;
    // console.log(this.sphere.position.y);
    this.sceneObjects.forEach(object => {
      if (this.sphere.intersectsMesh(object, true)) {
        this.sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, jumpForce, 0), this.sphere.getAbsolutePosition());
      }
    });
  }
}
