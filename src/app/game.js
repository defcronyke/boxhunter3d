import BABYLON from 'babylonjs/dist/preview release/babylon.max.js';

export default class Game {
  constructor(container) {
    console.log('game started');

    this.speedX = 0;
    this.speedY = 0;
    this.speedZ = 0;

    window.addEventListener('keydown', e => {
      // console.log('keyCode: ', e.keyCode);
      this.speed = 0.7;
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
        this.addSphere();
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
      if (this.sphere) {
        if (this.sphere.position.y >= this.lastY) {
          const angVel = this.sphere.physicsImpostor.getAngularVelocity();
          angVel.x *= this.drag;
          angVel.y *= this.drag;
          angVel.z *= this.drag;
          this.sphere.physicsImpostor.setAngularVelocity(angVel);
        }
        this.lastY = this.sphere.position.y;

        // this.camera.position.x = this.sphere.position.x;
        // this.camera.position.y = this.sphere.position.y + 1;
        // this.camera.position.z = this.sphere.position.z - 30;

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
    // const grav = -9.81;
    const grav = -28;
    this.gravity = new BABYLON.Vector3(0, grav, 0);
    this.physics = new BABYLON.CannonJSPlugin();
  }

  createScene() {
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3(0, 1, 0);
    this.scene.enablePhysics(this.gravity, this.physics);
    this.scene.collisionsEnabled = true;
    this.addCamera();
    this.addLight();
    this.level1();
  }

  addCamera() {
    this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 10, -60), this.scene);
    this.camera.setTarget(BABYLON.Vector3.Zero());
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
      {mass: 0, restitution: 0.4, friction: 1},
      this.scene
    );
  }

  addSphere() {
    this.sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene);
    this.sphere.position.y = 30;
    this.lastY = this.sphere.position.y;
    this.sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.sphere,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {mass: 1, restitution: 0.4, friction: 1},
      this.scene
    );
  }

  addTriangularPrism() {
    const diameter = 16;
    const height = 10;
    const mass = 1;
    const footDiameter = 1;
    const prism = BABYLON.MeshBuilder.CreateCylinder('triangularPrism1', {
      diameter,
      height,
      tessellation: 3
    }, this.scene);
    prism.checkCollisions = true;
    prism.position.y = 12;
    prism.rotate(BABYLON.Axis.X, (90 * Math.PI) / 180, BABYLON.Space.WORLD);
    prism.rotate(BABYLON.Axis.Z, (90 * Math.PI) / 180, BABYLON.Space.WORLD);

    const foot1 = BABYLON.Mesh.CreateSphere('foot1', 16, footDiameter, this.scene);
    // foot1.position.x = (-diameter / 2) + (foot1Diameter / 2);
    // foot1.position.y = 12;
    foot1.position.x = (-diameter / 2) + (footDiameter * 4.5);
    foot1.position.y = (-height / 2) + (footDiameter);
    foot1.position.z = (-diameter / 2) + (footDiameter * 2);
    foot1.physicsImpostor = new BABYLON.PhysicsImpostor(
      foot1,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {mass, restitution: 0.4, friction: 1},
      this.scene
    );
    foot1.parent = prism;

    // const foot2Diameter = 3;
    const foot2 = BABYLON.Mesh.CreateSphere('foot2', 16, footDiameter, this.scene);
    // foot2.position.x = (diameter / 2) - (foot2Diameter / 2);
    // foot2.position.y = 12;
    foot2.position.x = (-diameter / 2) + (footDiameter * 4.5);
    foot2.position.y = (-height / 2) + (footDiameter);
    foot2.position.z = (diameter / 2) - (footDiameter * 2);
    foot2.physicsImpostor = new BABYLON.PhysicsImpostor(
      foot2,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {mass, restitution: 0.4, friction: 1},
      this.scene
    );
    foot2.parent = prism;

    // const foot3Diameter = 3;
    const foot3 = BABYLON.Mesh.CreateSphere('foot3', 16, footDiameter, this.scene);
    // foot3.position.x = (-diameter / 2) + (foot3Diameter / 2);
    // foot3.position.z = 12;
    foot3.position.x = (-diameter / 2) + (footDiameter * 4.5);
    foot3.position.y = (height / 2) - (footDiameter);
    foot3.position.z = (-diameter / 2) + (footDiameter * 2);
    foot3.physicsImpostor = new BABYLON.PhysicsImpostor(
      foot3,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {mass, restitution: 0.4, friction: 1},
      this.scene
    );
    foot3.parent = prism;

    // const foot4Diameter = 3;
    const foot4 = BABYLON.Mesh.CreateSphere('foot4', 16, footDiameter, this.scene);
    // foot4.position.x = (diameter / 2) - (foot4Diameter / 2);
    // foot4.position.z = 12;
    foot4.position.x = (-diameter / 2) + (footDiameter * 4.5);
    foot4.position.y = (height / 2) - (footDiameter);
    foot4.position.z = (diameter / 2) - (footDiameter * 2);
    foot4.physicsImpostor = new BABYLON.PhysicsImpostor(
      foot4,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {mass, restitution: 0.4, friction: 1},
      this.scene
    );
    foot4.parent = prism;

    prism.impostor1 = new BABYLON.PhysicsImpostor(
      prism,
      BABYLON.PhysicsImpostor.MeshImpostor,
      {mass, restitution: 0.4, friction: 1},
      this.scene
    );

    const box = BABYLON.MeshBuilder.CreateBox('box1', {width: 5, height: 5}, this.scene);
    box.position.x = 10;
    box.position.y = 5;
    box.impostor1 = new BABYLON.PhysicsImpostor(
      box,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {mass: 1, restitution: 0.4, friction: 1},
      this.scene
    );

    // const prism = BABYLON.MeshBuilder.CreatePolyhedron('triangularPrism1', {type: 5, size: 3}, this.scene);
    // prism.position.y = 5;
    // console.log('rotation: ', prism.rotation);
    // prism.rotation = new BABYLON.Vector3(-45 * Math.PI / 180, 0 * Math.PI / 180, -45 * Math.PI / 180);
    // prism.impostor1 = new BABYLON.PhysicsImpostor(
    //   prism,
    //   BABYLON.PhysicsImpostor.MeshImpostor,
    //   {mass: 0, restitution: 0.4, friction: 1},
    //   this.scene
    // );
    // prism.rotate(BABYLON.Axis.X, (-45 * Math.PI) / 180, BABYLON.Space.LOCAL);
    // prism.rotate(BABYLON.Axis.Y, (45 * Math.PI) / 4, BABYLON.Space.LOCAL);
    // prism.rotate(BABYLON.Axis.Z, (45 * Math.PI) / 180, BABYLON.Space.LOCAL);
  }

  level1() {
    const groundMat1 = new BABYLON.StandardMaterial('groundMat1', this.scene);
    groundMat1.diffuseTexture = new BABYLON.Texture('assets/img/gridPattern1.jpg', this.scene);
    this.ground = BABYLON.Mesh.CreateGroundFromHeightMap('ground1', 'assets/img/gridPattern1.jpg', 100, 100, 250, 0, 0.5, this.scene, false, () => {
      this.ground.material = groundMat1;
      this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        this.ground,
        BABYLON.PhysicsImpostor.HeightmapImpostor,
        {mass: 0, restitution: 0.4, friction: 1},
        this.scene
      );
      this.addTriangularPrism();
      this.addSphere();
    });
  }
}
