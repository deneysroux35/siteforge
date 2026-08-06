import { dahua } from "./dahua";
import { hikvision } from "./hikvision";

export const cameraDatabase = [
  ...hikvision,
  ...dahua,
];

export const manufacturers = [
  ...new Set(
    cameraDatabase.map(
      (camera) => camera.manufacturer,
    ),
  ),
].sort();
