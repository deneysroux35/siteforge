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

function sortBySellPrice<T extends {
  sellPrice: number
}>(
  products: T[],
): T[] {
  return [...products].sort(
    (first, second) =>
      first.sellPrice -
      second.sellPrice,
  )
}

function findRecommendedNvr(
  summary: ProjectSummary,
): NvrProduct | null {
  if (
    summary.cameraCount === 0
  ) {
    return null
  }

  const products =
    sortBySellPrice(
      getNvrProducts(),
    )

  const suitableProducts =
    products
      .filter(
        (product) =>
          product.channels >=
            summary.cameraCount &&
          product.maxResolutionMP >=
            summary.averageResolutionMP,
      )
      .sort(
        (first, second) => {
          if (
            first.channels !==
            second.channels
          ) {
            return (
              first.channels -
              second.channels
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

function findRecommendedPoeSwitch(
  summary: ProjectSummary,
  nvr: NvrProduct | null,
): PoeSwitchProduct | null {
  if (
    summary.cameraCount === 0
  ) {
    return null
  }

  /*
   * If the recommended NVR already
   * provides enough integrated PoE
   * ports, a separate PoE switch is
   * not required.
   */
  if (
    nvr &&
    nvr.poePorts >=
      summary.cameraCount &&
    nvr.poePorts > 0
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
        (first, second) => {
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
    products[0] ??
    null
  )
}

function findStorageRecommendation(
  requiredStorageTB: number,
): StorageRecommendation {
  if (
    requiredStorageTB <= 0
  ) {
    return {
      requiredStorageTB: 0,
      drive: null,
      quantity: 0,
      installedCapacityTB: 0,
      spareCapacityTB: 0,
    }
  }

  const products =
    getStorageProducts()

  if (
    products.length === 0
  ) {
    return {
      requiredStorageTB,
      drive: null,
      quantity: 0,
      installedCapacityTB: 0,
      spareCapacityTB: 0,
    }
  }

  /*
   * Evaluate every HDD option and
   * choose the combination with the
   * lowest sell price that still
   * meets the required capacity.
   */
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
    (first, second) => {
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

  if (!selected) {
    return {
      requiredStorageTB,
      drive: null,
      quantity: 0,
      installedCapacityTB: 0,
      spareCapacityTB: 0,
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
        ).toFixed(2),
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
      (first, second) =>
        first.capacityWatts -
        second.capacityWatts,
    )
}

function findRecommendedUps(
  summary: ProjectSummary,
  nvr: NvrProduct | null,
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
   * Approximate protected load.
   *
   * Camera power is included even
   * when supplied through PoE because
   * the UPS ultimately has to support
   * that electrical load.
   */
  const estimatedLoadWatts =
    summary.totalCameraPower +
    (nvr?.power ?? 0) +
    25

  /*
   * Add 30% headroom so the UPS is
   * not selected at its absolute
   * maximum rating.
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
      products.length - 1
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
    nvr?.sellPrice ?? 0

  const switchCost =
    poeSwitch?.sellPrice ?? 0

  const storageCost =
    storage.drive
      ? storage.drive.sellPrice *
        storage.quantity
      : 0

  const upsCost =
    ups?.sellPrice ?? 0

  return (
    nvrCost +
    switchCost +
    storageCost +
    upsCost
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
  const warnings: string[] = []

  if (
    summary.cameraCount === 0
  ) {
    return warnings
  }

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

  if (!nvr) {
    warnings.push(
      'No NVR in the current catalog can support this project.',
    )
  }

  const nvrHasIntegratedPoe =
    Boolean(
      nvr &&
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

  if (
    summary.estimatedStorageTB >
      0 &&
    !storage.drive
  ) {
    warnings.push(
      'No suitable surveillance storage product was found.',
    )
  }

  if (!ups) {
    warnings.push(
      'No suitable UPS product was found.',
    )
  }

  if (
    nvr &&
    storage.installedCapacityTB >
      nvr.maxStorageTB
  ) {
    warnings.push(
      `Recommended storage (${storage.installedCapacityTB} TB) exceeds the ${nvr.model} maximum storage capacity of ${nvr.maxStorageTB} TB.`,
    )
  }

  return warnings
}

export function calculateSmartEquipment(
  summary: ProjectSummary,
): SmartEquipmentRecommendation {
  const nvr =
    findRecommendedNvr(
      summary,
    )

  const poeSwitch =
    findRecommendedPoeSwitch(
      summary,
      nvr,
    )

  const storage =
    findStorageRecommendation(
      summary.estimatedStorageTB,
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
