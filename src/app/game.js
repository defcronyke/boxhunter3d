// import * as OIMO from 'oimo';
// const OIMO = require('oimo');
// import * as CANNON from 'cannon';
// import * as OIMO from 'babylonjs/dist/preview release/Oimo.js';
import BABYLON from 'babylonjs/dist/preview release/babylon.max.js';

export default class Game {
  constructor(container) {
    console.log('game started');
    // console.log(OIMO);
    // console.log(CANNON);

    this.speedX = 0;
    this.speedY = 0;
    this.speedZ = 0;

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
      // this.renderer.render(this.scene, this.camera);
      // this.stepPhysics();
      // this.move();
      // requestAnimationFrame(this.step);
    };

    // this.stepPhysics = () => {
    //   if (this.world === null) {
    //     return;
    //   }
    //
    //   this.world.step();
    //
    //   this.meshes.forEach(mesh => {
    //     if (!mesh.body.sleeping) {
    //       mesh.position.copy(mesh.body.getPosition());
    //       mesh.quaternion.copy(mesh.body.getQuaternion());
    //     }
    //   });
    //   // this.dynamicsWorld.stepSimulation(1 / 60, 10);
    //   //
    //   // this.meshes.forEach(mesh => {
    //   //   if (mesh.body.getMotionState()) {
    //   //     mesh.body.getMotionState().getWorldTransform(this.trans);
    //   //     mesh.position.set(
    //   //       this.trans.getOrigin().x().toFixed(2),
    //   //       this.trans.getOrigin().y().toFixed(2),
    //   //       this.trans.getOrigin().z().toFixed(2)
    //   //     );
    //   //   }
    //   // });
    // };

    this.move = () => {
      this.drag = 0.98;
      const angVel = this.sphere.physicsImpostor.getAngularVelocity();
      angVel.x *= this.drag;
      angVel.y *= this.drag;
      angVel.z *= this.drag;
      this.sphere.physicsImpostor.setAngularVelocity(angVel);

      if ((this.speedX === 0) && (this.speedY === 0) && (this.speedZ === 0)) {
        return;
      }

      console.log(this.speedX, this.speedY, this.speedZ);
      // this.drag = 0.99;
      // this.speedX = this.speedX * this.drag;
      // this.speedY = this.speedY * this.drag;
      // this.speedZ = this.speedZ * this.drag;
      this.sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(this.speedX, this.speedY, this.speedZ), this.sphere.getAbsolutePosition());

      // this.sphere.physicsImpostor.applyImpulse(new BABYLON.Vector3(-this.speedX * this.drag, -this.speedY * this.drag, -this.speedZ * this.drag), this.sphere.getAbsolutePosition());
      // // console.log(this.sphere.body.getPosition());
      // // console.log(this.sphere.body.position.x);
      // // this.sphere.position.y = -this.sphere.position.y
      // // console.log(this.sphere.body.position);
      // this.sphere.body.setPosition({
      //   x: this.sphere.body.position.x + this.speedX,
      //   y: this.sphere.body.position.y + this.speedY,
      //   z: this.sphere.body.position.z + this.speedZ
      // });
      // this.sphere.body.setRotation({
      //   x: this.sphere.body.rotation.x + this.speedX,
      //   y: this.sphere.body.rotation.y + this.speedY,
      //   z: this.sphere.body.rotation.z + this.speedZ
      // });
      // this.sphere.body.linearVelocity.scaleEqual(0.01);
      // this.sphere.body.angularVelocity.scaleEqual(0.01);
      // // this.sphere.body.applyImpulse({x: this.speedX, y: this.speedY, z: this.speedZ}, this.sphere.body.getPosition());
      // // this.sphere.body.applyCentralImpulse(new Ammo.btVector3(this.speedX, this.speedY, this.speedZ));
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
    // this.renderer = new THREE.WebGLRenderer();
    // this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x33aabb);
    // container.appendChild(this.renderer.domElement);
    // console.log(container);
    this.container = container;
    this.engine = new BABYLON.Engine(this.container, true);
  }

  initPhysics() {
    this.gravity = new BABYLON.Vector3(0, -9.81, 0);
    // this.physics = new BABYLON.OimoJSPlugin();
    this.physics = new BABYLON.CannonJSPlugin();
    // this.world = new OIMO.World({
    //   timestep: 1 / 60,
    //   iterations: 8,
    //   broadphase: 2,  // 1: brute force, 2: sweep & prune, 3: volume tree
    //   worldscale: 1,
    //   random: true
    //   // info: true      // display statistics
    // });
    // this.world.gravity = new OIMO.Vec3(0, -50, 0);
    // this.meshes = [];
    // this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    // this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
    // this.overlappingPairCache = new Ammo.btDbvtBroadphase();
    // this.solver = new Ammo.btSequentialImpulseConstraintSolver();
    // this.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.overlappingPairCache, this.solver, this.collisionConfiguration);
    // this.dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
    // this.meshes = [];
    // this.trans = new Ammo.btTransform(); // taking this out of the loop below us reduces the leaking
  }

  createScene() {
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color3(0, 1, 0);
    this.scene.enablePhysics(this.gravity, this.physics);
    this.addCamera();
    this.addLight();
    this.addGround();
    this.addSphere();
    // return this.scene;
  }

  addCamera() {
    this.camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -60), this.scene);
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.attachControl(this.container);
    // const width = innerWidth - 25;
    // const height = innerHeight - 25;
    // const viewAngle = 45;
    // const aspect = width / height;
    // const near = 0.1;
    // const far = 10000;
    //
    // this.camera = new THREE.PerspectiveCamera(
    //   viewAngle,
    //   aspect,
    //   near,
    //   far
    // );
    //
    // this.camera.position.set(0, 3, 30);
    // this.camera.lookAt(new THREE.Vector3(0, 1, 0));
    // this.camera.add(this.pointLight);
    // this.scene.add(this.camera);
    // this.renderer.setSize(width, height);
  }

  addLight() {
    this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
    this.light.intensity = 0.5;
    // this.pointLight = new THREE.PointLight(0xffffff);
    // this.pointLight.position.x = 10;
    // this.pointLight.position.y = 50;
    // this.pointLight.position.z = 130;
  }

  addGround() {
    this.ground = BABYLON.Mesh.CreateGround('ground1', 100, 100, 2, this.scene);
    this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {mass: 0, restitution: 0.4, friction: 1},
      this.scene
    );
    // const x = 1000;
    // const y = 1;
    // const z = 1000;
    //
    // const ground = new THREE.Mesh(
    //   new THREE.BoxGeometry(x, y, z),
    //   new THREE.MeshLambertMaterial({color: 0xaaffaa})
    // );
    // this.scene.add(ground);
    //
    // this.world.add({
    //   size: [x, y, z],
    //   pos: [0, y, 0],
    //   density: 1,
    //   belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    //   collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
    //   friction: 0.4,
    //   restitution: 0.2
    // });

    // const groundShape = new Ammo.btBoxShape(new Ammo.btVector3(50, 50, 50));
    //
    // const groundTransform = new Ammo.btTransform();
    //
    // groundTransform.setIdentity();
    // groundTransform.setOrigin(new Ammo.btVector3(0, -56, 0));
    //
    // const mass = 0;
    // const isDynamic = (mass !== 0);
    // const localInertia = new Ammo.btVector3(0, 0, 0);
    //
    // if (isDynamic) {
    //   groundShape.calculateLocalInertia(mass, localInertia);
    // }
    //
    // const myMotionState = new Ammo.btDefaultMotionState(groundTransform);
    // const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, groundShape, localInertia);
    // ground.body = new Ammo.btRigidBody(rbInfo);
    //
    // this.dynamicsWorld.addRigidBody(ground.body);
    // this.meshes.push(ground);
  }

  addSphere() {
    this.sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene);
    this.sphere.position.y = 30;
    this.sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
      this.sphere,
      BABYLON.PhysicsImpostor.SphereImpostor,
      {mass: 1, restitution: 0.4, friction: 1},
      this.scene
    );
    // const radius = 1;
    // const segments = 16;
    // const rings = 16;
    //
    // // const loader = new THREE.TextureLoader();
    // // loader.load('assets/img/playerTexture.jpg', texture => {
    // this.sphere = new THREE.Mesh(
    //   new THREE.SphereGeometry(
    //     radius,
    //     segments,
    //     rings
    //   ),
    //   new THREE.MeshLambertMaterial({
    //     // map: texture
    //     color: 0xcc0000
    //   })
    // );
    // // this.sphere.position.y = 4;
    // this.scene.add(this.sphere);
    //
    // this.sphere.body = this.world.add({
    //   type: 'sphere',
    //   size: [radius / 2],
    //   pos: [0, 10, 0],
    //   move: true,
    //   belongsTo: 1, // The bits of the collision groups to which the shape belongs.
    //   collidesWith: 0xffffffff, // The bits of the collision groups with which the shape collides.
    //   friction: 0.4,
    //   restitution: 0.2,
    //   density: 1
    // });
    //
    // this.meshes.push(this.sphere);

    // const colShape = new Ammo.btSphereShape(1);
    // const startTransform = new Ammo.btTransform();
    //
    // startTransform.setIdentity();
    //
    // const mass = 1;
    // const isDynamic = (mass !== 0);
    // const localInertia = new Ammo.btVector3(0, 0, 0);
    //
    // if (isDynamic) {
    //   colShape.calculateLocalInertia(mass, localInertia);
    // }
    //
    // startTransform.setOrigin(new Ammo.btVector3(2, 10, 0));
    //
    // const myMotionState = new Ammo.btDefaultMotionState(startTransform);
    // const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, colShape, localInertia);
    // this.sphere.body = new Ammo.btRigidBody(rbInfo);
    //
    // this.dynamicsWorld.addRigidBody(this.sphere.body);
    // this.meshes.push(this.sphere);
  }
}
