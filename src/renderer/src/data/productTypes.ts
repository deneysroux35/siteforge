export interface CameraProduct {
  id: string;

  manufacturer: string;

  model: string;

  resolutionMP: number;

  lensOptions: number[];

  defaultLens: number;

  horizontalFOV: number;

  verticalFOV: number;

  irRange: number;

  maxDistance: number;

  price: number;

  power: number;

  sensor: string;

  image?: string;
}
