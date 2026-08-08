import type { Point } from './geometry'

export type CableType =
  | 'cat6'
  | 'cat6a'
  | 'fibre'
  | 'coax'
  | 'power'
  | 'other'

export interface CableRoutePoint
  extends Point {
  id: string
}

export interface CableRoute {
  id: string

  name: string

  type: CableType

  sourceHubId: string | null

  destinationCameraId: string | null

  points: CableRoutePoint[]

  selected: boolean
}

export interface CableMeasurement {
  cameraId: string

  hubId: string

  straightLineMeters: number

  routeMeters: number

  slackMeters: number

  serviceLoopMeters: number

  totalMeters: number
}
