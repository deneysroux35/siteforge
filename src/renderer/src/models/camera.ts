import type { Point } from './geometry'

export interface Camera {
  id: string

  name: string

  position: Point

  rotation: number

  fieldOfView: number

  range: number

  selected: boolean

  /*
   * Product catalogue identity.
   */
  productId?: string

  manufacturer?: string

  model?: string

  /*
   * Camera technical specifications.
   */
  resolutionMP?: number

  lens?: number

  irRange?: number

  /*
   * PoE power consumption in watts.
   * Rack Intelligence uses this value
   * when calculating switch load.
   */
  power?: number

  /*
   * Selling price of the selected
   * catalogue camera.
   */
  unitPrice?: number

  /*
   * Rack / cabinet / NVR serving
   * this camera.
   */
  assignedHubId: string | null
}
