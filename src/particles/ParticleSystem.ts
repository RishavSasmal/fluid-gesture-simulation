import * as THREE from "three";
import { MotionField } from "./MotionField";

export class ParticleSystem {
  private points: THREE.Points;
  private velocities: Float32Array;
  private particleCount: number = 10000;
  private motionField: MotionField;

  constructor(scene: THREE.Scene) {
    this.motionField = new MotionField();
    this.velocities = new Float32Array(this.particleCount * 3);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      positions[i3]     = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0x00ffff) },
      },
      vertexShader: `
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 10.0 / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(geometry, material);
  }

  public update(mousePos: THREE.Vector3): void {
    const positions = this.points.geometry.attributes.position.array as Float32Array;
    const velocities = this.velocities;

    const curlStrength = 0.003;
    const mouseStrength = 0.01;
    const damping = 0.995;
    const time = performance.now() * 0.0003;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      // Curl force
      const force = this.motionField.getForce(x, y, z, time);
      velocities[i3]     += force.x * curlStrength;
      velocities[i3 + 1] += force.y * curlStrength;
      velocities[i3 + 2] += force.z * curlStrength;

      // Mouse push (XY plane only)
      velocities[i3]     += (mousePos.x - x) * mouseStrength;
      velocities[i3 + 1] += (mousePos.y - y) * mouseStrength;

      // Damping
      velocities[i3]     *= damping;
      velocities[i3 + 1] *= damping;
      velocities[i3 + 2] *= damping;

      // Integrate
      positions[i3]     += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Boundary reset
      if (
        positions[i3] > 1 || positions[i3] < -1 ||
        positions[i3 + 1] > 1 || positions[i3 + 1] < -1 ||
        positions[i3 + 2] > 1 || positions[i3 + 2] < -1
      ) {
        positions[i3]     = (Math.random() - 0.5) * 2;
        positions[i3 + 1] = (Math.random() - 0.5) * 2;
        positions[i3 + 2] = (Math.random() - 0.5) * 2;

        velocities[i3]     = 0;
        velocities[i3 + 1] = 0;
        velocities[i3 + 2] = 0;
      }
    }

    this.points.geometry.attributes.position.needsUpdate = true;
  }

  public getPoints(): THREE.Points {
    return this.points;
  }
}