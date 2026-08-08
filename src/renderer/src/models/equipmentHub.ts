import type { Point } from './geometry'

export type EquipmentHubType =
  | 'rack'
  | 'cabinet'
  | 'nvr'

export interface EquipmentHub {
  id: string

  name: string

  position: Point

  type: EquipmentHubType

  selected: boolean
}
