import type {
  Camera,
} from './camera'

import type {
  CableRoute,
} from './cable'

import type {
  EquipmentHub,
} from './equipmentHub'

import type {
  Wall,
} from './wall'

export interface ProjectFloor {
  id: string

  name: string

  level: number

  walls: Wall[]

  cameras: Camera[]

  equipmentHubs:
    EquipmentHub[]

  cableRoutes:
    CableRoute[]
}

export interface ProjectBuilding {
  id: string

  name: string

  floors: ProjectFloor[]
}

export interface SiteForgeProjectModel {
  id: string

  name: string

  buildings:
    ProjectBuilding[]
}
