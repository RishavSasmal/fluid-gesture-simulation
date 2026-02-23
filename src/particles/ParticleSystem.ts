import * as THREE from "three";

export class ParticleSystem {
  private points: THREE.Points;
  private velocities: Float32Array;
  private particleCount: number = 1000;
  private bounds: number = 1;

  constructor(scene: THREE.Scene) {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(this.particleCount * 3);
    this.velocities = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Random position inside cube
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;

      // Random velocity
      this.velocities[i3] = (Math.random() - 0.5) * 0.01;
      this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
    });

    this.points = new THREE.Points(geometry, material);
    scene.add(this.points);
  }

  public update(): void {
    const positions = this.points.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      positions[i3] += this.velocities[i3];
      positions[i3 + 1] += this.velocities[i3 + 1];
      positions[i3 + 2] += this.velocities[i3 + 2];

      // Simple boundary bounce
      for (let j = 0; j < 3; j++) {
        if (positions[i3 + j] > this.bounds || positions[i3 + j] < -this.bounds) {
          this.velocities[i3 + j] *= -1;
        }
      }
    }

    this.points.geometry.attributes.position.needsUpdate = true;
  }
}