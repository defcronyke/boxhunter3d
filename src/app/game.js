/* eslint-disable no-alert, max-params */
import BABYLON from 'babylonjs/dist/preview release/babylon.max.js';
import CANNON from 'cannon';
import Level1 from './levels/level1';
import Level2 from './levels/level2';
import Level3 from './levels/level3';
import Level4 from './levels/level4';

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

      if (e.keyCode === 221) { // ]
        this.engine.stopRenderLoop();
        this.level++;
        this.init(this.container);
      }

      if (e.keyCode === 219) { // [
        this.engine.stopRenderLoop();
        if (this.level === 1) {
          this.level = this.levels.length;
        } else {
          this.level--;
        }
        this.init(this.container);
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
      // this.engine.resize();
      this.engine.setSize(window.innerWidth, window.innerHeight);
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
      this.drag = 0.99;
      if (this.sphere && this.camera) {
        if (this.sphere.position.y >= this.lastY) {
          const angVel = this.sphere.impostor.getAngularVelocity();
          angVel.x *= this.drag;
          angVel.y *= this.drag;
          angVel.z *= this.drag;
          this.sphere.impostor.setAngularVelocity(angVel);
        }
        this.lastY = this.sphere.position.y;

        this.camera.position.x = this.sphere.position.x;
        this.camera.position.y = this.sphere.position.y + 30;
        this.camera.position.z = this.sphere.position.z - 50;
        this.camera.setTarget(this.sphere.position);

        if (this.sphere.position.y < -10) {
          this.engine.stopRenderLoop();
          if (confirm('You fell off the edge, you lose. Try again?')) {
            this.init(this.container);
          }
        }

        if ((this.speedX === 0) && (this.speedY === 0) && (this.speedZ === 0)) {
          return;
        }

        if (!this.goalBoxSettled) {
          return;
        }

        this.sphere.impostor.applyImpulse(new BABYLON.Vector3(this.speedX, this.speedY, this.speedZ), this.sphere.getAbsolutePosition());
      }
    };

    this.levels = [
      new Level1(this),
      new Level2(this),
      new Level3(this),
      new Level4(this)
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
    this.engine.setSize(window.innerWidth, window.innerHeight);
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
      this.engine.stopRenderLoop();
      this.level = 1;
      this.init(this.container);
      return false;
    }
    this.levels[this.level - 1].start();
    console.log('level ' + this.level + ' started');
    return true;
  }

  addCamera() {
    this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 30, -50), this.scene);
    this.camera.attachControl(this.container);
  }

  addLight() {
    this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
    this.light.intensity = 0.5;
  }

  addGround(size, restitution, friction, texture, heightmap, heightmapHeight, callback) {
    if (heightmap && heightmapHeight) {
      const material = new BABYLON.StandardMaterial('groundMat', this.scene);
      material.diffuseTexture = new BABYLON.Texture(texture, this.scene);
      // console.log(material.specularColor);
      material.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
      this.ground = BABYLON.Mesh.CreateGroundFromHeightMap('ground1', heightmap, size.x, size.y, 250, 0, heightmapHeight, this.scene, false, mesh => {
        mesh.material = material;
        mesh.impostor = new BABYLON.PhysicsImpostor(
          mesh,
          BABYLON.PhysicsImpostor.HeightmapImpostor,
          {mass: 0, restitution, friction},
          this.scene
        );
        this.sceneObjects.push(mesh);
        callback();
      });
    } else {
      this.ground = BABYLON.Mesh.CreateGround('ground1', size.x, size.y, size.z, this.scene);
      this.ground.impostor = new BABYLON.PhysicsImpostor(
        this.ground,
        BABYLON.PhysicsImpostor.BoxImpostor,
        {mass: 0, restitution, friction},
        this.scene
      );
      const material = new BABYLON.StandardMaterial('groundMat', this.scene);

      if (texture) {
        material.diffuseTexture = new BABYLON.Texture(texture, this.scene);
      } else {
        material.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);
      }
      this.ground.material = material;
      this.sceneObjects.push(this.ground);
    }
  }

  addSphere(pos, diameter, mass, restitution, friction, texture) {
    // this.sphereDiameter = 2;
    this.sphereDiameter = diameter;
    this.sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, this.sphereDiameter, this.scene);
    this.sphere.position = pos;
    this.lastY = this.sphere.position.y;
    this.sphere.impostor = new BABYLON.PhysicsImpostor(
      this.sphere,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {mass, restitution, friction},
      this.scene
    );
    if (texture) {
      const material = new BABYLON.StandardMaterial('sphereMat', this.scene);
      material.diffuseTexture = new BABYLON.Texture(texture, this.scene);
      this.sphere.material = material;
    }
    this.sphere.impostor.physicsBody.allowSleep = false;
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
    this.goalBox.impostor.physicsBody.sleepSpeedLimit = 1;
    const material = new BABYLON.StandardMaterial('goalBoxMat', this.scene);
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    this.goalBox.material = material;
  }

  checkGoalBoxCollision() {
    const loseThreshold = 12;
    const loseThreshold2 = 5;
    let dontBreak = true;

    if (this.goalBox) {
      if (this.sphere && this.goalBox.intersectsMesh(this.sphere, true)) {
        alert('You got the box. You beat the level!');
        this.level++;
        dontBreak = false;
        this.engine.stopRenderLoop();
        this.init(this.container);
        return dontBreak;
      }

      if (this.goalBox.impostor.physicsBody.sleepState === CANNON.Body.SLEEPING) {
        this.goalBoxSettled = true;
        // return dontBreak;
      }
      if (this.goalBoxSettled) {
        this.sceneObjects.forEach(object => {
          if (this.goalBox.intersectsMesh(object, true)) {
            const vel = Math.abs(this.goalBox.impostor.physicsBody.velocity.x) +
                        Math.abs(this.goalBox.impostor.physicsBody.velocity.y) +
                        Math.abs(this.goalBox.impostor.physicsBody.velocity.z);
            const vel2 = Math.abs(object.impostor.physicsBody.velocity.x) +
                         Math.abs(object.impostor.physicsBody.velocity.y) +
                         Math.abs(object.impostor.physicsBody.velocity.z);
            // console.log('obj velocity:', vel2);
            if (vel > loseThreshold ||
            (vel2 > loseThreshold2 && this.goalBox.position.y < object.position.y)) {
              // console.log(this.goalBox.impostor.physicsBody.velocity);
              console.log('you lose');
              dontBreak = false;
              this.engine.stopRenderLoop();
              if (confirm('The box broke, you lose. Try again?')) {
                this.init(this.container);
              }
              return;
            }
          }
        });
      }
    }
    return dontBreak;
  }

  jump() {
    const jumpForce = 10;
    // console.log(this.sphere.impostor.physicsBody.velocity.y);
    this.sceneObjects.forEach(object => {
      if (this.sphere.intersectsMesh(object, true)) {
        if (this.sphere.impostor.physicsBody.velocity.y > jumpForce) {
          this.sphere.impostor.physicsBody.velocity.y = 0;
        } else if (this.sphere.impostor.physicsBody.velocity.y <= jumpForce / 2) {
          this.sphere.impostor.applyImpulse(new BABYLON.Vector3(0, jumpForce, 0), this.sphere.getAbsolutePosition());
        }
      }
    });
  }
}
