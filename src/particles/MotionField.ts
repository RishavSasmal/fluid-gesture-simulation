import { createNoise3D } from "simplex-noise";

export class MotionField {
  private noise3D = createNoise3D();
  private scale: number;
  private epsilon: number;

  constructor(scale: number = 0.9, epsilon: number = 0.1) {
    this.scale = scale;
    this.epsilon = epsilon;
  }

  private sample(x: number, y: number, z: number, time: number): number {
    return this.noise3D(
      x * this.scale + time,
      y * this.scale,
      z * this.scale
    );
  }

  public getForce(
    x: number,
    y: number,
    z: number,
    time: number
  ): { x: number; y: number; z: number } {
    const e = this.epsilon;

    const n1 = this.sample(x, y + e, z, time);
    const n2 = this.sample(x, y - e, z, time);

    const n3 = this.sample(x, y, z + e, time);
    const n4 = this.sample(x, y, z - e, time);

    const n5 = this.sample(x + e, y, z, time);
    const n6 = this.sample(x - e, y, z, time);

    const curlX = n2 - n1;
    const curlY = n4 - n3;
    const curlZ = n6 - n5;

    return { x: curlX, y: curlY, z: curlZ };
  }
}