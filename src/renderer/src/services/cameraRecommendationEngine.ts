import type { CameraProduct } from '../data/productTypes'

import { dahua } from '../data/cameras/dahua'

export interface CameraRecommendation {
  product: CameraProduct | null
  confidence: number
  reason: string
}

export interface RecommendationInput {
  requiredDistance: number
  indoor: boolean
  nightVision: boolean
}

export function recommendCamera(
  input: RecommendationInput,
): CameraRecommendation {
  const candidates = dahua.filter(
    (camera) =>
      camera.maxDistance >= input.requiredDistance,
  )

  if (candidates.length === 0) {
    return {
      product: null,
      confidence: 0,
      reason:
        'No camera in the current catalogue can satisfy the required distance.',
    }
  }

  /*
   * Sort by lowest price first.
   * Version 2 will score cameras using:
   * - DORI
   * - FoV
   * - Lens
   * - IR
   * - AI Features
   */
  const sorted = [...candidates].sort(
    (a, b) => a.price - b.price,
  )

  const selected = sorted[0]

  if (!selected) {
    return {
      product: null,
      confidence: 0,
      reason:
        'No suitable camera could be selected.',
    }
  }

  let confidence = 90

  if (
    selected.irRange >=
    input.requiredDistance
  ) {
    confidence += 5
  }

  if (
    input.nightVision &&
    selected.irRange >=
      input.requiredDistance
  ) {
    confidence += 3
  }

  if (input.indoor) {
    confidence += 2
  }

  confidence = Math.min(
    confidence,
    100,
  )

  return {
    product: selected,

    confidence,

    reason: `Recommended because the ${selected.manufacturer} ${selected.model} supports the required ${input.requiredDistance} m viewing distance while offering the lowest equipment cost from the current catalogue.`,
  }
}
