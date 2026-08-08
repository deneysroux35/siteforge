import type { Point } from './geometry'

export type WallMaterial =
  | 'Brick'
  | 'Drywall'

export interface Wall {
  id: string

  start: Point
  end: Point

  thickness: number
  height: number

  material: WallMaterial

  selected: boolean
}