import { createNoise3D } from "simplex-noise";

// export class MotionField {
//   private noise3D = createNoise3D();
//   private scale = 0.6;

//   public getForce(x: number, y: number, z: number, time: number) {
//     const nx = this.noise3D(x * this.scale, y * this.scale, time);
//     const ny = this.noise3D(y * this.scale, z * this.scale, time);
//     const nz = this.noise3D(z * this.scale, x * this.scale, time);

//     return { x: nx, y: ny, z: nz };
//   }
// }


// export class MotionField {
//   private noise3D = createNoise3D();
//   private scale = 0.6;

//   private sample(x: number, y: number, z: number, time: number) {
//     return this.noise3D(
//       x * this.scale,
//       y * this.scale,
//       z * this.scale + time
//     );
//   }

//   public getForce(x: number, y: number, z: number, time: number) {
//     const eps = 0.0001;

//     // Partial derivatives using finite differences
//     const dx =
//       this.sample(x + eps, y, z, time) -
//       this.sample(x - eps, y, z, time);

//     const dy =
//       this.sample(x, y + eps, z, time) -
//       this.sample(x, y - eps, z, time);

//     const dz =
//       this.sample(x, y, z + eps, time) -
//       this.sample(x, y, z - eps, time);

//     // Curl approximation
//     const curlX = dy - dz;
//     const curlY = dz - dx;
//     const curlZ = dx - dy;

//     return { x: curlX, y: curlY, z: curlZ };
//   }
// }


export class MotionField {
  private noise3D = createNoise3D();
  private scale = 0.9;

  private sample(x: number, y: number, z: number, time: number) {
    return this.noise3D(
      x * this.scale + time,
      y * this.scale,
      z * this.scale
    );
  }

  public getForce(x: number, y: number, z: number, time: number) {
    const eps = 0.1; // IMPORTANT: larger epsilon

    const n1 = this.sample(x, y + eps, z, time);
    const n2 = this.sample(x, y - eps, z, time);

    const n3 = this.sample(x, y, z + eps, time);
    const n4 = this.sample(x, y, z - eps, time);

    const n5 = this.sample(x + eps, y, z, time);
    const n6 = this.sample(x - eps, y, z, time);

    const curlX = n2 - n1;
    const curlY = n4 - n3;
    const curlZ = n6 - n5;

    return { x: curlX, y: curlY, z: curlZ };
  }
}