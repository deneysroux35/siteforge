import type {
  Camera,
  Wall,
} from '../components/designer/types'

import {
  cameraDatabase,
} from '../data/cameras'

import type {
  CameraProduct,
} from '../data/productTypes'

export interface CameraSummaryItem {
  productId: string | null

  manufacturer: string
  model: string

  quantity: number

  resolutionMP: number
  irRange: number

  power: number

  unitPrice: number
  totalPrice: number
}

export interface ProjectSummary {
  wallCount: number

  cameraCount: number

  assignedCameraCount: number
  unassignedCameraCount: number

  totalCameraCost: number
  totalCameraPower: number

  averageResolutionMP: number
  averageIRRange: number

  /*
   * Estimated aggregate camera
   * stream bandwidth.
   */
  estimatedBandwidthMbps: number

  /*
   * NVR bandwidth recommendation
   * includes 25% engineering
   * headroom.
   */
  recommendedNVRBandwidthMbps: number

  recommendedNVRChannels: number

  recommendedPoESwitchPorts: number
  recommendedPoEPowerBudget: number

  estimatedStorageTB: number

  cameraSchedule:
    CameraSummaryItem[]
}

interface CalculateProjectSummaryInput {
  walls: Wall[]

  cameras: Camera[]

  recordingDays?: number

  framesPerSecond?: number

  compression?:
    | 'H.264'
    | 'H.265'

  continuousRecording?: boolean
}

const DEFAULT_RECORDING_DAYS =
  30

const DEFAULT_FRAMES_PER_SECOND =
  15

function normaliseText(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      ' ',
    )
}

function findCameraProduct(
  camera: Camera,
): CameraProduct | null {
  /*
   * Best lookup:
   * exact catalogue product ID.
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
   * Second-best lookup:
   * manufacturer + model.
   */
  if (
    camera.manufacturer &&
    camera.model &&
    camera.manufacturer !==
      'Unassigned' &&
    camera.model !==
      'Unassigned'
  ) {
    const productByModel =
      cameraDatabase.find(
        (product) =>
          normaliseText(
            product.manufacturer,
          ) ===
            normaliseText(
              camera.manufacturer ??
                '',
            ) &&
          normaliseText(
            product.model,
          ) ===
            normaliseText(
              camera.model ??
                '',
            ),
      )

    if (
      productByModel
    ) {
      return productByModel
    }
  }

  /*
   * Legacy fallback:
   * older drawings may only have
   * the catalogue model stored in
   * the camera name.
   */
  const cameraName =
    normaliseText(
      camera.name,
    )

  return (
    cameraDatabase.find(
      (product) => {
        const fullProductName =
          normaliseText(
            `${product.manufacturer} ${product.model}`,
          )

        const model =
          normaliseText(
            product.model,
          )

        return (
          cameraName ===
            fullProductName ||
          cameraName ===
            model ||
          cameraName.includes(
            model,
          )
        )
      },
    ) ??
    null
  )
}

function recommendNVRChannels(
  cameraCount: number,
): number {
  if (
    cameraCount <= 0
  ) {
    return 0
  }

  if (
    cameraCount <= 4
  ) {
    return 4
  }

  if (
    cameraCount <= 8
  ) {
    return 8
  }

  if (
    cameraCount <= 16
  ) {
    return 16
  }

  if (
    cameraCount <= 32
  ) {
    return 32
  }

  if (
    cameraCount <= 64
  ) {
    return 64
  }

  return (
    Math.ceil(
      cameraCount /
        32,
    ) *
    32
  )
}

function recommendPoESwitchPorts(
  cameraCount: number,
): number {
  if (
    cameraCount <= 0
  ) {
    return 0
  }

  if (
    cameraCount <= 8
  ) {
    return 8
  }

  if (
    cameraCount <= 16
  ) {
    return 16
  }

  if (
    cameraCount <= 24
  ) {
    return 24
  }

  if (
    cameraCount <= 48
  ) {
    return 48
  }

  return (
    Math.ceil(
      cameraCount /
        24,
    ) *
    24
  )
}

function recommendPoEPowerBudget(
  totalCameraPower: number,
): number {
  if (
    totalCameraPower <= 0
  ) {
    return 0
  }

  const powerWithHeadroom =
    totalCameraPower *
    1.25

  const standardBudgets = [
    65,
    120,
    150,
    250,
    370,
    500,
    740,
  ]

  const matchingBudget =
    standardBudgets.find(
      (budget) =>
        budget >=
        powerWithHeadroom,
    )

  if (
    matchingBudget
  ) {
    return matchingBudget
  }

  return (
    Math.ceil(
      powerWithHeadroom /
        100,
    ) *
    100
  )
}

function estimateCameraBitrateMbps(
  resolutionMP: number,
  framesPerSecond: number,
  compression:
    | 'H.264'
    | 'H.265',
): number {
  const safeResolution =
    Math.max(
      1,
      resolutionMP,
    )

  const safeFramesPerSecond =
    Math.max(
      1,
      framesPerSecond,
    )

  /*
   * Engineering estimate.
   *
   * 0.8 Mbps per MP at 15 fps
   * before compression adjustment.
   */
  const baseBitrate =
    safeResolution *
    (
      safeFramesPerSecond /
      15
    ) *
    0.8

  const compressionMultiplier =
    compression ===
    'H.265'
      ? 0.65
      : 1

  return Math.max(
    1,
    baseBitrate *
      compressionMultiplier,
  )
}

function estimateProjectBandwidthMbps(
  cameras: Camera[],
  framesPerSecond: number,
  compression:
    | 'H.264'
    | 'H.265',
): number {
  if (
    cameras.length === 0
  ) {
    return 0
  }

  const total =
    cameras.reduce(
      (
        runningTotal,
        camera,
      ) => {
        const product =
          findCameraProduct(
            camera,
          )

        /*
         * If the camera has not
         * yet been catalogued,
         * assume 4 MP for the
         * engineering estimate.
         */
        const resolution =
          product?.resolutionMP ??
          camera.resolutionMP ??
          4

        return (
          runningTotal +
          estimateCameraBitrateMbps(
            resolution,
            framesPerSecond,
            compression,
          )
        )
      },
      0,
    )

  return Number(
    total.toFixed(2),
  )
}

function estimateStorageTB(
  cameras: Camera[],
  recordingDays: number,
  framesPerSecond: number,
  compression:
    | 'H.264'
    | 'H.265',
  continuousRecording: boolean,
): number {
  if (
    cameras.length === 0
  ) {
    return 0
  }

  const recordingMultiplier =
    continuousRecording
      ? 1
      : 0.45

  const totalBitrateMbps =
    estimateProjectBandwidthMbps(
      cameras,
      framesPerSecond,
      compression,
    )

  const secondsPerDay =
    86_400

  const totalMegabits =
    totalBitrateMbps *
    secondsPerDay *
    recordingDays *
    recordingMultiplier

  /*
   * Mbps -> bytes -> TB.
   */
  const totalTerabytes =
    totalMegabits /
    8 /
    1_000_000

  /*
   * Storage engineering
   * allowance.
   */
  const storageWithHeadroom =
    totalTerabytes *
    1.15

  return Number(
    storageWithHeadroom.toFixed(
      2,
    ),
  )
}

function buildCameraSchedule(
  cameras: Camera[],
): CameraSummaryItem[] {
  const schedule =
    new Map<
      string,
      CameraSummaryItem
    >()

  cameras.forEach(
    (camera) => {
      const product =
        findCameraProduct(
          camera,
        )

      const key =
        product?.id ??
        `unassigned-${normaliseText(
          camera.name,
        )}`

      const existing =
        schedule.get(
          key,
        )

      if (
        existing
      ) {
        existing.quantity +=
          1

        existing.totalPrice =
          existing.quantity *
          existing.unitPrice

        return
      }

      schedule.set(
        key,
        {
          productId:
            product?.id ??
            camera.productId ??
            null,

          manufacturer:
            product?.manufacturer ??
            camera.manufacturer ??
            'Unassigned',

          model:
            product?.model ??
            camera.model ??
            camera.name,

          quantity:
            1,

          resolutionMP:
            product?.resolutionMP ??
            camera.resolutionMP ??
            0,

          irRange:
            product?.irRange ??
            camera.irRange ??
            0,

          power:
            product?.power ??
            camera.power ??
            0,

          unitPrice:
            product?.price ??
            camera.unitPrice ??
            0,

          totalPrice:
            product?.price ??
            camera.unitPrice ??
            0,
        },
      )
    },
  )

  return Array.from(
    schedule.values(),
  ).sort(
    (
      first,
      second,
    ) => {
      const manufacturerComparison =
        first.manufacturer.localeCompare(
          second.manufacturer,
        )

      if (
        manufacturerComparison !==
        0
      ) {
        return manufacturerComparison
      }

      return first.model.localeCompare(
        second.model,
      )
    },
  )
}

export function calculateProjectSummary({
  walls,
  cameras,

  recordingDays =
    DEFAULT_RECORDING_DAYS,

  framesPerSecond =
    DEFAULT_FRAMES_PER_SECOND,

  compression =
    'H.265',

  continuousRecording =
    true,
}: CalculateProjectSummaryInput): ProjectSummary {
  const products =
    cameras.map(
      (camera) =>
        findCameraProduct(
          camera,
        ),
    )

  const assignedProducts =
    products.filter(
      (
        product,
      ): product is CameraProduct =>
        product !==
        null,
    )

  const totalCameraCost =
    cameras.reduce(
      (
        total,
        camera,
        index,
      ) => {
        const product =
          products[index]

        return (
          total +
          (
            product?.price ??
            camera.unitPrice ??
            0
          )
        )
      },
      0,
    )

  const totalCameraPower =
    cameras.reduce(
      (
        total,
        camera,
        index,
      ) => {
        const product =
          products[index]

        return (
          total +
          (
            product?.power ??
            camera.power ??
            0
          )
        )
      },
      0,
    )

  const totalResolution =
    cameras.reduce(
      (
        total,
        camera,
        index,
      ) => {
        const product =
          products[index]

        return (
          total +
          (
            product
              ?.resolutionMP ??
            camera.resolutionMP ??
            0
          )
        )
      },
      0,
    )

  const totalIRRange =
    cameras.reduce(
      (
        total,
        camera,
        index,
      ) => {
        const product =
          products[index]

        return (
          total +
          (
            product?.irRange ??
            camera.irRange ??
            0
          )
        )
      },
      0,
    )

  const assignedCameraCount =
    assignedProducts.length

  const averageResolutionMP =
    assignedCameraCount >
    0
      ? totalResolution /
        assignedCameraCount
      : 0

  const averageIRRange =
    assignedCameraCount >
    0
      ? totalIRRange /
        assignedCameraCount
      : 0

  const estimatedBandwidthMbps =
    estimateProjectBandwidthMbps(
      cameras,
      framesPerSecond,
      compression,
    )

  /*
   * Keep NVR bandwidth away
   * from its absolute limit.
   */
  const recommendedNVRBandwidthMbps =
    Number(
      (
        estimatedBandwidthMbps *
        1.25
      ).toFixed(
        2,
      ),
    )

  return {
    wallCount:
      walls.length,

    cameraCount:
      cameras.length,

    assignedCameraCount,

    unassignedCameraCount:
      cameras.length -
      assignedCameraCount,

    totalCameraCost:
      Number(
        totalCameraCost.toFixed(
          2,
        ),
      ),

    totalCameraPower:
      Number(
        totalCameraPower.toFixed(
          1,
        ),
      ),

    averageResolutionMP:
      Number(
        averageResolutionMP.toFixed(
          1,
        ),
      ),

    averageIRRange:
      Number(
        averageIRRange.toFixed(
          1,
        ),
      ),

    estimatedBandwidthMbps,

    recommendedNVRBandwidthMbps,

    recommendedNVRChannels:
      recommendNVRChannels(
        cameras.length,
      ),

    recommendedPoESwitchPorts:
      recommendPoESwitchPorts(
        cameras.length,
      ),

    recommendedPoEPowerBudget:
      recommendPoEPowerBudget(
        totalCameraPower,
      ),

    estimatedStorageTB:
      estimateStorageTB(
        cameras,
        recordingDays,
        framesPerSecond,
        compression,
        continuousRecording,
      ),

    cameraSchedule:
      buildCameraSchedule(
        cameras,
      ),
  }
}

export function formatZAR(
  value: number,
): string {
  return new Intl.NumberFormat(
    'en-ZA',
    {
      style:
        'currency',

      currency:
        'ZAR',

      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2,
    },
  ).format(
    value,
  )
}
