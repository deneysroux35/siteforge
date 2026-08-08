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
    | string
    | undefined

  model:
    | string
    | undefined

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
    | PoeSwitchProduct
    | null

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
 * has no verified catalogue power.
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
  /*
   * First try product ID.
   */
  if (
    camera.productId
  ) {
    const productById =
      cameraDatabase.find(
        (product) =>
          product.id ===
          camera.productId,
      )

    if (
      productById
    ) {
      return productById
    }
  }

  /*
   * Then try manufacturer +
   * model for older drawings.
   */
  if (
    !camera.manufacturer ||
    !camera.model ||
    camera.manufacturer ===
      'Unassigned' ||
    camera.model ===
      'Unassigned'
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
  /*
   * BEST SOURCE
   *
   * Camera Library stores the
   * verified product power directly
   * on the placed camera.
   */
  if (
    typeof camera.power ===
      'number' &&
    Number.isFinite(
      camera.power,
    ) &&
    camera.power > 0
  ) {
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
        camera.power,

      source:
        'catalogue',
    }
  }

  /*
   * SECOND SOURCE
   *
   * Older projects may not contain
   * camera.power, so look up the
   * selected catalogue camera.
   */
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

  /*
   * LAST RESORT
   *
   * Keep rack sizing operational
   * for an unassigned camera while
   * clearly marking the value as
   * provisional.
   */
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

          if (
            first.poeBudgetWatts !==
            second.poeBudgetWatts
          ) {
            return (
              first.poeBudgetWatts -
              second.poeBudgetWatts
            )
          }

          return (
            first.sellPrice -
            second.sellPrice
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
   * Empty rack.
   */
  if (
    cameraCount === 0
  ) {
    return {
      cameraCount:
        0,

      requiredPoePorts:
        0,

      totalPoeWatts:
        0,

      cameraLoads,

      recommendedSwitch:
        null,

      freePoePorts:
        0,

      poeHeadroomWatts:
        0,

      portUtilisationPercentage:
        0,

      poeUtilisationPercentage:
        0,

      fallbackCameraCount:
        0,

      status:
        'HEALTHY',

      warnings:
        [],
    }
  }

  /*
   * Include engineering headroom
   * when selecting the switch.
   */
  const requiredWattsWithHeadroom =
    totalPoeWatts *
    1.25

  const recommendedSwitch =
    selectPoeSwitch(
      requiredPoePorts,
      requiredWattsWithHeadroom,
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

  /*
   * Warn when very little port
   * capacity remains.
   */
  if (
    portUtilisationPercentage >=
    90
  ) {
    warnings.push(
      'PoE port utilisation is 90% or higher.',
    )
  }

  /*
   * Warn when the switch PoE
   * budget is heavily utilised.
   */
  if (
    poeUtilisationPercentage >=
    80
  ) {
    warnings.push(
      'PoE power utilisation is 80% or higher.',
    )
  }

  /*
   * Any fallback power value means
   * the engineering figure has not
   * yet been verified by a selected
   * catalogue product.
   */
  if (
    fallbackCameraCount > 0
  ) {
    warnings.push(
      `${fallbackCameraCount} camera${
        fallbackCameraCount === 1
          ? ''
          : 's'
      } ${
        fallbackCameraCount === 1
          ? 'is'
          : 'are'
      } using fallback PoE power because no verified catalogue power value was found.`,
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
      warnings.length >
      0
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
