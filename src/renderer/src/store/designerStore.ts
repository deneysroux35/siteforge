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

  past: Wall[][];
  future: Wall[][];

  setTool: (tool: Tool) => void;
  setZoom: (zoom: number) => void;
  setOffset: (x: number, y: number) => void;
  setPanning: (value: boolean) => void;

  setWallStart: (point: Point | null) => void;

  addWall: (wall: Wall) => void;
  selectWall: (id: string | null) => void;
  deleteSelectedWall: () => void;

  undo: () => void;
  redo: () => void;
}

function cloneWalls(walls: Wall[]): Wall[] {
  return walls.map((wall) => ({
    ...wall,
    start: { ...wall.start },
    end: { ...wall.end },
  }));
}

export const useDesignerStore =
  create<DesignerState>((set) => ({
    tool: "select",

    zoom: 1,
    offsetX: 0,
    offsetY: 0,

    isPanning: false,

    walls: [],
    wallStart: null,

    past: [],
    future: [],

    setTool: (tool) =>
      set({
        tool,
        wallStart: null,
      }),

    setZoom: (zoom) =>
      set({
        zoom,
      }),

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
        past: [
          ...state.past,
          cloneWalls(state.walls),
        ],

        walls: [
          ...state.walls,
          wall,
        ],

        future: [],
      })),

    selectWall: (id) =>
      set((state) => ({
        walls: state.walls.map((wall) => ({
          ...wall,
          selected: wall.id === id,
        })),
      })),

    deleteSelectedWall: () =>
      set((state) => {
        const hasSelectedWall =
          state.walls.some(
            (wall) => wall.selected,
          );

        if (!hasSelectedWall) {
          return state;
        }

        return {
          past: [
            ...state.past,
            cloneWalls(state.walls),
          ],

          walls: state.walls.filter(
            (wall) => !wall.selected,
          ),

          future: [],
        };
      }),

    undo: () =>
      set((state) => {
        if (state.past.length === 0) {
          return state;
        }

        const previousWalls =
          state.past[state.past.length - 1];

        return {
          walls: cloneWalls(previousWalls),

          past: state.past.slice(0, -1),

          future: [
            cloneWalls(state.walls),
            ...state.future,
          ],

          wallStart: null,
        };
      }),

    redo: () =>
      set((state) => {
        if (state.future.length === 0) {
          return state;
        }

        const nextWalls = state.future[0];

        return {
          walls: cloneWalls(nextWalls),

          past: [
            ...state.past,
            cloneWalls(state.walls),
          ],

          future: state.future.slice(1),

          wallStart: null,
        };
      }),
  }));
  