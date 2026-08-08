import {
  getNvrProducts,
  getPoeSwitchProducts,
  getStorageProducts,
  equipmentCatalog,
  type NvrProduct,
  type PoeSwitchProduct,
  type PowerProduct,
  type StorageProduct,
} from '../data/equipmentCatalog'

import type {
  ProjectSummary,
} from './projectEngine'

export interface StorageRecommendation {
  requiredStorageTB: number

  drive:
    | StorageProduct
    | null

  quantity: number

  installedCapacityTB: number

  spareCapacityTB: number
}

export interface SmartEquipmentRecommendation {
  nvr:
    | NvrProduct
    | null

  poeSwitch:
    | PoeSwitchProduct
    | null

  storage:
    StorageRecommendation

  ups:
    | PowerProduct
    | null

  infrastructureCost: number

  warnings: string[]
}
/*
 * NVR SELECTION
 *
 * An NVR must now satisfy:
 *
 * 1. Camera channels
 * 2. Camera resolution
 * 3. Incoming bandwidth
 * 4. Required storage capacity
 *
 * We then choose the smallest
 * suitable recorder.
 */
function findRecommendedNvr(
  summary: ProjectSummary,
): NvrProduct | null {
  if (
    summary.cameraCount === 0
  ) {
    return null
  }

  const products =
    getNvrProducts()

  const suitableProducts =
    products
      .filter(
        (product) =>
          product.channels >=
            summary.cameraCount &&
          product.maxResolutionMP >=
            summary.averageResolutionMP &&
          product.incomingBandwidthMbps >=
            summary.recommendedNVRBandwidthMbps &&
          product.maxStorageTB >=
            summary.estimatedStorageTB,
      )
      .sort(
        (
          first,
          second,
        ) => {
          /*
           * Prefer the smallest
           * channel count first.
           */
          if (
            first.channels !==
            second.channels
          ) {
            return (
              first.channels -
              second.channels
            )
          }

          /*
           * Then choose the recorder
           * with the smallest suitable
           * bandwidth capacity.
           */
          if (
            first.incomingBandwidthMbps !==
            second.incomingBandwidthMbps
          ) {
            return (
              first.incomingBandwidthMbps -
              second.incomingBandwidthMbps
            )
          }

          /*
           * Then prefer lower maximum
           * storage capacity because it
           * normally represents the
           * smaller recorder.
           */
          if (
            first.maxStorageTB !==
            second.maxStorageTB
          ) {
            return (
              first.maxStorageTB -
              second.maxStorageTB
            )
          }

          return (
            first.sellPrice -
            second.sellPrice
          )
        },
      )

  return (
    suitableProducts[0] ??
    null
  )
}

/*
 * POE SWITCH SELECTION
 *
 * If the NVR already provides
 * enough integrated PoE ports,
 * a separate PoE switch is not
 * required.
 *
 * Otherwise choose a switch that
 * supports both:
 *
 * - required ports
 * - required PoE power budget
 */
function findRecommendedPoeSwitch(
  summary: ProjectSummary,
  nvr:
    | NvrProduct
    | null,
): PoeSwitchProduct | null {
  if (
    summary.cameraCount === 0
  ) {
    return null
  }

  const nvrHasIntegratedPoe =
    Boolean(
      nvr &&
      nvr.poePorts > 0 &&
      nvr.poePorts >=
        summary.cameraCount,
    )

  if (
    nvrHasIntegratedPoe
  ) {
    return null
  }

  const products =
    getPoeSwitchProducts()
      .filter(
        (product) =>
          product.poePorts >=
            summary.cameraCount &&
          product.poeBudgetWatts >=
            summary.recommendedPoEPowerBudget,
      )
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
    products[0] ??
    null
  )
}

/*
 * STORAGE SELECTION
 *
 * Evaluate every surveillance
 * HDD and choose the lowest-cost
 * combination that satisfies the
 * estimated storage requirement.
 */
function findStorageRecommendation(
  requiredStorageTB: number,
): StorageRecommendation {
  if (
    requiredStorageTB <= 0
  ) {
    return {
      requiredStorageTB:
        0,

      drive:
        null,

      quantity:
        0,

      installedCapacityTB:
        0,

      spareCapacityTB:
        0,
    }
  }

  const products =
    getStorageProducts()

  if (
    products.length === 0
  ) {
    return {
      requiredStorageTB,

      drive:
        null,

      quantity:
        0,

      installedCapacityTB:
        0,

      spareCapacityTB:
        0,
    }
  }

  const options =
    products.map(
      (drive) => {
        const quantity =
          Math.ceil(
            requiredStorageTB /
              drive.capacityTB,
          )

        const installedCapacityTB =
          quantity *
          drive.capacityTB

        const totalSellPrice =
          quantity *
          drive.sellPrice

        return {
          drive,

          quantity,

          installedCapacityTB,

          totalSellPrice,
        }
      },
    )

  options.sort(
    (
      first,
      second,
    ) => {
      if (
        first.totalSellPrice !==
        second.totalSellPrice
      ) {
        return (
          first.totalSellPrice -
          second.totalSellPrice
        )
      }

      return (
        first.installedCapacityTB -
        second.installedCapacityTB
      )
    },
  )

  const selected =
    options[0]

  if (
    !selected
  ) {
    return {
      requiredStorageTB,

      drive:
        null,

      quantity:
        0,

      installedCapacityTB:
        0,

      spareCapacityTB:
        0,
    }
  }

  return {
    requiredStorageTB,

    drive:
      selected.drive,

    quantity:
      selected.quantity,

    installedCapacityTB:
      selected.installedCapacityTB,

    spareCapacityTB:
      Number(
        (
          selected.installedCapacityTB -
          requiredStorageTB
        ).toFixed(
          2,
        ),
      ),
  }
}

function getUpsProducts():
  PowerProduct[] {
  return equipmentCatalog
    .filter(
      (
        product,
      ): product is PowerProduct =>
        product.category ===
          'power' &&
        product.powerType ===
          'UPS' &&
        product.active,
    )
    .sort(
      (
        first,
        second,
      ) =>
        first.capacityWatts -
        second.capacityWatts,
    )
}

/*
 * UPS SIZING
 *
 * Camera power is included even
 * when the cameras are PoE because
 * that electrical load still needs
 * to be supplied by the protected
 * infrastructure.
 */
function findRecommendedUps(
  summary: ProjectSummary,
  nvr:
    | NvrProduct
    | null,

  poeSwitch:
    | PoeSwitchProduct
    | null,
): PowerProduct | null {
  if (
    summary.cameraCount === 0
  ) {
    return null
  }

  /*
   * Add an allowance for the
   * network switch itself.
   *
   * The catalogue currently stores
   * PoE budget rather than actual
   * switch operating consumption,
   * so we use a modest infrastructure
   * allowance here.
   */
  const switchInfrastructureWatts =
    poeSwitch
      ? 25
      : 0

  const estimatedLoadWatts =
    summary.totalCameraPower +
    (
      nvr?.power ??
      0
    ) +
    switchInfrastructureWatts +
    15

  /*
   * 30% UPS headroom.
   */
  const requiredUpsWatts =
    estimatedLoadWatts *
    1.3

  const products =
    getUpsProducts()

  return (
    products.find(
      (product) =>
        product.capacityWatts >=
        requiredUpsWatts,
    ) ??
    products[
      products.length -
        1
    ] ??
    null
  )
}

function calculateInfrastructureCost(
  nvr:
    | NvrProduct
    | null,

  poeSwitch:
    | PoeSwitchProduct
    | null,

  storage:
    StorageRecommendation,

  ups:
    | PowerProduct
    | null,
): number {
  const nvrCost =
    nvr?.sellPrice ??
    0

  const switchCost =
    poeSwitch?.sellPrice ??
    0

  const storageCost =
    storage.drive
      ? storage.drive.sellPrice *
        storage.quantity
      : 0

  const upsCost =
    ups?.sellPrice ??
    0

  return Number(
    (
      nvrCost +
      switchCost +
      storageCost +
      upsCost
    ).toFixed(
      2,
    ),
  )
}

function buildWarnings(
  summary: ProjectSummary,

  nvr:
    | NvrProduct
    | null,

  poeSwitch:
    | PoeSwitchProduct
    | null,

  storage:
    StorageRecommendation,

  ups:
    | PowerProduct
    | null,
): string[] {
  const warnings: string[] =
    []

  if (
    summary.cameraCount === 0
  ) {
    return warnings
  }

  /*
   * CAMERA CATALOGUE
   */
  if (
    summary.unassignedCameraCount >
    0
  ) {
    warnings.push(
      `${summary.unassignedCameraCount} camera${
        summary.unassignedCameraCount ===
        1
          ? ''
          : 's'
      } do not have a catalog product assigned.`,
    )
  }

  /*
   * NVR
   */
  if (
    !nvr
  ) {
    warnings.push(
      'No NVR in the current catalog satisfies the required channels, resolution, incoming bandwidth and storage capacity.',
    )
  }

  if (
    nvr
  ) {
    const channelUtilisation =
      (
        summary.cameraCount /
        nvr.channels
      ) *
      100

    if (
      channelUtilisation >=
      90
    ) {
      warnings.push(
        `NVR channel utilisation is ${channelUtilisation.toFixed(
          0,
        )}%.`,
      )
    }

    const bandwidthUtilisation =
      nvr.incomingBandwidthMbps >
      0
        ? (
            summary.estimatedBandwidthMbps /
            nvr.incomingBandwidthMbps
          ) *
          100
        : 0

    if (
      bandwidthUtilisation >=
      80
    ) {
      warnings.push(
        `NVR incoming bandwidth utilisation is ${bandwidthUtilisation.toFixed(
          0,
        )}%.`,
      )
    }

    if (
      summary.averageResolutionMP >
      nvr.maxResolutionMP
    ) {
      warnings.push(
        `Average camera resolution exceeds the ${nvr.model} supported resolution.`,
      )
    }

    if (
      storage.installedCapacityTB >
      nvr.maxStorageTB
    ) {
      warnings.push(
        `Recommended storage (${storage.installedCapacityTB} TB) exceeds the ${nvr.model} maximum storage capacity of ${nvr.maxStorageTB} TB.`,
      )
    }

    /*
     * Physical SATA bay check.
     */
    if (
      storage.quantity >
      nvr.sataBays
    ) {
      warnings.push(
        `Storage requires ${storage.quantity} drives but ${nvr.model} has only ${nvr.sataBays} SATA bay${
          nvr.sataBays === 1
            ? ''
            : 's'
        }.`,
      )
    }
  }

  /*
   * POE
   */
  const nvrHasIntegratedPoe =
    Boolean(
      nvr &&
      nvr.poePorts > 0 &&
      nvr.poePorts >=
        summary.cameraCount,
    )

  if (
    !poeSwitch &&
    !nvrHasIntegratedPoe
  ) {
    warnings.push(
      'No PoE switch in the current catalog can support the required ports and power budget.',
    )
  }

  /*
   * STORAGE
   */
  if (
    summary.estimatedStorageTB >
      0 &&
    !storage.drive
  ) {
    warnings.push(
      'No suitable surveillance storage product was found.',
    )
  }

  /*
   * UPS
   */
  if (
    !ups
  ) {
    warnings.push(
      'No suitable UPS product was found.',
    )
  }

  return warnings
}

export function calculateSmartEquipment(
  summary: ProjectSummary,
): SmartEquipmentRecommendation {
  /*
   * Storage requirement is known
   * before final NVR selection.
   */
  const storage =
    findStorageRecommendation(
      summary.estimatedStorageTB,
    )

  const nvr =
    findRecommendedNvr(
      summary,
    )

  const poeSwitch =
    findRecommendedPoeSwitch(
      summary,
      nvr,
    )

  const ups =
    findRecommendedUps(
      summary,
      nvr,
      poeSwitch,
    )

  const infrastructureCost =
    calculateInfrastructureCost(
      nvr,
      poeSwitch,
      storage,
      ups,
    )

  const warnings =
    buildWarnings(
      summary,
      nvr,
      poeSwitch,
      storage,
      ups,
    )

  return {
    nvr,

    poeSwitch,

    storage,

    ups,

    infrastructureCost,

    warnings,
  }
}
