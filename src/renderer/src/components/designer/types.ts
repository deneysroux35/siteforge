export type Tool =
  | "select"
  | "wall"
  | "door"
  | "camera";

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;

  start: Point;

  end: Point;

  thickness: number;

  selected: boolean;

  material: "Brick" | "Drywall";

  height: number;
}
