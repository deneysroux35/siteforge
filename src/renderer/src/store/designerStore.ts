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

interface SceneSnapshot {
  walls: Wall[];
  cameras: Camera[];
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

  past: SceneSnapshot[];
  future: SceneSnapshot[];

  wallEditSnapshot: SceneSnapshot | null;
  cameraEditSnapshot: SceneSnapshot | null;

  movingWallId: string | null;
  movingWallOffset: MoveOffset;

  setTool: (tool: Tool) => void;
  setZoom: (zoom: number) => void;
  setOffset: (x: number, y: number) => void;
  setPanning: (value: boolean) => void;

  setWallStart: (point: Point | null) => void;

  addWall: (wall: Wall) => void;
  selectWall: (id: string | null) => void;

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
  selectCamera: (id: string | null) => void;

  beginCameraEdit: () => void;

  updateCameraPosition: (
    id: string,
    point: Point,
  ) => void;

  updateCameraRotation: (
    id: string,
    rotation: number,
  ) => void;

  finishCameraEdit: () => void;

  clearSelection: () => void;
  deleteSelectedObject: () => void;

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

function cloneCameras(
  cameras: Camera[],
): Camera[] {
  return cameras.map((camera) => ({
    ...camera,
    position: { ...camera.position },
  }));
}

function createSnapshot(
  walls: Wall[],
  cameras: Camera[],
): SceneSnapshot {
  return {
    walls: cloneWalls(walls),
    cameras: cloneCameras(cameras),
  };
}

function snapshotsAreEqual(
  first: SceneSnapshot,
  second: SceneSnapshot,
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
    cameraEditSnapshot: null,

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
          createSnapshot(
            state.walls,
            state.cameras,
          ),
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

        cameras: state.cameras.map(
          (camera) => ({
            ...camera,
            selected: false,
          }),
        ),
      })),

    beginWallEdit: () =>
      set((state) => {
        if (state.wallEditSnapshot) {
          return state;
        }

        return {
          wallEditSnapshot:
            createSnapshot(
              state.walls,
              state.cameras,
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

        const current = createSnapshot(
          state.walls,
          state.cameras,
        );

        if (
          snapshotsAreEqual(
            snapshot,
            current,
          )
        ) {
          return {
            wallEditSnapshot: null,
          };
        }

        return {
          past: [
            ...state.past,
            snapshot,
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
          createSnapshot(
            state.walls,
            state.cameras,
          ),
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
                  snapshot,
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
        past: [
          ...state.past,
          createSnapshot(
            state.walls,
            state.cameras,
          ),
        ],

        cameras: [
          ...state.cameras,
          camera,
        ],

        future: [],
      })),

    selectCamera: (id) =>
      set((state) => ({
        walls: state.walls.map((wall) => ({
          ...wall,
          selected: false,
        })),

        cameras: state.cameras.map(
          (camera) => ({
            ...camera,
            selected: camera.id === id,
          }),
        ),
      })),

    beginCameraEdit: () =>
      set((state) => {
        if (state.cameraEditSnapshot) {
          return state;
        }

        return {
          cameraEditSnapshot:
            createSnapshot(
              state.walls,
              state.cameras,
            ),
        };
      }),

    updateCameraPosition: (
      id,
      point,
    ) =>
      set((state) => ({
        cameras: state.cameras.map(
          (camera) => {
            if (camera.id !== id) {
              return camera;
            }

            return {
              ...camera,
              position: {
                x: point.x,
                y: point.y,
              },
            };
          },
        ),
      })),

    updateCameraRotation: (
      id,
      rotation,
    ) =>
      set((state) => ({
        cameras: state.cameras.map(
          (camera) => {
            if (camera.id !== id) {
              return camera;
            }

            return {
              ...camera,
              rotation,
            };
          },
        ),
      })),

    finishCameraEdit: () =>
      set((state) => {
        const snapshot =
          state.cameraEditSnapshot;

        if (!snapshot) {
          return state;
        }

        const current = createSnapshot(
          state.walls,
          state.cameras,
        );

        if (
          snapshotsAreEqual(
            snapshot,
            current,
          )
        ) {
          return {
            cameraEditSnapshot: null,
          };
        }

        return {
          past: [
            ...state.past,
            snapshot,
          ],

          future: [],
          cameraEditSnapshot: null,
        };
      }),

    clearSelection: () =>
      set((state) => ({
        walls: state.walls.map((wall) => ({
          ...wall,
          selected: false,
        })),

        cameras: state.cameras.map(
          (camera) => ({
            ...camera,
            selected: false,
          }),
        ),
      })),

    deleteSelectedObject: () =>
      set((state) => {
        const hasSelectedWall =
          state.walls.some(
            (wall) => wall.selected,
          );

        const hasSelectedCamera =
          state.cameras.some(
            (camera) => camera.selected,
          );

        if (
          !hasSelectedWall &&
          !hasSelectedCamera
        ) {
          return state;
        }

        return {
          past: [
            ...state.past,
            createSnapshot(
              state.walls,
              state.cameras,
            ),
          ],

          walls: state.walls.filter(
            (wall) => !wall.selected,
          ),

          cameras:
            state.cameras.filter(
              (camera) =>
                !camera.selected,
            ),

          future: [],
        };
      }),

    undo: () =>
      set((state) => {
        if (state.past.length === 0) {
          return state;
        }

        const previous =
          state.past[
            state.past.length - 1
          ];

        return {
          walls:
            cloneWalls(previous.walls),

          cameras:
            cloneCameras(
              previous.cameras,
            ),

          past:
            state.past.slice(0, -1),

          future: [
            createSnapshot(
              state.walls,
              state.cameras,
            ),
            ...state.future,
          ],

          wallStart: null,
          wallEditSnapshot: null,
          cameraEditSnapshot: null,
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

        const next = state.future[0];

        return {
          walls:
            cloneWalls(next.walls),

          cameras:
            cloneCameras(next.cameras),

          past: [
            ...state.past,
            createSnapshot(
              state.walls,
              state.cameras,
            ),
          ],

          future:
            state.future.slice(1),

          wallStart: null,
          wallEditSnapshot: null,
          cameraEditSnapshot: null,
          movingWallId: null,

          movingWallOffset: {
            x: 0,
            y: 0,
          },
        };
      }),
  }));
  