import { create } from "zustand";
import type {
  Point,
  Tool,
  Wall,
} from "../components/designer/types";

interface DesignerState {
  tool: Tool;

  zoom: number;
  offsetX: number;
  offsetY: number;

  isPanning: boolean;

  walls: Wall[];
  wallStart: Point | null;

  setTool: (tool: Tool) => void;
  setZoom: (zoom: number) => void;
  setOffset: (x: number, y: number) => void;
  setPanning: (value: boolean) => void;

  setWallStart: (point: Point | null) => void;
  addWall: (wall: Wall) => void;
}

export const useDesignerStore = create<DesignerState>((set) => ({
  tool: "select",

  zoom: 1,
  offsetX: 0,
  offsetY: 0,

  isPanning: false,

  walls: [],
  wallStart: null,

  setTool: (tool) =>
    set({
      tool,
      wallStart: null,
    }),

  setZoom: (zoom) => set({ zoom }),

  setOffset: (x, y) =>
    set({
      offsetX: x,
      offsetY: y,
    }),

  setPanning: (value) =>
    set({
      isPanning: value,
    }),

  setWallStart: (point) =>
    set({
      wallStart: point,
    }),

  addWall: (wall) =>
    set((state) => ({
      walls: [...state.walls, wall],
    })),
}));
