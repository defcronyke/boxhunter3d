import * as THREE from 'three';
import * as Ammo from 'ammo.js';

export default class Game {
  constructor(container) {
    console.log('game started');

    this.speedX = 0;
    this.speedY = 0;
    this.speedZ = 0;

    document.addEventListener('keydown', e => {
      // console.log('keyCode: ', e.keyCode);
      this.speed = 1;
      this.speedX = 0;
      this.speedY = 0;
      this.speedZ = 0;

      if (e.keyCode === 87) { // W
        this.speedZ = -this.speed;
      }

      if (e.keyCode === 83) { // S
        this.speedZ = this.speed;
      }

      if (e.keyCode === 65) { // A
        this.speedX = -this.speed;
      }

      if (e.keyCode === 68) { // D
        this.speedX = this.speed;
      }
    });

    document.addEventListener('keyup', e => {
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

    this.step = () => {
      this.renderer.render(this.scene, this.camera);
      this.stepPhysics();
      this.move();
      requestAnimationFrame(this.step);
    };

    this.stepPhysics = () => {
      this.dynamicsWorld.stepSimulation(1 / 60, 10);

      this.meshes.forEach(mesh => {
        if (mesh.body.getMotionState()) {
          mesh.body.getMotionState().getWorldTransform(this.trans);
          mesh.position.set(
            this.trans.getOrigin().x().toFixed(2),
            this.trans.getOrigin().y().toFixed(2),
            this.trans.getOrigin().z().toFixed(2)
          );
        }
      });
    };

    this.move = () => {
      if (this.speedX === 0 && this.speedY === 0 && this.speedZ === 0) {
        return;
      }
      this.sphere.body.applyCentralImpulse(new Ammo.btVector3(this.speedX, this.speedY, this.speedZ));
    };

    this.init(container);
  }

  init(container) {
    this.initGraphics(container);
    this.initPhysics();
    this.addLight();
    this.addCamera();
    this.addGround();
    this.addSphere();
    this.step();
  }

  initGraphics(container) {
    this.renderer = new THREE.WebGLRenderer();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x33aabb);
    container.appendChild(this.renderer.domElement);
  }

  initPhysics() {
    this.collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    this.dispatcher = new Ammo.btCollisionDispatcher(this.collisionConfiguration);
    this.overlappingPairCache = new Ammo.btDbvtBroadphase();
    this.solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, this.overlappingPairCache, this.solver, this.collisionConfiguration);
    this.dynamicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
    this.meshes = [];
    this.trans = new Ammo.btTransform(); // taking this out of the loop below us reduces the leaking
  }

  addCamera() {
    const width = innerWidth - 25;
    const height = innerHeight - 25;
    const viewAngle = 45;
    const aspect = width / height;
    const near = 0.1;
    const far = 10000;

    this.camera = new THREE.PerspectiveCamera(
      viewAngle,
      aspect,
      near,
      far
    );

    this.camera.position.set(0, 3, 30);
    this.camera.lookAt(new THREE.Vector3(0, 1, 0));
    this.camera.add(this.pointLight);
    this.scene.add(this.camera);
    this.renderer.setSize(width, height);
  }

  addLight() {
    this.pointLight = new THREE.PointLight(0xffffff);
    this.pointLight.position.x = 10;
    this.pointLight.position.y = 50;
    this.pointLight.position.z = 130;
  }

  addGround() {
    const x = 1000;
    const y = 1;
    const z = 1000;

    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(x, y, z),
      new THREE.MeshLambertMaterial({color: 0xaaffaa})
    );
    this.scene.add(ground);

    const groundShape = new Ammo.btBoxShape(new Ammo.btVector3(50, 50, 50));

    const groundTransform = new Ammo.btTransform();

    groundTransform.setIdentity();
    groundTransform.setOrigin(new Ammo.btVector3(0, -56, 0));

    const mass = 0;
    const isDynamic = (mass !== 0);
    const localInertia = new Ammo.btVector3(0, 0, 0);

    if (isDynamic) {
      groundShape.calculateLocalInertia(mass, localInertia);
    }

    const myMotionState = new Ammo.btDefaultMotionState(groundTransform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, groundShape, localInertia);
    ground.body = new Ammo.btRigidBody(rbInfo);

    this.dynamicsWorld.addRigidBody(ground.body);
    this.meshes.push(ground);
  }

  addSphere() {
    const radius = 1;
    const segments = 16;
    const rings = 16;

    // const loader = new THREE.TextureLoader();
    // loader.load('assets/img/playerTexture.jpg', texture => {
    this.sphere = new THREE.Mesh(
      new THREE.SphereGeometry(
        radius,
        segments,
        rings
      ),
      new THREE.MeshLambertMaterial({
        // map: texture
        color: 0xcc0000
      })
    );
    this.sphere.position.y = 4;
    this.scene.add(this.sphere);

    const colShape = new Ammo.btSphereShape(1);
    const startTransform = new Ammo.btTransform();

    startTransform.setIdentity();

    const mass = 1;
    const isDynamic = (mass !== 0);
    const localInertia = new Ammo.btVector3(0, 0, 0);

    if (isDynamic) {
      colShape.calculateLocalInertia(mass, localInertia);
    }

    startTransform.setOrigin(new Ammo.btVector3(2, 10, 0));

    const myMotionState = new Ammo.btDefaultMotionState(startTransform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, myMotionState, colShape, localInertia);
    this.sphere.body = new Ammo.btRigidBody(rbInfo);

    this.dynamicsWorld.addRigidBody(this.sphere.body);
    this.meshes.push(this.sphere);
  }
}
