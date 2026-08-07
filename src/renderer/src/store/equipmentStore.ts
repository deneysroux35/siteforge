import { create } from 'zustand'

export interface EquipmentItem {
  id: string
  sku: string
  description: string
  category:
    | 'camera'
    | 'nvr'
    | 'switch'
    | 'cable'
    | 'accessory'

  quantity: number

  unitCost: number
}

interface EquipmentState {
  items: EquipmentItem[]

  setItems: (
    items: EquipmentItem[],
  ) => void

  clear: () => void

  totalCost: () => number
}

export const useEquipmentStore =
  create<EquipmentState>((set, get) => ({
    items: [],

    setItems: (items) =>
      set({
        items,
      }),

    clear: () =>
      set({
        items: [],
      }),

    totalCost: () =>
      get().items.reduce(
        (total, item) =>
          total +
          item.quantity *
            item.unitCost,
        0,
      ),
  }))
  