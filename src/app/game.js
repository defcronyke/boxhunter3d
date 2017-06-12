import BABYLON from 'babylonjs/dist/preview release/babylon.max.js';

export default class Game {
  constructor(container) {
    console.log('game started');

    this.speedX = 0;
    this.speedY = 0;
    this.speedZ = 0;
    this.level = 1;
    // this.levelStartPos = [
    //   new BABYLON.Vector3(0, 30, -40) // 1
    // ];

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

      if (e.keyCode === 78) { // N
        // console.log(this.levelStartPos[this.level - 1]);
        let pos = new BABYLON.Vector3.Zero();
        switch (this.level) {
          case 1:
            pos = new BABYLON.Vector3(0, 30, -40);
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

        // console.log(this.speedX, this.speedY, this.speedZ);
        this.sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(this.speedX, this.speedY, this.speedZ), this.sphere.getAbsolutePosition());
      }
    };

    this.init(container);
  }

  init(container) {
    this.initGraphics(container);
    this.initPhysics();
    this.createScene();
    this.step();
  }

  initGraphics(container) {
    this.container = container;
    this.engine = new BABYLON.Engine(this.container, true);
  }

  initPhysics() {
    const grav = -9.81;
    // const grav = -28;
    this.gravity = new BABYLON.Vector3(0, grav, 0);
    this.physics = new BABYLON.CannonJSPlugin();
  }

  createScene() {
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3(0.2, 0.5, 0.5);
    this.scene.enablePhysics(this.gravity, this.physics);
    this.scene.collisionsEnabled = true;
    this.addCamera();
    this.addLight();
    this.level1();
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
      {mass: 0, restitution: 0, friction: 0.8},
      this.scene
    );
    const material = new BABYLON.StandardMaterial('groundMat', this.scene);
    material.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);
    this.ground.material = material;
  }

  addSphere(pos) {
    this.sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene);
    // this.sphere.position.y = 30;
    this.sphere.position = pos;
    this.lastY = this.sphere.position.y;
    this.sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.sphere,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {mass: 3, restitution: 0, friction: 1},
      this.scene
    );
    // this.camera.attachControl(this.sphere);
    this.camera.setTarget(this.sphere.position);
  }

  addBox(size, pos, mass) {
    const box = BABYLON.MeshBuilder.CreateBox('box', {depth: size.x, width: size.y, height: size.z});
    box.position = pos;
    box.impostor = new BABYLON.PhysicsImpostor(
      box,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {mass, restitution: 0, friction: 0.8},
      this.scene
    );
  }

  addGoalBox(pos) {
    const box = BABYLON.MeshBuilder.CreateBox('box', {depth: 1, width: 1, height: 1, color: 0x000000});
    box.position = pos;
    box.impostor = new BABYLON.PhysicsImpostor(
      box,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {mass: 1, restitution: 0, friction: 0.8},
      this.scene
    );
    const material = new BABYLON.StandardMaterial('boxMat', this.scene);
    material.diffuseColor = new BABYLON.Color3(0, 0, 0);
    box.material = material;
  }

  level1() {
    // const level1StartPos = new BABYLON.Vector3(0, 30, -40);
    // this.levelStartPos.push(level1StartPos);
    // const groundMat1 = new BABYLON.StandardMaterial('groundMat1', this.scene);
    // groundMat1.diffuseTexture = new BABYLON.Texture('assets/img/level1/gridPattern1.jpg', this.scene);
    // this.ground = BABYLON.Mesh.CreateGroundFromHeightMap('ground1', 'assets/img/level1/gridPattern1.jpg', 100, 100, 250, 0, 10, this.scene, false, () => {
    //   this.ground.material = groundMat1;
    //   this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    //     this.ground,
    //     BABYLON.PhysicsImpostor.HeightmapImpostor,
    //     {mass: 0, restitution: 0.1, friction: 1},
    //     this.scene
    //   );
    this.addGround();
    this.addBox(new BABYLON.Vector3(3, 3, 3), new BABYLON.Vector3(0, 2, -20), 1);
    this.addBox(new BABYLON.Vector3(3, 3, 3), new BABYLON.Vector3(0, 5, -20), 1);
    this.addBox(new BABYLON.Vector3(3, 3, 3), new BABYLON.Vector3(0, 8, -20), 1);
    this.addGoalBox(new BABYLON.Vector3(0, 10, -20));
    this.addSphere(new BABYLON.Vector3(0, 30, -40));
    // });
  }
}
