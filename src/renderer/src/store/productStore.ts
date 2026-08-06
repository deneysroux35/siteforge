import { create } from "zustand";

interface ProductState {
  cameraSearch: string;
  selectedManufacturer: string;

  setCameraSearch: (search: string) => void;

  setSelectedManufacturer: (
    manufacturer: string,
  ) => void;

  clearCameraFilters: () => void;
}

export const useProductStore =
  create<ProductState>((set) => ({
    cameraSearch: "",
    selectedManufacturer: "All",

    setCameraSearch: (cameraSearch) =>
      set({
        cameraSearch,
      }),

    setSelectedManufacturer: (
      selectedManufacturer,
    ) =>
      set({
        selectedManufacturer,
      }),

    clearCameraFilters: () =>
      set({
        cameraSearch: "",
        selectedManufacturer: "All",
      }),
  }));
  