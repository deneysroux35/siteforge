import type {
  EquipmentProduct,
} from '../data/equipmentCatalog'

import type {
  Camera,
} from '../components/designer/types'

import type {
  SmartEquipmentRecommendation,
} from './equipmentEngine'

export type BomCategory =
  | 'camera'
  | 'recorder'
  | 'network'
  | 'storage'
  | 'power'
  | 'cable'
  | 'accessory'

export interface BomLineItem {
  id: string

  category:
    BomCategory

  sku: string

  description: string

  quantity: number

  unit:
    | 'each'
    | 'meter'
    | 'box'

  unitCost: number

  unitSell: number

  totalCost: number

  totalSell: number

  source:
    | 'camera'
    | 'smart-equipment'
    | 'estimate'

  productId:
    string | null
}

export interface BomSummary {
  items:
    BomLineItem[]

  totalCost:
    number

  totalSell:
    number

  grossProfit:
    number

  grossMarginPercentage:
    number

  cameraCount:
    number

  cableMeters:
    number

  accessoryCount:
    number
}

interface BuildBomInput {
  cameras:
    Camera[]

  smartEquipment:
    SmartEquipmentRecommendation

  estimatedCableMeters?:
    number
}

function roundMoney(
  value: number,
): number {
  return (
    Math.round(
      (
        value +
        Number.EPSILON
      ) *
        100,
    ) / 100
  )
}

function createLineItem(
  input: {
    id: string

    category:
      BomCategory

    sku: string

    description:
      string

    quantity:
      number

    unit:
      | 'each'
      | 'meter'
      | 'box'

    unitCost:
      number

    unitSell:
      number

    source:
      BomLineItem['source']

    productId:
      string | null
  },
): BomLineItem {
  const safeQuantity =
    Math.max(
      0,
      input.quantity,
    )

  return {
    ...input,

    quantity:
      safeQuantity,

    totalCost:
      roundMoney(
        safeQuantity *
          input.unitCost,
      ),

    totalSell:
      roundMoney(
        safeQuantity *
          input.unitSell,
      ),
  }
}

function addProductLine(
  items:
    BomLineItem[],

  product:
    EquipmentProduct,

  quantity:
    number,

  category:
    BomCategory,
): void {
  items.push(
    createLineItem({
      id:
        `product-${product.id}`,

      category,

      sku:
        product.sku,

      description:
        product.description,

      quantity,

      unit:
        'each',

      unitCost:
        product.costPrice,

      unitSell:
        product.sellPrice,

      source:
        'smart-equipment',

      productId:
        product.id,
    }),
  )
}

function buildCameraLines(
  cameras:
    Camera[],
): BomLineItem[] {
  /*
   * For now we group cameras by
   * their current displayed name.
   *
   * Later, when every camera stores
   * a catalog productId, this will
   * group by actual product SKU.
   */
  const grouped =
    new Map<
      string,
      number
    >()

  for (
    const camera of cameras
  ) {
    const key =
      camera.name?.trim() ||
      'IP Camera'

    grouped.set(
      key,
      (
        grouped.get(
          key,
        ) ?? 0
      ) + 1,
    )
  }

  const items:
    BomLineItem[] = []

  for (
    const [
      name,
      quantity,
    ] of grouped
  ) {
    items.push(
      createLineItem({
        id:
          `camera-${name}`,

        category:
          'camera',

        sku:
          'CAMERA',

        description:
          name,

        quantity,

        unit:
          'each',

        unitCost:
          0,

        unitSell:
          0,

        source:
          'camera',

        productId:
          null,
      }),
    )
  }

  return items
}

function buildEstimatedAccessoryLines(
  cameraCount:
    number,

  estimatedCableMeters:
    number,
): BomLineItem[] {
  if (
    cameraCount === 0
  ) {
    return []
  }

  const items:
    BomLineItem[] = []

  /*
   * One junction box per camera.
   */
  items.push(
    createLineItem({
      id:
        'estimated-junction-boxes',

      category:
        'accessory',

      sku:
        'CAM-JBOX',

      description:
        'Camera Junction Box',

      quantity:
        cameraCount,

      unit:
        'each',

      unitCost:
        120,

      unitSell:
        195,

      source:
        'estimate',

      productId:
        null,
    }),
  )

  /*
   * Two RJ45s per camera.
   */
  items.push(
    createLineItem({
      id:
        'estimated-rj45',

      category:
        'accessory',

      sku:
        'RJ45-CAT6',

      description:
        'CAT6 RJ45 Connector',

      quantity:
        cameraCount * 2,

      unit:
        'each',

      unitCost:
        5,

      unitSell:
        12,

      source:
        'estimate',

      productId:
        null,
    }),
  )

  if (
    estimatedCableMeters >
    0
  ) {
    const cableBoxes =
      Math.ceil(
        estimatedCableMeters /
          305,
      )

    items.push(
      createLineItem({
        id:
          'estimated-cat6',

        category:
          'cable',

        sku:
          'CAT6-305-IN',

        description:
          'CAT6 UTP Indoor Cable 305m',

        quantity:
          cableBoxes,

        unit:
          'box',

        unitCost:
          1850,

        unitSell:
          2695,

        source:
          'estimate',

        productId:
          null,
      }),
    )
  }

  return items
}

export function buildProjectBom({
  cameras,
  smartEquipment,
  estimatedCableMeters = 0,
}: BuildBomInput): BomSummary {
  const items:
    BomLineItem[] = []

  items.push(
    ...buildCameraLines(
      cameras,
    ),
  )

  if (
    smartEquipment.nvr
  ) {
    addProductLine(
      items,
      smartEquipment.nvr,
      1,
      'recorder',
    )
  }

  if (
    smartEquipment.poeSwitch
  ) {
    addProductLine(
      items,
      smartEquipment.poeSwitch,
      1,
      'network',
    )
  }

  if (
    smartEquipment.storage.drive &&
    smartEquipment.storage.quantity >
      0
  ) {
    addProductLine(
      items,
      smartEquipment.storage.drive,
      smartEquipment.storage.quantity,
      'storage',
    )
  }

  if (
    smartEquipment.ups
  ) {
    addProductLine(
      items,
      smartEquipment.ups,
      1,
      'power',
    )
  }

  items.push(
    ...buildEstimatedAccessoryLines(
      cameras.length,
      estimatedCableMeters,
    ),
  )

  const totalCost =
    roundMoney(
      items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.totalCost,
        0,
      ),
    )

  const totalSell =
    roundMoney(
      items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.totalSell,
        0,
      ),
    )

  const grossProfit =
    roundMoney(
      totalSell -
      totalCost,
    )

  const grossMarginPercentage =
    totalSell > 0
      ? roundMoney(
          (
            grossProfit /
            totalSell
          ) *
            100,
        )
      : 0

  const accessoryCount =
    items
      .filter(
        (item) =>
          item.category ===
          'accessory',
      )
      .reduce(
        (
          total,
          item,
        ) =>
          total +
          item.quantity,
        0,
      )

  return {
    items,

    totalCost,

    totalSell,

    grossProfit,

    grossMarginPercentage,

    cameraCount:
      cameras.length,

    cableMeters:
      Math.max(
        0,
        estimatedCableMeters,
      ),

    accessoryCount,
  }
}
