import { create } from "zustand";

import type {
  Camera,
  Point,
  Tool,
  Wall,
} from "../components/designer/types";

type WallEndpoint = "start" | "end";

interface MoveOffset {
  x: number;
  y: number;
}

interface DesignerState {
  tool: Tool;

  zoom: number;
  offsetX: number;
  offsetY: number;

  isPanning: boolean;

  walls: Wall[];
  wallStart: Point | null;

  cameras: Camera[];

  past: Wall[][];
  future: Wall[][];

  wallEditSnapshot: Wall[] | null;

  movingWallId: string | null;
  movingWallOffset: MoveOffset;

  setTool: (tool: Tool) => void;
  setZoom: (zoom: number) => void;
  setOffset: (x: number, y: number) => void;
  setPanning: (value: boolean) => void;

  setWallStart: (point: Point | null) => void;

  addWall: (wall: Wall) => void;
  selectWall: (id: string | null) => void;
  deleteSelectedWall: () => void;

  beginWallEdit: () => void;

  updateWallEndpoint: (
    id: string,
    endpoint: WallEndpoint,
    point: Point,
  ) => void;

  finishWallEdit: () => void;

  beginWallMove: (id: string) => void;

  updateWallMoveOffset: (
    x: number,
    y: number,
  ) => void;

  finishWallMove: (
    id: string,
    offsetX: number,
    offsetY: number,
  ) => void;

  cancelWallMove: () => void;

  addCamera: (camera: Camera) => void;

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

function wallsAreEqual(
  first: Wall[],
  second: Wall[],
): boolean {
  return JSON.stringify(first) === JSON.stringify(second);
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

    cameras: [],

    past: [],
    future: [],

    wallEditSnapshot: null,

    movingWallId: null,

    movingWallOffset: {
      x: 0,
      y: 0,
    },

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

    beginWallEdit: () =>
      set((state) => {
        if (state.wallEditSnapshot) {
          return state;
        }

        return {
          wallEditSnapshot: cloneWalls(
            state.walls,
          ),
        };
      }),

    updateWallEndpoint: (
      id,
      endpoint,
      point,
    ) =>
      set((state) => ({
        walls: state.walls.map((wall) => {
          if (wall.id !== id) {
            return wall;
          }

          return {
            ...wall,
            [endpoint]: {
              x: point.x,
              y: point.y,
            },
          };
        }),
      })),

    finishWallEdit: () =>
      set((state) => {
        const snapshot =
          state.wallEditSnapshot;

        if (!snapshot) {
          return state;
        }

        const changed = !wallsAreEqual(
          snapshot,
          state.walls,
        );

        if (!changed) {
          return {
            wallEditSnapshot: null,
          };
        }

        return {
          past: [
            ...state.past,
            cloneWalls(snapshot),
          ],

          future: [],

          wallEditSnapshot: null,
        };
      }),

    beginWallMove: (id) =>
      set((state) => ({
        movingWallId: id,

        movingWallOffset: {
          x: 0,
          y: 0,
        },

        wallEditSnapshot:
          state.wallEditSnapshot ??
          cloneWalls(state.walls),
      })),

    updateWallMoveOffset: (x, y) =>
      set({
        movingWallOffset: {
          x,
          y,
        },
      }),

    finishWallMove: (
      id,
      moveX,
      moveY,
    ) =>
      set((state) => {
        const snapshot =
          state.wallEditSnapshot;

        const updatedWalls =
          state.walls.map((wall) => {
            if (wall.id !== id) {
              return wall;
            }

            return {
              ...wall,

              start: {
                x: wall.start.x + moveX,
                y: wall.start.y + moveY,
              },

              end: {
                x: wall.end.x + moveX,
                y: wall.end.y + moveY,
              },
            };
          });

        const changed =
          moveX !== 0 || moveY !== 0;

        return {
          walls: updatedWalls,

          past:
            changed && snapshot
              ? [
                  ...state.past,
                  cloneWalls(snapshot),
                ]
              : state.past,

          future:
            changed
              ? []
              : state.future,

          movingWallId: null,

          movingWallOffset: {
            x: 0,
            y: 0,
          },

          wallEditSnapshot: null,
        };
      }),

    cancelWallMove: () =>
      set({
        movingWallId: null,

        movingWallOffset: {
          x: 0,
          y: 0,
        },

        wallEditSnapshot: null,
      }),

    addCamera: (camera) =>
      set((state) => ({
        cameras: [
          ...state.cameras,
          camera,
        ],
      })),

    undo: () =>
      set((state) => {
        if (state.past.length === 0) {
          return state;
        }

        const previousWalls =
          state.past[
            state.past.length - 1
          ];

        return {
          walls: cloneWalls(previousWalls),

          past: state.past.slice(0, -1),

          future: [
            cloneWalls(state.walls),
            ...state.future,
          ],

          wallStart: null,
          wallEditSnapshot: null,
          movingWallId: null,

          movingWallOffset: {
            x: 0,
            y: 0,
          },
        };
      }),

    redo: () =>
      set((state) => {
        if (state.future.length === 0) {
          return state;
        }

        const nextWalls =
          state.future[0];

        return {
          walls: cloneWalls(nextWalls),

          past: [
            ...state.past,
            cloneWalls(state.walls),
          ],

          future: state.future.slice(1),

          wallStart: null,
          wallEditSnapshot: null,
          movingWallId: null,

          movingWallOffset: {
            x: 0,
            y: 0,
          },
        };
      }),
  }));
  