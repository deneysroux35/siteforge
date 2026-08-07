import { create } from 'zustand'

import {
  blankFactorSheetProfile,
  defaultFinanceProfile,
  type FinanceProfile,
} from '../services/financeEngine'

interface FinanceState {
  profiles:
    FinanceProfile[]

  selectedProfileId:
    string

  addProfile: (
    profile:
      FinanceProfile,
  ) => void

  updateProfile: (
    id: string,
    changes:
      Partial<FinanceProfile>,
  ) => void

  deleteProfile: (
    id: string,
  ) => void

  selectProfile: (
    id: string,
  ) => void

  resetProfiles: () => void
}

const seedProfiles:
  FinanceProfile[] = [
    defaultFinanceProfile,

    {
      id:
        'rental-flex',

      name:
        'Rental Flex',

      calculationMode:
        'calculated',

      annualInterestRate:
        13.5,

      depositPercentage:
        0,

      residualPercentage:
        10,

      onceOffFee:
        950,

      monthlyInsurancePercentage:
        0,

      monthlyMaintenanceAmount:
        0,

      annualEscalationPercentage:
        8,

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
    },

    {
      id:
        'business-lease',

      name:
        'Business Lease',

      calculationMode:
        'calculated',

      annualInterestRate:
        11.75,

      depositPercentage:
        10,

      residualPercentage:
        0,

      onceOffFee:
        650,

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
    },

    blankFactorSheetProfile,
  ]

function cloneProfile(
  profile:
    FinanceProfile,
): FinanceProfile {
  return {
    ...profile,

    factors: {
      ...profile.factors,
    },
  }
}

export const useFinanceStore =
  create<FinanceState>(
    (set) => ({
      profiles:
        seedProfiles.map(
          cloneProfile,
        ),

      selectedProfileId:
        defaultFinanceProfile.id,

      addProfile: (
        profile,
      ): void =>
        set((state) => ({
          profiles: [
            ...state.profiles,

            cloneProfile(
              profile,
            ),
          ],
        })),

      updateProfile: (
        id,
        changes,
      ): void =>
        set((state) => ({
          profiles:
            state.profiles.map(
              (profile) => {
                if (
                  profile.id !==
                  id
                ) {
                  return profile
                }

                return {
                  ...profile,
                  ...changes,

                  factors:
                    changes.factors
                      ? {
                          ...changes.factors,
                        }
                      : {
                          ...profile.factors,
                        },
                }
              },
            ),
        })),

      deleteProfile: (
        id,
      ): void =>
        set((state) => {
          const remaining =
            state.profiles.filter(
              (profile) =>
                profile.id !==
                id,
            )

          const selectedProfileId =
            state.selectedProfileId ===
            id
              ? (
                  remaining[
                    0
                  ]?.id ??
                  ''
                )
              : state.selectedProfileId

          return {
            profiles:
              remaining,

            selectedProfileId,
          }
        }),

      selectProfile: (
        id,
      ): void =>
        set((state) => {
          const exists =
            state.profiles.some(
              (profile) =>
                profile.id ===
                id,
            )

          if (!exists) {
            return state
          }

          return {
            selectedProfileId:
              id,
          }
        }),

      resetProfiles:
        (): void =>
          set({
            profiles:
              seedProfiles.map(
                cloneProfile,
              ),

            selectedProfileId:
              defaultFinanceProfile.id,
          }),
    }),
  )
  