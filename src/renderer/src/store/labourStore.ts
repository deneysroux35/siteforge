import { create } from 'zustand'

import type {
  LabourLine,
} from '../services/labourEngine'

interface LabourState {
  lines: LabourLine[]

  addLine: () => void

  updateLine: (
    id: string,
    changes: Partial<LabourLine>,
  ) => void

  removeLine: (
    id: string,
  ) => void

  clearLines: () => void

  resetDefaults: () => void
}

function createId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `labour-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`
}

function createDefaultLines(): LabourLine[] {
  return [
    {
      id: createId(),
      role: 'Installation Technician',
      quantity: 1,
      days: 1,
      hoursPerDay: 8,
      hourlyRate: 300,
    },

    {
      id: createId(),
      role: 'Senior Technician',
      quantity: 0,
      days: 1,
      hoursPerDay: 8,
      hourlyRate: 425,
    },

    {
      id: createId(),
      role: 'Project Manager',
      quantity: 0,
      days: 1,
      hoursPerDay: 8,
      hourlyRate: 650,
    },
  ]
}

export const useLabourStore =
  create<LabourState>((set) => ({
    lines: createDefaultLines(),

    addLine: (): void =>
      set((state) => ({
        lines: [
          ...state.lines,
          {
            id: createId(),
            role: 'Technician',
            quantity: 1,
            days: 1,
            hoursPerDay: 8,
            hourlyRate: 300,
          },
        ],
      })),

    updateLine: (
      id,
      changes,
    ): void =>
      set((state) => ({
        lines: state.lines.map(
          (line) =>
            line.id === id
              ? {
                  ...line,
                  ...changes,
                }
              : line,
        ),
      })),

    removeLine: (
      id,
    ): void =>
      set((state) => ({
        lines: state.lines.filter(
          (line) =>
            line.id !== id,
        ),
      })),

    clearLines: (): void =>
      set({
        lines: [],
      }),

    resetDefaults: (): void =>
      set({
        lines: createDefaultLines(),
      }),
  }))
  