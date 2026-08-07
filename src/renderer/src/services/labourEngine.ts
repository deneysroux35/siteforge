export interface LabourLine {
  id: string

  role: string

  quantity: number

  days: number

  hoursPerDay: number

  hourlyRate: number
}

export interface LabourLineResult
  extends LabourLine {
  totalHours: number

  totalCost: number
}

export interface LabourSummary {
  lines: LabourLineResult[]

  totalPeople: number

  totalHours: number

  totalCost: number
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

export function calculateLabourLine(
  line: LabourLine,
): LabourLineResult {
  const quantity =
    Math.max(
      0,
      line.quantity,
    )

  const days =
    Math.max(
      0,
      line.days,
    )

  const hoursPerDay =
    Math.max(
      0,
      line.hoursPerDay,
    )

  const hourlyRate =
    Math.max(
      0,
      line.hourlyRate,
    )

  const totalHours =
    quantity *
    days *
    hoursPerDay

  const totalCost =
    roundMoney(
      totalHours *
      hourlyRate,
    )

  return {
    ...line,

    quantity,

    days,

    hoursPerDay,

    hourlyRate,

    totalHours,

    totalCost,
  }
}

export function calculateLabourSummary(
  lines: LabourLine[],
): LabourSummary {
  const calculated =
    lines.map(
      calculateLabourLine,
    )

  const totalPeople =
    calculated.reduce(
      (
        total,
        line,
      ) =>
        total +
        line.quantity,
      0,
    )

  const totalHours =
    calculated.reduce(
      (
        total,
        line,
      ) =>
        total +
        line.totalHours,
      0,
    )

  const totalCost =
    roundMoney(
      calculated.reduce(
        (
          total,
          line,
        ) =>
          total +
          line.totalCost,
        0,
      ),
    )

  return {
    lines:
      calculated,

    totalPeople,

    totalHours,

    totalCost,
  }
}