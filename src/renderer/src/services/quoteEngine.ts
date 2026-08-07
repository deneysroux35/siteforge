export interface QuoteSummary {
  equipmentCost: number
  labourCost: number
  travelCost: number
  consumablesCost: number
  contingencyCost: number

  subtotalCost: number

  markupPercentage: number

  sellingPrice: number

  grossProfit: number

  grossMargin: number

  vatAmount: number

  grandTotal: number
}

export interface QuoteInput {
  equipmentCost: number

  labourCost: number

  travelCost: number

  consumablesCost: number

  contingencyCost: number

  markupPercentage: number

  vatPercentage: number
}

function round(
  value: number,
): number {
  return (
    Math.round(
      (value + Number.EPSILON) * 100,
    ) / 100
  )
}

export function calculateQuote(
  input: QuoteInput,
): QuoteSummary {
  const subtotalCost =
    input.equipmentCost +
    input.labourCost +
    input.travelCost +
    input.consumablesCost +
    input.contingencyCost

  const sellingPrice =
    subtotalCost *
    (1 + input.markupPercentage / 100)

  const grossProfit =
    sellingPrice -
    subtotalCost

  const grossMargin =
    sellingPrice === 0
      ? 0
      : (grossProfit /
          sellingPrice) *
        100

  const vatAmount =
    sellingPrice *
    (input.vatPercentage / 100)

  return {
    equipmentCost: round(
      input.equipmentCost,
    ),

    labourCost: round(
      input.labourCost,
    ),

    travelCost: round(
      input.travelCost,
    ),

    consumablesCost: round(
      input.consumablesCost,
    ),

    contingencyCost: round(
      input.contingencyCost,
    ),

    subtotalCost: round(
      subtotalCost,
    ),

    markupPercentage:
      input.markupPercentage,

    sellingPrice: round(
      sellingPrice,
    ),

    grossProfit: round(
      grossProfit,
    ),

    grossMargin: round(
      grossMargin,
    ),

    vatAmount: round(
      vatAmount,
    ),

    grandTotal: round(
      sellingPrice +
        vatAmount,
    ),
  }
}
