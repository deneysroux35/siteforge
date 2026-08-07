export type FinanceTermMonths =
  | 24
  | 36
  | 60

export type FinanceCalculationMode =
  | 'calculated'
  | 'factor-sheet'

export type FactorBasis =
  | 'multiplier'
  | 'per-1000'

export interface FinanceFactors {
  24: number
  36: number
  60: number
}

export interface FinanceProfile {
  id: string

  name: string

  calculationMode:
    FinanceCalculationMode

  /*
   * CALCULATED FINANCE
   */
  annualInterestRate: number

  depositPercentage: number

  residualPercentage: number

  onceOffFee: number

  monthlyInsurancePercentage: number

  monthlyMaintenanceAmount: number

  annualEscalationPercentage: number

  /*
   * VAT
   */
  vatPercentage: number

  vatIncludedInBaseAmount: boolean

  /*
   * FACTOR SHEET
   */
  factorBasis: FactorBasis

  factors: FinanceFactors

  factorIncludesVat: boolean
}

export interface FinanceCalculationInput {
  baseAmount: number

  termMonths:
    FinanceTermMonths

  profile:
    FinanceProfile
}

export interface FinanceCalculationResult {
  calculationMode:
    FinanceCalculationMode

  baseAmount: number

  termMonths:
    FinanceTermMonths

  factorUsed:
    number | null

  factorBasis:
    FactorBasis | null

  depositAmount: number

  financedAmount: number

  residualAmount: number

  onceOffFee: number

  monthlyFinanceAmount: number

  monthlyInsuranceAmount: number

  monthlyMaintenanceAmount: number

  firstYearMonthlyTotal: number

  totalEstimatedPayments: number

  totalEstimatedCost: number

  vatAmount: number

  valid: boolean

  warning:
    string | null
}

export interface FinanceComparison {
  cashPrice: number

  options:
    FinanceCalculationResult[]
}

function roundCurrency(
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

function clampPercentage(
  value: number,
): number {
  return Math.min(
    100,
    Math.max(
      0,
      value,
    ),
  )
}

function calculateVatAmount(
  baseAmount: number,
  vatPercentage: number,
  vatIncluded: boolean,
): number {
  if (
    vatPercentage <= 0 ||
    baseAmount <= 0
  ) {
    return 0
  }

  const vatRate =
    vatPercentage / 100

  if (vatIncluded) {
    return roundCurrency(
      baseAmount -
        baseAmount /
          (1 + vatRate),
    )
  }

  return roundCurrency(
    baseAmount *
      vatRate,
  )
}

function calculatePresentValuePayment(
  principal: number,
  residualAmount: number,
  annualInterestRate: number,
  termMonths: number,
): number {
  if (
    principal <= 0 ||
    termMonths <= 0
  ) {
    return 0
  }

  const monthlyRate =
    annualInterestRate /
    100 /
    12

  if (
    monthlyRate === 0
  ) {
    return roundCurrency(
      (
        principal -
        residualAmount
      ) /
        termMonths,
    )
  }

  const discountFactor =
    Math.pow(
      1 + monthlyRate,
      termMonths,
    )

  const presentValueOfResidual =
    residualAmount /
    discountFactor

  const amortisedPrincipal =
    principal -
    presentValueOfResidual

  const payment =
    amortisedPrincipal *
    (
      monthlyRate *
      discountFactor
    ) /
    (
      discountFactor -
      1
    )

  return roundCurrency(
    payment,
  )
}

function calculateEscalatedPayments(
  firstYearMonthlyAmount: number,
  termMonths: number,
  annualEscalationPercentage: number,
): number {
  if (
    termMonths <= 0 ||
    firstYearMonthlyAmount <= 0
  ) {
    return 0
  }

  const escalationRate =
    annualEscalationPercentage /
    100

  let totalPayments = 0

  for (
    let month = 0;
    month < termMonths;
    month += 1
  ) {
    const yearIndex =
      Math.floor(
        month / 12,
      )

    const escalatedAmount =
      firstYearMonthlyAmount *
      Math.pow(
        1 +
          escalationRate,
        yearIndex,
      )

    totalPayments +=
      escalatedAmount
  }

  return roundCurrency(
    totalPayments,
  )
}

function getFactor(
  profile: FinanceProfile,
  termMonths:
    FinanceTermMonths,
): number {
  return (
    profile.factors[
      termMonths
    ] ?? 0
  )
}

function calculateFactorPayment(
  financedAmount: number,
  factor: number,
  factorBasis: FactorBasis,
): number {
  if (
    financedAmount <= 0 ||
    factor <= 0
  ) {
    return 0
  }

  if (
    factorBasis ===
    'per-1000'
  ) {
    return roundCurrency(
      (
        financedAmount /
        1000
      ) *
        factor,
    )
  }

  return roundCurrency(
    financedAmount *
      factor,
  )
}

function calculateCalculatedOption(
  baseAmount: number,
  termMonths:
    FinanceTermMonths,
  profile:
    FinanceProfile,
): FinanceCalculationResult {
  const depositPercentage =
    clampPercentage(
      profile.depositPercentage,
    )

  const residualPercentage =
    clampPercentage(
      profile.residualPercentage,
    )

  const depositAmount =
    roundCurrency(
      baseAmount *
        (
          depositPercentage /
          100
        ),
    )

  const onceOffFee =
    roundCurrency(
      Math.max(
        0,
        profile.onceOffFee,
      ),
    )

  const financedAmount =
    roundCurrency(
      baseAmount -
        depositAmount +
        onceOffFee,
    )

  const residualAmount =
    roundCurrency(
      baseAmount *
        (
          residualPercentage /
          100
        ),
    )

  const monthlyFinanceAmount =
    calculatePresentValuePayment(
      financedAmount,
      residualAmount,
      Math.max(
        0,
        profile.annualInterestRate,
      ),
      termMonths,
    )

  const monthlyInsuranceAmount =
    roundCurrency(
      baseAmount *
        (
          Math.max(
            0,
            profile.monthlyInsurancePercentage,
          ) /
          100
        ),
    )

  const monthlyMaintenanceAmount =
    roundCurrency(
      Math.max(
        0,
        profile.monthlyMaintenanceAmount,
      ),
    )

  const firstYearMonthlyTotal =
    roundCurrency(
      monthlyFinanceAmount +
        monthlyInsuranceAmount +
        monthlyMaintenanceAmount,
    )

  const totalEstimatedPayments =
    calculateEscalatedPayments(
      firstYearMonthlyTotal,
      termMonths,
      Math.max(
        0,
        profile.annualEscalationPercentage,
      ),
    )

  const totalEstimatedCost =
    roundCurrency(
      depositAmount +
        totalEstimatedPayments +
        residualAmount,
    )

  const vatAmount =
    calculateVatAmount(
      baseAmount,
      Math.max(
        0,
        profile.vatPercentage,
      ),
      profile.vatIncludedInBaseAmount,
    )

  return {
    calculationMode:
      'calculated',

    baseAmount,

    termMonths,

    factorUsed:
      null,

    factorBasis:
      null,

    depositAmount,

    financedAmount,

    residualAmount,

    onceOffFee,

    monthlyFinanceAmount,

    monthlyInsuranceAmount,

    monthlyMaintenanceAmount,

    firstYearMonthlyTotal,

    totalEstimatedPayments,

    totalEstimatedCost,

    vatAmount,

    valid: true,

    warning:
      null,
  }
}

function calculateFactorSheetOption(
  baseAmount: number,
  termMonths:
    FinanceTermMonths,
  profile:
    FinanceProfile,
): FinanceCalculationResult {
  const factor =
    getFactor(
      profile,
      termMonths,
    )

  const depositPercentage =
    clampPercentage(
      profile.depositPercentage,
    )

  const depositAmount =
    roundCurrency(
      baseAmount *
        (
          depositPercentage /
          100
        ),
    )

  const onceOffFee =
    roundCurrency(
      Math.max(
        0,
        profile.onceOffFee,
      ),
    )

  const financedAmount =
    roundCurrency(
      baseAmount -
        depositAmount,
    )

  const residualAmount =
    roundCurrency(
      baseAmount *
        (
          clampPercentage(
            profile.residualPercentage,
          ) /
          100
        ),
    )

  const monthlyFinanceAmount =
    calculateFactorPayment(
      financedAmount,
      factor,
      profile.factorBasis,
    )

  const monthlyInsuranceAmount =
    roundCurrency(
      baseAmount *
        (
          Math.max(
            0,
            profile.monthlyInsurancePercentage,
          ) /
          100
        ),
    )

  const monthlyMaintenanceAmount =
    roundCurrency(
      Math.max(
        0,
        profile.monthlyMaintenanceAmount,
      ),
    )

  const firstYearMonthlyTotal =
    roundCurrency(
      monthlyFinanceAmount +
        monthlyInsuranceAmount +
        monthlyMaintenanceAmount,
    )

  const totalEstimatedPayments =
    factor > 0
      ? calculateEscalatedPayments(
          firstYearMonthlyTotal,
          termMonths,
          Math.max(
            0,
            profile.annualEscalationPercentage,
          ),
        )
      : 0

  const totalEstimatedCost =
    factor > 0
      ? roundCurrency(
          depositAmount +
            onceOffFee +
            totalEstimatedPayments +
            residualAmount,
        )
      : 0

  const vatAmount =
    calculateVatAmount(
      baseAmount,
      Math.max(
        0,
        profile.vatPercentage,
      ),
      profile.factorIncludesVat,
    )

  const valid =
    factor > 0

  return {
    calculationMode:
      'factor-sheet',

    baseAmount,

    termMonths,

    factorUsed:
      factor,

    factorBasis:
      profile.factorBasis,

    depositAmount,

    financedAmount,

    residualAmount,

    onceOffFee,

    monthlyFinanceAmount,

    monthlyInsuranceAmount,

    monthlyMaintenanceAmount,

    firstYearMonthlyTotal,

    totalEstimatedPayments,

    totalEstimatedCost,

    vatAmount,

    valid,

    warning:
      valid
        ? null
        : `No ${termMonths}-month factor has been entered for ${profile.name}.`,
  }
}

export function calculateFinanceOption({
  baseAmount,
  termMonths,
  profile,
}: FinanceCalculationInput): FinanceCalculationResult {
  const safeBaseAmount =
    Math.max(
      0,
      baseAmount,
    )

  if (
    profile.calculationMode ===
    'factor-sheet'
  ) {
    return calculateFactorSheetOption(
      safeBaseAmount,
      termMonths,
      profile,
    )
  }

  return calculateCalculatedOption(
    safeBaseAmount,
    termMonths,
    profile,
  )
}

export function calculateFinanceComparison(
  baseAmount: number,
  profile: FinanceProfile,
): FinanceComparison {
  const terms:
    FinanceTermMonths[] = [
      24,
      36,
      60,
    ]

  return {
    cashPrice:
      roundCurrency(
        Math.max(
          0,
          baseAmount,
        ),
      ),

    options:
      terms.map(
        (
          termMonths,
        ) =>
          calculateFinanceOption({
            baseAmount,
            termMonths,
            profile,
          }),
      ),
  }
}

export const defaultFinanceProfile:
  FinanceProfile = {
    id:
      'standard-rental',

    name:
      'Standard Rental',

    calculationMode:
      'calculated',

    annualInterestRate:
      12,

    depositPercentage:
      0,

    residualPercentage:
      0,

    onceOffFee:
      0,

    monthlyInsurancePercentage:
      0,

    monthlyMaintenanceAmount:
      0,

    annualEscalationPercentage:
      0,

    vatPercentage:
      15,

    vatIncludedInBaseAmount:
      true,

    factorBasis:
      'per-1000',

    factors: {
      24: 0,
      36: 0,
      60: 0,
    },

    factorIncludesVat:
      true,
  }

export const blankFactorSheetProfile:
  FinanceProfile = {
    id:
      'factor-sheet-template',

    name:
      'Factor Sheet Template',

    calculationMode:
      'factor-sheet',

    annualInterestRate:
      0,

    depositPercentage:
      0,

    residualPercentage:
      0,

    onceOffFee:
      0,

    monthlyInsurancePercentage:
      0,

    monthlyMaintenanceAmount:
      0,

    annualEscalationPercentage:
      0,

    vatPercentage:
      15,

    vatIncludedInBaseAmount:
      true,

    factorBasis:
      'per-1000',

    factors: {
      24: 0,
      36: 0,
      60: 0,
    },

    factorIncludesVat:
      true,
  }

export function formatFinanceCurrency(
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
  ).format(value)
}
