import type { Point } from './geometry'

export interface Camera {
  id: string

  name: string

  position: Point

  rotation: number

  fieldOfView: number

  range: number

  selected: boolean

  manufacturer?: string

  model?: string

  assignedHubId: string | null
}
