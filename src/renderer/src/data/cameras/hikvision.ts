import type { CameraProduct } from "../productTypes";

export const hikvision: CameraProduct[] = [
  {
    id: "hik-2043g2i",

    manufacturer: "Hikvision",

    model: "DS-2CD2043G2-I",

    resolutionMP: 4,

    lensOptions: [2.8, 4, 6],

    defaultLens: 2.8,

    horizontalFOV: 103,

    verticalFOV: 56,

    irRange: 40,

    maxDistance: 20,

    price: 2295,

    power: 6,

    sensor: '1/3"',
  },

  {
    id: "hik-2087g2lu",

    manufacturer: "Hikvision",

    model: "DS-2CD2087G2-LU",

    resolutionMP: 8,

    lensOptions: [2.8, 4],

    defaultLens: 2.8,

    horizontalFOV: 108,

    verticalFOV: 58,

    irRange: 40,

    maxDistance: 30,

    price: 4295,

    power: 7,

    sensor: '1/2.8"',
  },

  {
    id: "hik-2387g2lu",

    manufacturer: "Hikvision",

    model: "DS-2CD2387G2-LU",

    resolutionMP: 8,

    lensOptions: [2.8],

    defaultLens: 2.8,

    horizontalFOV: 108,

    verticalFOV: 58,

    irRange: 30,

    maxDistance: 25,

    price: 3895,

    power: 7,

    sensor: '1/2.8"',
  },
];
