import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ParticleSystem } from "../particles/ParticleSystem";

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cube: THREE.Mesh;
  private controls: OrbitControls;
  private particleSystem: ParticleSystem;
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private raycaster: THREE.Raycaster = new THREE.Raycaster();

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000);
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });

    this.cube = new THREE.Mesh(geometry, material);

    this.particleSystem = new ParticleSystem(this.scene);
    this.cube.add(this.particleSystem.getPoints());
    this.scene.add(this.cube);

    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private getMouseLocalPosition(): THREE.Vector3 {
    // Simple normalized plane interaction (stable and fast)
    return new THREE.Vector3(this.mouse.x, this.mouse.y, 0);
  }

  public start(): void {
    this.animate();
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    this.cube.rotation.x += 0.001;
    this.cube.rotation.y += 0.001;
    this.cube.rotation.z += 0.001;

    this.controls.update();

    const mouseLocal = this.getMouseLocalPosition();
    this.particleSystem.update(mouseLocal);

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}