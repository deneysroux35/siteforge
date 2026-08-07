import { create } from "zustand";

interface QuoteState {
  labourCost: number;

  travelCost: number;

  consumablesCost: number;

  contingencyCost: number;

  markupPercentage: number;

  vatPercentage: number;

  setLabourCost(
    value: number,
  ): void;

  setTravelCost(
    value: number,
  ): void;

  setConsumablesCost(
    value: number,
  ): void;

  setContingencyCost(
    value: number,
  ): void;

  setMarkupPercentage(
    value: number,
  ): void;

  setVatPercentage(
    value: number,
  ): void;
}

export const useQuoteStore =
  create<QuoteState>(
    (set) => ({
      labourCost: 0,

      travelCost: 0,

      consumablesCost: 0,

      contingencyCost: 0,

      markupPercentage: 30,

      vatPercentage: 15,

      setLabourCost: (
        labourCost,
      ) =>
        set({
          labourCost,
        }),

      setTravelCost: (
        travelCost,
      ) =>
        set({
          travelCost,
        }),

      setConsumablesCost: (
        consumablesCost,
      ) =>
        set({
          consumablesCost,
        }),

      setContingencyCost: (
        contingencyCost,
      ) =>
        set({
          contingencyCost,
        }),

      setMarkupPercentage: (
        markupPercentage,
      ) =>
        set({
          markupPercentage,
        }),

      setVatPercentage: (
        vatPercentage,
      ) =>
        set({
          vatPercentage,
        }),
    }),
  );
  