import {
  cameraDatabase,
} from '../data/cameras'

import {
  getPoeSwitchProducts,
  type PoeSwitchProduct,
} from '../data/equipmentCatalog'

import type {
  Camera,
} from '../models/camera'

export interface CameraPoeLoad {
  cameraId: string
  cameraName: string

  manufacturer:
    string | undefined

  model:
    string | undefined

  powerWatts: number

  source:
    | 'catalogue'
    | 'fallback'
}

export interface RackPoeAnalysis {
  cameraCount: number

  requiredPoePorts: number

  totalPoeWatts: number

  cameraLoads:
    CameraPoeLoad[]

  recommendedSwitch:
    PoeSwitchProduct | null

  freePoePorts: number

  poeHeadroomWatts: number

  portUtilisationPercentage: number

  poeUtilisationPercentage: number

  fallbackCameraCount: number

  status:
    | 'HEALTHY'
    | 'WARNING'
    | 'NO SUITABLE SWITCH'

  warnings: string[]
}

/*
 * Used only when a placed camera
 * has not yet been assigned a
 * recognised catalogue model.
 */
const FALLBACK_CAMERA_POWER_WATTS =
  8

function roundTo(
  value: number,
  decimals: number,
): number {
  const multiplier =
    10 ** decimals

  return (
    Math.round(
      value *
        multiplier,
    ) / multiplier
  )
}

function findCatalogueCamera(
  camera: Camera,
) {
  if (
    !camera.manufacturer ||
    !camera.model
  ) {
    return undefined
  }

  return cameraDatabase.find(
    (product) =>
      product.manufacturer ===
        camera.manufacturer &&
      product.model ===
        camera.model,
  )
}

export function calculateCameraPoeLoad(
  camera: Camera,
): CameraPoeLoad {
  const catalogueCamera =
    findCatalogueCamera(
      camera,
    )

  if (
    catalogueCamera
  ) {
    return {
      cameraId:
        camera.id,

      cameraName:
        camera.name,

      manufacturer:
        catalogueCamera.manufacturer,

      model:
        catalogueCamera.model,

      powerWatts:
        catalogueCamera.power,

      source:
        'catalogue',
    }
  }

  return {
    cameraId:
      camera.id,

    cameraName:
      camera.name,

    manufacturer:
      camera.manufacturer,

    model:
      camera.model,

    powerWatts:
      FALLBACK_CAMERA_POWER_WATTS,

    source:
      'fallback',
  }
}

function selectPoeSwitch(
  requiredPorts: number,
  requiredWatts: number,
): PoeSwitchProduct | null {
  const switches =
    getPoeSwitchProducts()
      .slice()
      .sort(
        (
          first,
          second,
        ) => {
          if (
            first.poePorts !==
            second.poePorts
          ) {
            return (
              first.poePorts -
              second.poePorts
            )
          }

          return (
            first.poeBudgetWatts -
            second.poeBudgetWatts
          )
        },
      )

  return (
    switches.find(
      (poeSwitch) =>
        poeSwitch.poePorts >=
          requiredPorts &&
        poeSwitch.poeBudgetWatts >=
          requiredWatts,
    ) ??
    null
  )
}

export function analyseRackPoe(
  cameras: Camera[],
): RackPoeAnalysis {
  const cameraLoads =
    cameras.map(
      calculateCameraPoeLoad,
    )

  const cameraCount =
    cameras.length

  const requiredPoePorts =
    cameraCount

  const totalPoeWatts =
    roundTo(
      cameraLoads.reduce(
        (
          total,
          camera,
        ) =>
          total +
          camera.powerWatts,
        0,
      ),
      1,
    )

  const fallbackCameraCount =
    cameraLoads.filter(
      (camera) =>
        camera.source ===
        'fallback',
    ).length

  /*
   * An empty rack does not require
   * a switch yet.
   */
  if (
    cameraCount === 0
  ) {
    return {
      cameraCount: 0,

      requiredPoePorts: 0,

      totalPoeWatts: 0,

      cameraLoads,

      recommendedSwitch:
        null,

      freePoePorts: 0,

      poeHeadroomWatts: 0,

      portUtilisationPercentage:
        0,

      poeUtilisationPercentage:
        0,

      fallbackCameraCount:
        0,

      status:
        'HEALTHY',

      warnings: [],
    }
  }

  const recommendedSwitch =
    selectPoeSwitch(
      requiredPoePorts,
      totalPoeWatts,
    )

  if (
    !recommendedSwitch
  ) {
    const warnings: string[] =
      [
        'No PoE switch in the current equipment catalogue can support this rack.',
      ]

    return {
      cameraCount,

      requiredPoePorts,

      totalPoeWatts,

      cameraLoads,

      recommendedSwitch:
        null,

      freePoePorts:
        0,

      poeHeadroomWatts:
        0,

      portUtilisationPercentage:
        100,

      poeUtilisationPercentage:
        100,

      fallbackCameraCount,

      status:
        'NO SUITABLE SWITCH',

      warnings,
    }
  }

  const freePoePorts =
    recommendedSwitch.poePorts -
    requiredPoePorts

  const poeHeadroomWatts =
    roundTo(
      recommendedSwitch
        .poeBudgetWatts -
        totalPoeWatts,
      1,
    )

  const portUtilisationPercentage =
    roundTo(
      (
        requiredPoePorts /
        recommendedSwitch.poePorts
      ) *
        100,
      1,
    )

  const poeUtilisationPercentage =
    roundTo(
      (
        totalPoeWatts /
        recommendedSwitch
          .poeBudgetWatts
      ) *
        100,
      1,
    )

  const warnings: string[] =
    []

  if (
    portUtilisationPercentage >=
    90
  ) {
    warnings.push(
      'PoE port utilisation is 90% or higher.',
    )
  }

  if (
    poeUtilisationPercentage >=
    80
  ) {
    warnings.push(
      'PoE power utilisation is 80% or higher.',
    )
  }

  if (
    fallbackCameraCount > 0
  ) {
    warnings.push(
      `${fallbackCameraCount} camera${
        fallbackCameraCount === 1
          ? ''
          : 's'
      } are using fallback power values because no catalogue match was found.`,
    )
  }

  return {
    cameraCount,

    requiredPoePorts,

    totalPoeWatts,

    cameraLoads,

    recommendedSwitch,

    freePoePorts,

    poeHeadroomWatts,

    portUtilisationPercentage,

    poeUtilisationPercentage,

    fallbackCameraCount,

    status:
      warnings.length > 0
        ? 'WARNING'
        : 'HEALTHY',

    warnings,
  }
}

export function analyseHubPoe(
  hubId: string,
  cameras: Camera[],
): RackPoeAnalysis {
  const assignedCameras =
    cameras.filter(
      (camera) =>
        camera.assignedHubId ===
        hubId,
    )

  return analyseRackPoe(
    assignedCameras,
  )
}
