import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ParticleSystem } from "../particles/ParticleSystem";

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cube: THREE.Mesh;
//   private cube2: THREE.Mesh;
  private controls: OrbitControls;
  private particleSystem: ParticleSystem;
  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();

  constructor() {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true ;

    // Cube
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });

    // const material2 = new THREE.MeshBasicMaterial({
    //   color: 0xFF0000,
    //   wireframe: true,
    // });

    this.cube = new THREE.Mesh(geometry, material);
    // this.cube2 = new THREE.Mesh(geometry, material2);
    this.particleSystem = new ParticleSystem(this.scene);
    this.cube.add(this.particleSystem.getPoints());
    this.scene.add(this.cube);
    // this.scene.add(this.cube2);

    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  // private getMouseWorldPosition(): THREE.Vector3 {
  //   const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
  //   vector.unproject(this.camera);
  //   return vector;
  // }

  private getMouseWorldPosition(): THREE.Vector3 | null {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersects = this.raycaster.intersectObject(this.cube);

    if (intersects.length > 0) {
      return intersects[0].point.clone();
    }

    return null;
  }

  public start(): void {
    this.animate();
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    this.cube.rotation.x += 0.001;
    this.cube.rotation.y += 0.001;
    this.cube.rotation.z += 0.001;

    // this.cube2.rotation.x -= 0.02;
    // this.cube2.rotation.y -= 0.02;

    this.controls.update();

    // this.particleSystem.update();
    // const mousePos = this.getMouseWorldPosition();
    // this.particleSystem.update(mousePos);
    // const mouseWorld = this.getMouseWorldPosition();
    // console.log(mouseWorld);

    // if (mouseWorld) {
    //   const mouseLocal = mouseWorld.clone();
    //   this.cube.worldToLocal(mouseLocal);
    //   this.particleSystem.update(mouseLocal);
    // } else {
    //   this.particleSystem.update(new THREE.Vector3(100,100,100)); // dummy far away
    // }

    const mouseLocal = new THREE.Vector3(
      this.mouse.x,
      this.mouse.y,
      0
    );

    this.particleSystem.update(mouseLocal);
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}