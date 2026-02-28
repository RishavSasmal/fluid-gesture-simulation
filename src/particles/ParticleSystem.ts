import * as THREE from "three";
// import { createNoise3D } from "simplex-noise";
import { MotionField } from "./MotionField";

export class ParticleSystem {
  private points: THREE.Points;
//   private velocities: Float32Array;
  private particleCount: number = 10000;
//   private bounds: number = 1;
//   private noise3D: (x: number, y: number, z: number) => number;
private motionField: MotionField;
private velocities: Float32Array;
  

  constructor(scene: THREE.Scene) {
    const geometry = new THREE.BufferGeometry();
    // this.noise3D = createNoise3D();
    this.motionField = new MotionField();
    this.velocities = new Float32Array(this.particleCount * 3);

    const positions = new Float32Array(this.particleCount * 3);
    // this.velocities = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Random position inside cube
      positions[i3] = (Math.random() - 0.5) * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * 2;

    //   Random velocity
    //   this.velocities[i3] = (Math.random() - 0.5) * 0.001;
    //   this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.001;
    //   this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    // const material = new THREE.PointsMaterial({
    //   color: 0xffffff,
    //   size: 0.02,
    // });

    // const textureLoader = new THREE.TextureLoader();
    // const circleTexture = textureLoader.load("/circle.png");

    // const material = new THREE.PointsMaterial({
    // size: 0.03,
    // color: 0x66ccff,
    // map: circleTexture,
    // // blending: THREE.AdditiveBlending,
    // transparent: true,
    // alphaTest: 0.5,
    // depthWrite: false,
    // });

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color(0x00ffff) },
        },
        // vertexShader: `
        //     void main() {
        //     gl_PointSize = 6.0;
        //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        //     }
        // `,

        vertexShader: `
        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Perspective size attenuation
            gl_PointSize = 10.0 / -mvPosition.z;
            
            gl_Position = projectionMatrix * mvPosition;
        }
        `,
        // fragmentShader: `
        //     uniform vec3 uColor;

        //     void main() {
        //     float dist = length(gl_PointCoord - vec2(0.5));
            
        //     if (dist > 0.5) {
        //         discard;
        //     }

        //     gl_FragColor = vec4(uColor, 1.0);
        //     }
        // `,
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
    // scene.add(this.points);
  }

  

//   public update(): void {
//     const positions = this.points.geometry.attributes.position
//       .array as Float32Array;

//     for (let i = 0; i < this.particleCount; i++) {
//       const i3 = i * 3;

//       positions[i3] += this.velocities[i3];
//       positions[i3 + 1] += this.velocities[i3 + 1];
//       positions[i3 + 2] += this.velocities[i3 + 2];

//       // Simple boundary bounce
//       for (let j = 0; j < 3; j++) {
//         if (positions[i3 + j] > this.bounds || positions[i3 + j] < -this.bounds) {
//           this.velocities[i3 + j] *= -1;
//         }
//       }
//     }

//     this.points.geometry.attributes.position.needsUpdate = true;
//   }

    // public update(): void {
    public update(mousePos: THREE.Vector3): void{
    const positions = this.points.geometry.attributes.position.array as Float32Array;
    const velocities = this.velocities;

    // const scale = 0.6;
    const speed = 0.004;
    const damping = 0.995;
    const time = performance.now() * 0.0003;

    for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;

        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // const nx = this.noise3D(x * scale, y * scale, time);
        // const ny = this.noise3D(y * scale, z * scale, time);
        // const nz = this.noise3D(z * scale, x * scale, time);

        // positions[i3] += nx * speed;
        // positions[i3 + 1] += ny * speed;
        // positions[i3 + 2] += nz * speed;

        const force = this.motionField.getForce(x, y, z, time);

        // // Add curl force to velocity
        // velocities[i3]     += force.x * speed;
        // velocities[i3 + 1] += force.y * speed;
        // velocities[i3 + 2] += force.z * speed;

        const dx = x - mousePos.x;
        const dy = y - mousePos.y;
        const dz = z - mousePos.z;

        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        // if (dist < 0.5) {
        //   const strength = (0.5 - dist) * 0.01;

        //   velocities[i3]     += dx * strength;
        //   velocities[i3 + 1] += dy * strength;
        //   velocities[i3 + 2] += dz * strength;
        // }

        // // Add inward pressure force
        // velocities[i3]     -= x * 0.05;
        // velocities[i3 + 1] -= y * 0.05;
        // velocities[i3 + 2] -= z * 0.05;

        // Apply damping (fluid smoothness)
        // velocities[i3]     *= damping;
        // velocities[i3 + 1] *= damping;
        // velocities[i3 + 2] *= damping;

        // // Update position
        // positions[i3]     += velocities[i3];
        // positions[i3 + 1] += velocities[i3 + 1];
        // positions[i3 + 2] += velocities[i3 + 2];


        // positions[i3] += force.x * speed;
        // positions[i3 + 1] += force.y * speed;
        // positions[i3 + 2] += force.z * speed;

        const speed = 0.003;
const damping = 0.995;

velocities[i3] += force.x * speed;
velocities[i3 + 1] += force.y * speed;
velocities[i3 + 2] += force.z * speed;

// mouse
velocities[i3] += (mousePos.x - x) * 0.01;
velocities[i3 + 1] += (mousePos.y - y) * 0.01;

velocities[i3] *= damping;
velocities[i3 + 1] *= damping;
velocities[i3 + 2] *= damping;

positions[i3] += velocities[i3];
positions[i3 + 1] += velocities[i3 + 1];
positions[i3 + 2] += velocities[i3 + 2];

        // Optional: soft boundary reset
        if (
        positions[i3] > 1 || positions[i3] < -1 ||
        positions[i3 + 1] > 1 || positions[i3 + 1] < -1 ||
        positions[i3 + 2] > 1 || positions[i3 + 2] < -1
        ) {
        positions[i3] = (Math.random() - 0.5) * 2;
        positions[i3 + 1] = (Math.random() - 0.5) * 2;
        positions[i3 + 2] = (Math.random() - 0.5) * 2;

        velocities[i3] = 0;
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