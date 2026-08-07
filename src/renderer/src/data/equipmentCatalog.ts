export type EquipmentCategory =
  | 'nvr'
  | 'poe-switch'
  | 'storage'
  | 'cable'
  | 'accessory'
  | 'power'

export interface BaseEquipmentProduct {
  id: string
  category: EquipmentCategory

  manufacturer: string
  model: string
  description: string

  sku: string

  costPrice: number
  sellPrice: number

  active: boolean
}

export interface NvrProduct
  extends BaseEquipmentProduct {
  category: 'nvr'

  channels: number
  maxResolutionMP: number

  poePorts: number

  sataBays: number
  maxStorageTB: number

  incomingBandwidthMbps: number

  power: number
}

export interface PoeSwitchProduct
  extends BaseEquipmentProduct {
  category: 'poe-switch'

  totalPorts: number
  poePorts: number

  poeBudgetWatts: number

  uplinkPorts: number

  managed: boolean
}

export interface StorageProduct
  extends BaseEquipmentProduct {
  category: 'storage'

  capacityTB: number

  driveType:
    | 'Surveillance'
    | 'Enterprise'

  interface:
    | 'SATA'
    | 'SAS'
}

export interface CableProduct
  extends BaseEquipmentProduct {
  category: 'cable'

  cableType:
    | 'CAT5e'
    | 'CAT6'
    | 'CAT6A'
    | 'Fiber'

  lengthMeters: number

  outdoorRated: boolean
  shielded: boolean
}

export interface AccessoryProduct
  extends BaseEquipmentProduct {
  category: 'accessory'

  accessoryType:
    | 'Junction Box'
    | 'RJ45'
    | 'Patch Lead'
    | 'Bracket'
    | 'Conduit'
    | 'Cabinet'
    | 'Patch Panel'
    | 'Other'

  unit:
    | 'each'
    | 'meter'
    | 'box'
}

export interface PowerProduct
  extends BaseEquipmentProduct {
  category: 'power'

  powerType:
    | 'UPS'
    | 'Power Supply'

  capacityVA: number
  capacityWatts: number
}

export type EquipmentProduct =
  | NvrProduct
  | PoeSwitchProduct
  | StorageProduct
  | CableProduct
  | AccessoryProduct
  | PowerProduct

export const equipmentCatalog: EquipmentProduct[] = [
  {
    id: 'nvr-8ch-standard',

    category: 'nvr',

    manufacturer: 'Generic',
    model: 'NVR-8CH',

    description:
      '8 Channel Network Video Recorder',

    sku: 'NVR-8CH',

    costPrice: 3200,
    sellPrice: 4495,

    active: true,

    channels: 8,

    maxResolutionMP: 8,

    poePorts: 8,

    sataBays: 1,

    maxStorageTB: 10,

    incomingBandwidthMbps: 80,

    power: 15,
  },

  {
    id: 'nvr-16ch-standard',

    category: 'nvr',

    manufacturer: 'Generic',
    model: 'NVR-16CH',

    description:
      '16 Channel Network Video Recorder',

    sku: 'NVR-16CH',

    costPrice: 5200,
    sellPrice: 6995,

    active: true,

    channels: 16,

    maxResolutionMP: 12,

    poePorts: 16,

    sataBays: 2,

    maxStorageTB: 20,

    incomingBandwidthMbps: 160,

    power: 25,
  },

  {
    id: 'nvr-32ch-standard',

    category: 'nvr',

    manufacturer: 'Generic',
    model: 'NVR-32CH',

    description:
      '32 Channel Network Video Recorder',

    sku: 'NVR-32CH',

    costPrice: 8900,
    sellPrice: 11995,

    active: true,

    channels: 32,

    maxResolutionMP: 12,

    poePorts: 0,

    sataBays: 4,

    maxStorageTB: 40,

    incomingBandwidthMbps: 320,

    power: 45,
  },

  {
    id: 'switch-poe-8',

    category: 'poe-switch',

    manufacturer: 'Generic',
    model: 'POE-SW-8',

    description:
      '8 Port Gigabit PoE Switch',

    sku: 'POE-SW-8',

    costPrice: 1450,
    sellPrice: 2195,

    active: true,

    totalPorts: 10,

    poePorts: 8,

    poeBudgetWatts: 120,

    uplinkPorts: 2,

    managed: false,
  },

  {
    id: 'switch-poe-16',

    category: 'poe-switch',

    manufacturer: 'Generic',
    model: 'POE-SW-16',

    description:
      '16 Port Gigabit PoE Switch',

    sku: 'POE-SW-16',

    costPrice: 2800,
    sellPrice: 3995,

    active: true,

    totalPorts: 18,

    poePorts: 16,

    poeBudgetWatts: 250,

    uplinkPorts: 2,

    managed: true,
  },

  {
    id: 'switch-poe-24',

    category: 'poe-switch',

    manufacturer: 'Generic',
    model: 'POE-SW-24',

    description:
      '24 Port Managed Gigabit PoE Switch',

    sku: 'POE-SW-24',

    costPrice: 4800,
    sellPrice: 6495,

    active: true,

    totalPorts: 26,

    poePorts: 24,

    poeBudgetWatts: 370,

    uplinkPorts: 2,

    managed: true,
  },

  {
    id: 'hdd-surveillance-4tb',

    category: 'storage',

    manufacturer: 'Generic',
    model: 'SURV-4TB',

    description:
      '4TB Surveillance Hard Drive',

    sku: 'HDD-SURV-4TB',

    costPrice: 1650,
    sellPrice: 2295,

    active: true,

    capacityTB: 4,

    driveType: 'Surveillance',

    interface: 'SATA',
  },

  {
    id: 'hdd-surveillance-8tb',

    category: 'storage',

    manufacturer: 'Generic',
    model: 'SURV-8TB',

    description:
      '8TB Surveillance Hard Drive',

    sku: 'HDD-SURV-8TB',

    costPrice: 2950,
    sellPrice: 3995,

    active: true,

    capacityTB: 8,

    driveType: 'Surveillance',

    interface: 'SATA',
  },

  {
    id: 'hdd-surveillance-10tb',

    category: 'storage',

    manufacturer: 'Generic',
    model: 'SURV-10TB',

    description:
      '10TB Surveillance Hard Drive',

    sku: 'HDD-SURV-10TB',

    costPrice: 3650,
    sellPrice: 4895,

    active: true,

    capacityTB: 10,

    driveType: 'Surveillance',

    interface: 'SATA',
  },

  {
    id: 'cat6-indoor-305',

    category: 'cable',

    manufacturer: 'Generic',
    model: 'CAT6-305-IN',

    description:
      'CAT6 UTP Indoor Cable 305m',

    sku: 'CAT6-305-IN',

    costPrice: 1850,
    sellPrice: 2695,

    active: true,

    cableType: 'CAT6',

    lengthMeters: 305,

    outdoorRated: false,

    shielded: false,
  },

  {
    id: 'cat6-outdoor-305',

    category: 'cable',

    manufacturer: 'Generic',
    model: 'CAT6-305-OUT',

    description:
      'CAT6 Outdoor Cable 305m',

    sku: 'CAT6-305-OUT',

    costPrice: 2350,
    sellPrice: 3295,

    active: true,

    cableType: 'CAT6',

    lengthMeters: 305,

    outdoorRated: true,

    shielded: false,
  },

  {
    id: 'accessory-junction-box',

    category: 'accessory',

    manufacturer: 'Generic',
    model: 'CAM-JBOX',

    description:
      'Camera Junction Box',

    sku: 'CAM-JBOX',

    costPrice: 120,
    sellPrice: 195,

    active: true,

    accessoryType:
      'Junction Box',

    unit: 'each',
  },

  {
    id: 'accessory-rj45',

    category: 'accessory',

    manufacturer: 'Generic',
    model: 'RJ45-CAT6',

    description:
      'CAT6 RJ45 Connector',

    sku: 'RJ45-CAT6',

    costPrice: 5,
    sellPrice: 12,

    active: true,

    accessoryType: 'RJ45',

    unit: 'each',
  },

  {
    id: 'accessory-conduit-25',

    category: 'accessory',

    manufacturer: 'Generic',
    model: 'PVC-25MM',

    description:
      '25mm PVC Conduit',

    sku: 'PVC-25MM',

    costPrice: 18,
    sellPrice: 32,

    active: true,

    accessoryType: 'Conduit',

    unit: 'meter',
  },

  {
    id: 'ups-1000va',

    category: 'power',

    manufacturer: 'Generic',
    model: 'UPS-1000VA',

    description:
      '1000VA Uninterruptible Power Supply',

    sku: 'UPS-1000VA',

    costPrice: 1450,
    sellPrice: 2195,

    active: true,

    powerType: 'UPS',

    capacityVA: 1000,

    capacityWatts: 600,
  },

  {
    id: 'ups-2000va',

    category: 'power',

    manufacturer: 'Generic',
    model: 'UPS-2000VA',

    description:
      '2000VA Uninterruptible Power Supply',

    sku: 'UPS-2000VA',

    costPrice: 2950,
    sellPrice: 4195,

    active: true,

    powerType: 'UPS',

    capacityVA: 2000,

    capacityWatts: 1200,
  },
]

export function getEquipmentById(
  id: string,
): EquipmentProduct | undefined {
  return equipmentCatalog.find(
    (product) =>
      product.id === id,
  )
}

export function getEquipmentByCategory(
  category: EquipmentCategory,
): EquipmentProduct[] {
  return equipmentCatalog.filter(
    (product) =>
      product.category ===
        category &&
      product.active,
  )
}

export function getNvrProducts(): NvrProduct[] {
  return equipmentCatalog.filter(
    (
      product,
    ): product is NvrProduct =>
      product.category ===
        'nvr' &&
      product.active,
  )
}

export function getPoeSwitchProducts(): PoeSwitchProduct[] {
  return equipmentCatalog.filter(
    (
      product,
    ): product is PoeSwitchProduct =>
      product.category ===
        'poe-switch' &&
      product.active,
  )
}

export function getStorageProducts(): StorageProduct[] {
  return equipmentCatalog.filter(
    (
      product,
    ): product is StorageProduct =>
      product.category ===
        'storage' &&
      product.active,
  )
}

export function getCableProducts(): CableProduct[] {
  return equipmentCatalog.filter(
    (
      product,
    ): product is CableProduct =>
      product.category ===
        'cable' &&
      product.active,
  )
}
