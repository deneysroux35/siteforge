import { create } from 'zustand'

import type {
  Camera,
  EquipmentHub,
  Point,
  Tool,
  Wall,
} from '../components/designer/types'

type WallEndpoint =
  | 'start'
  | 'end'

type CameraPropertyChanges =
  Partial<
    Pick<
      Camera,
      | 'name'
      | 'position'
      | 'rotation'
      | 'fieldOfView'
      | 'range'
      | 'productId'
      | 'manufacturer'
      | 'model'
      | 'resolutionMP'
      | 'lens'
      | 'irRange'
      | 'power'
      | 'unitPrice'
    >
  >

type EquipmentHubChanges =
  Partial<
    Pick<
      EquipmentHub,
      | 'name'
      | 'position'
      | 'type'
    >
  >

interface MoveOffset {
  x: number
  y: number
}

interface SelectionBounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

interface SceneSnapshot {
  walls: Wall[]
  cameras: Camera[]
  equipmentHubs: EquipmentHub[]
}

interface LoadProjectSceneInput {
  walls: Wall[]
  cameras: Camera[]

  equipmentHubs?: EquipmentHub[]

  zoom: number
  offsetX: number
  offsetY: number
}

interface DesignerState {
  tool: Tool

  zoom: number
  offsetX: number
  offsetY: number

  isPanning: boolean

  walls: Wall[]
  wallStart: Point | null

  cameras: Camera[]

  equipmentHubs: EquipmentHub[]

  past: SceneSnapshot[]
  future: SceneSnapshot[]

  wallEditSnapshot:
    SceneSnapshot | null

  cameraEditSnapshot:
    SceneSnapshot | null

  equipmentHubEditSnapshot:
    SceneSnapshot | null

  movingWallId:
    string | null

  movingWallOffset:
    MoveOffset

  setTool: (
    tool: Tool,
  ) => void

  setZoom: (
    zoom: number,
  ) => void

  setOffset: (
    x: number,
    y: number,
  ) => void

  setPanning: (
    value: boolean,
  ) => void

  setWallStart: (
    point: Point | null,
  ) => void

  addWall: (
    wall: Wall,
  ) => void

  selectWall: (
    id: string | null,
  ) => void

  beginWallEdit: () => void

  updateWallEndpoint: (
    id: string,
    endpoint: WallEndpoint,
    point: Point,
  ) => void

  finishWallEdit: () => void

  beginWallMove: (
    id: string,
  ) => void

  updateWallMoveOffset: (
    x: number,
    y: number,
  ) => void

  finishWallMove: (
    id: string,
    offsetX: number,
    offsetY: number,
  ) => void

  cancelWallMove: () => void

  addCamera: (
    camera: Camera,
  ) => void

  selectCamera: (
    id: string | null,
  ) => void

  beginCameraEdit: () => void

  updateCameraPosition: (
    id: string,
    point: Point,
  ) => void

  updateCameraRotation: (
    id: string,
    rotation: number,
  ) => void

  updateCameraProperties: (
    id: string,
    changes:
      CameraPropertyChanges,
  ) => void

  finishCameraEdit: () => void

  addEquipmentHub: (
    hub: EquipmentHub,
  ) => void

  selectEquipmentHub: (
    id: string | null,
  ) => void

  beginEquipmentHubEdit:
    () => void

  updateEquipmentHubPosition: (
    id: string,
    point: Point,
  ) => void

  updateEquipmentHubProperties: (
    id: string,
    changes:
      EquipmentHubChanges,
  ) => void

  finishEquipmentHubEdit:
    () => void

  clearSelection: () => void

  selectObjectsInRect: (
    bounds: SelectionBounds,
    additive?: boolean,
  ) => void

  deleteSelectedObject:
    () => void

  loadProjectScene: (
    scene:
      LoadProjectSceneInput,
  ) => void

  undo: () => void
  redo: () => void
}

function cloneWalls(
  walls: Wall[],
): Wall[] {
  return walls.map(
    (wall) => ({
      ...wall,

      start: {
        ...wall.start,
      },

      end: {
        ...wall.end,
      },
    }),
  )
}

function cloneCameras(
  cameras: Camera[],
): Camera[] {
  return cameras.map(
    (camera) => ({
      ...camera,

      position: {
        ...camera.position,
      },
    }),
  )
}

function cloneEquipmentHubs(
  hubs: EquipmentHub[],
): EquipmentHub[] {
  return hubs.map(
    (hub) => ({
      ...hub,

      position: {
        ...hub.position,
      },
    }),
  )
}

function createSnapshot(
  walls: Wall[],
  cameras: Camera[],
  equipmentHubs:
    EquipmentHub[],
): SceneSnapshot {
  return {
    walls:
      cloneWalls(
        walls,
      ),

    cameras:
      cloneCameras(
        cameras,
      ),

    equipmentHubs:
      cloneEquipmentHubs(
        equipmentHubs,
      ),
  }
}

function snapshotsAreEqual(
  first: SceneSnapshot,
  second: SceneSnapshot,
): boolean {
  return (
    JSON.stringify(first) ===
    JSON.stringify(second)
  )
}

function pointInsideBounds(
  point: Point,
  bounds: SelectionBounds,
): boolean {
  return (
    point.x >= bounds.minX &&
    point.x <= bounds.maxX &&
    point.y >= bounds.minY &&
    point.y <= bounds.maxY
  )
}

function orientation(
  first: Point,
  second: Point,
  third: Point,
): number {
  const value =
    (
      second.y -
      first.y
    ) *
      (
        third.x -
        second.x
      ) -
    (
      second.x -
      first.x
    ) *
      (
        third.y -
        second.y
      )

  if (
    Math.abs(value) <
    0.000001
  ) {
    return 0
  }

  return value > 0
    ? 1
    : 2
}

function pointOnSegment(
  first: Point,
  second: Point,
  point: Point,
): boolean {
  return (
    point.x <=
      Math.max(
        first.x,
        second.x,
      ) &&
    point.x >=
      Math.min(
        first.x,
        second.x,
      ) &&
    point.y <=
      Math.max(
        first.y,
        second.y,
      ) &&
    point.y >=
      Math.min(
        first.y,
        second.y,
      )
  )
}

function segmentsIntersect(
  firstStart: Point,
  firstEnd: Point,
  secondStart: Point,
  secondEnd: Point,
): boolean {
  const o1 =
    orientation(
      firstStart,
      firstEnd,
      secondStart,
    )

  const o2 =
    orientation(
      firstStart,
      firstEnd,
      secondEnd,
    )

  const o3 =
    orientation(
      secondStart,
      secondEnd,
      firstStart,
    )

  const o4 =
    orientation(
      secondStart,
      secondEnd,
      firstEnd,
    )

  if (
    o1 !== o2 &&
    o3 !== o4
  ) {
    return true
  }

  if (
    o1 === 0 &&
    pointOnSegment(
      firstStart,
      firstEnd,
      secondStart,
    )
  ) {
    return true
  }

  if (
    o2 === 0 &&
    pointOnSegment(
      firstStart,
      firstEnd,
      secondEnd,
    )
  ) {
    return true
  }

  if (
    o3 === 0 &&
    pointOnSegment(
      secondStart,
      secondEnd,
      firstStart,
    )
  ) {
    return true
  }

  return (
    o4 === 0 &&
    pointOnSegment(
      secondStart,
      secondEnd,
      firstEnd,
    )
  )
}

function wallIntersectsBounds(
  wall: Wall,
  bounds:
    SelectionBounds,
): boolean {
  if (
    pointInsideBounds(
      wall.start,
      bounds,
    ) ||
    pointInsideBounds(
      wall.end,
      bounds,
    )
  ) {
    return true
  }

  const topLeft = {
    x: bounds.minX,
    y: bounds.minY,
  }

  const topRight = {
    x: bounds.maxX,
    y: bounds.minY,
  }

  const bottomRight = {
    x: bounds.maxX,
    y: bounds.maxY,
  }

  const bottomLeft = {
    x: bounds.minX,
    y: bounds.maxY,
  }

  return (
    segmentsIntersect(
      wall.start,
      wall.end,
      topLeft,
      topRight,
    ) ||
    segmentsIntersect(
      wall.start,
      wall.end,
      topRight,
      bottomRight,
    ) ||
    segmentsIntersect(
      wall.start,
      wall.end,
      bottomRight,
      bottomLeft,
    ) ||
    segmentsIntersect(
      wall.start,
      wall.end,
      bottomLeft,
      topLeft,
    )
  )
}

export const useDesignerStore =
  create<DesignerState>(
    (set) => ({
      tool: 'select',

      zoom: 1,
      offsetX: 0,
      offsetY: 0,

      isPanning: false,

      walls: [],
      wallStart: null,

      cameras: [],

      equipmentHubs: [],

      past: [],
      future: [],

      wallEditSnapshot:
        null,

      cameraEditSnapshot:
        null,

      equipmentHubEditSnapshot:
        null,

      movingWallId:
        null,

      movingWallOffset: {
        x: 0,
        y: 0,
      },

      setTool: (
        tool,
      ): void =>
        set({
          tool,

          wallStart:
            null,
        }),

      setZoom: (
        zoom,
      ): void =>
        set({
          zoom,
        }),

      setOffset: (
        x,
        y,
      ): void =>
        set({
          offsetX: x,
          offsetY: y,
        }),

      setPanning: (
        value,
      ): void =>
        set({
          isPanning:
            value,
        }),

      setWallStart: (
        point,
      ): void =>
        set({
          wallStart:
            point,
        }),

      addWall: (
        wall,
      ): void =>
        set(
          (state) => ({
            past: [
              ...state.past,

              createSnapshot(
                state.walls,
                state.cameras,
                state.equipmentHubs,
              ),
            ],

            walls: [
              ...state.walls,
              wall,
            ],

            future: [],
          }),
        ),

      selectWall: (
        id,
      ): void =>
        set(
          (state) => ({
            walls:
              state.walls.map(
                (wall) => ({
                  ...wall,

                  selected:
                    wall.id ===
                    id,
                }),
              ),

            cameras:
              state.cameras.map(
                (camera) => ({
                  ...camera,

                  selected:
                    false,
                }),
              ),

            equipmentHubs:
              state.equipmentHubs.map(
                (hub) => ({
                  ...hub,

                  selected:
                    false,
                }),
              ),
          }),
        ),

      beginWallEdit:
        (): void =>
          set(
            (state) => {
              if (
                state.wallEditSnapshot
              ) {
                return state
              }

              return {
                wallEditSnapshot:
                  createSnapshot(
                    state.walls,
                    state.cameras,
                    state.equipmentHubs,
                  ),
              }
            },
          ),

      updateWallEndpoint: (
        id,
        endpoint,
        point,
      ): void =>
        set(
          (state) => ({
            walls:
              state.walls.map(
                (wall) => {
                  if (
                    wall.id !==
                    id
                  ) {
                    return wall
                  }

                  return {
                    ...wall,

                    [endpoint]: {
                      x: point.x,
                      y: point.y,
                    },
                  }
                },
              ),
          }),
        ),

      finishWallEdit:
        (): void =>
          set(
            (state) => {
              const snapshot =
                state.wallEditSnapshot

              if (!snapshot) {
                return state
              }

              const current =
                createSnapshot(
                  state.walls,
                  state.cameras,
                  state.equipmentHubs,
                )

              if (
                snapshotsAreEqual(
                  snapshot,
                  current,
                )
              ) {
                return {
                  wallEditSnapshot:
                    null,
                }
              }

              return {
                past: [
                  ...state.past,
                  snapshot,
                ],

                future: [],

                wallEditSnapshot:
                  null,
              }
            },
          ),

      beginWallMove: (
        id,
      ): void =>
        set(
          (state) => ({
            movingWallId:
              id,

            movingWallOffset: {
              x: 0,
              y: 0,
            },

            wallEditSnapshot:
              state.wallEditSnapshot ??
              createSnapshot(
                state.walls,
                state.cameras,
                state.equipmentHubs,
              ),
          }),
        ),

      updateWallMoveOffset: (
        x,
        y,
      ): void =>
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
      ): void =>
        set(
          (state) => {
            const snapshot =
              state.wallEditSnapshot

            const walls =
              state.walls.map(
                (wall) => {
                  if (
                    wall.id !==
                    id
                  ) {
                    return wall
                  }

                  return {
                    ...wall,

                    start: {
                      x:
                        wall.start.x +
                        moveX,

                      y:
                        wall.start.y +
                        moveY,
                    },

                    end: {
                      x:
                        wall.end.x +
                        moveX,

                      y:
                        wall.end.y +
                        moveY,
                    },
                  }
                },
              )

            const changed =
              moveX !== 0 ||
              moveY !== 0

            return {
              walls,

              past:
                changed &&
                snapshot
                  ? [
                      ...state.past,
                      snapshot,
                    ]
                  : state.past,

              future:
                changed
                  ? []
                  : state.future,

              movingWallId:
                null,

              movingWallOffset: {
                x: 0,
                y: 0,
              },

              wallEditSnapshot:
                null,
            }
          },
        ),

      cancelWallMove:
        (): void =>
          set({
            movingWallId:
              null,

            movingWallOffset: {
              x: 0,
              y: 0,
            },

            wallEditSnapshot:
              null,
          }),

      addCamera: (
        camera,
      ): void =>
        set(
          (state) => ({
            past: [
              ...state.past,

              createSnapshot(
                state.walls,
                state.cameras,
                state.equipmentHubs,
              ),
            ],

            cameras: [
              ...state.cameras,
              camera,
            ],

            future: [],
          }),
        ),

      selectCamera: (
        id,
      ): void =>
        set(
          (state) => ({
            walls:
              state.walls.map(
                (wall) => ({
                  ...wall,

                  selected:
                    false,
                }),
              ),

            cameras:
              state.cameras.map(
                (camera) => ({
                  ...camera,

                  selected:
                    camera.id ===
                    id,
                }),
              ),

            equipmentHubs:
              state.equipmentHubs.map(
                (hub) => ({
                  ...hub,

                  selected:
                    false,
                }),
              ),
          }),
        ),

      beginCameraEdit:
        (): void =>
          set(
            (state) => {
              if (
                state.cameraEditSnapshot
              ) {
                return state
              }

              return {
                cameraEditSnapshot:
                  createSnapshot(
                    state.walls,
                    state.cameras,
                    state.equipmentHubs,
                  ),
              }
            },
          ),

      updateCameraPosition: (
        id,
        point,
      ): void =>
        set(
          (state) => ({
            cameras:
              state.cameras.map(
                (camera) => {
                  if (
                    camera.id !==
                    id
                  ) {
                    return camera
                  }

                  return {
                    ...camera,

                    position: {
                      x: point.x,
                      y: point.y,
                    },
                  }
                },
              ),
          }),
        ),

      updateCameraRotation: (
        id,
        rotation,
      ): void =>
        set(
          (state) => ({
            cameras:
              state.cameras.map(
                (camera) => {
                  if (
                    camera.id !==
                    id
                  ) {
                    return camera
                  }

                  return {
                    ...camera,
                    rotation,
                  }
                },
              ),
          }),
        ),

      updateCameraProperties: (
        id,
        changes,
      ): void =>
        set(
          (state) => ({
            cameras:
              state.cameras.map(
                (camera) => {
                  if (
                    camera.id !==
                    id
                  ) {
                    return camera
                  }

                  return {
                    ...camera,

                    ...changes,

                    position:
                      changes.position
                        ? {
                            ...changes.position,
                          }
                        : camera.position,
                  }
                },
              ),
          }),
        ),

      finishCameraEdit:
        (): void =>
          set(
            (state) => {
              const snapshot =
                state.cameraEditSnapshot

              if (!snapshot) {
                return state
              }

              const current =
                createSnapshot(
                  state.walls,
                  state.cameras,
                  state.equipmentHubs,
                )

              if (
                snapshotsAreEqual(
                  snapshot,
                  current,
                )
              ) {
                return {
                  cameraEditSnapshot:
                    null,
                }
              }

              return {
                past: [
                  ...state.past,
                  snapshot,
                ],

                future: [],

                cameraEditSnapshot:
                  null,
              }
            },
          ),

      addEquipmentHub: (
        hub,
      ): void =>
        set(
          (state) => ({
            past: [
              ...state.past,

              createSnapshot(
                state.walls,
                state.cameras,
                state.equipmentHubs,
              ),
            ],

            equipmentHubs: [
              ...state.equipmentHubs,
              hub,
            ],

            future: [],
          }),
        ),

      selectEquipmentHub: (
        id,
      ): void =>
        set(
          (state) => ({
            walls:
              state.walls.map(
                (wall) => ({
                  ...wall,

                  selected:
                    false,
                }),
              ),

            cameras:
              state.cameras.map(
                (camera) => ({
                  ...camera,

                  selected:
                    false,
                }),
              ),

            equipmentHubs:
              state.equipmentHubs.map(
                (hub) => ({
                  ...hub,

                  selected:
                    hub.id ===
                    id,
                }),
              ),
          }),
        ),

      beginEquipmentHubEdit:
        (): void =>
          set(
            (state) => {
              if (
                state
                  .equipmentHubEditSnapshot
              ) {
                return state
              }

              return {
                equipmentHubEditSnapshot:
                  createSnapshot(
                    state.walls,
                    state.cameras,
                    state.equipmentHubs,
                  ),
              }
            },
          ),

      updateEquipmentHubPosition: (
        id,
        point,
      ): void =>
        set(
          (state) => ({
            equipmentHubs:
              state.equipmentHubs.map(
                (hub) => {
                  if (
                    hub.id !== id
                  ) {
                    return hub
                  }

                  return {
                    ...hub,

                    position: {
                      x: point.x,
                      y: point.y,
                    },
                  }
                },
              ),
          }),
        ),

      updateEquipmentHubProperties: (
        id,
        changes,
      ): void =>
        set(
          (state) => ({
            equipmentHubs:
              state.equipmentHubs.map(
                (hub) => {
                  if (
                    hub.id !== id
                  ) {
                    return hub
                  }

                  return {
                    ...hub,

                    ...changes,

                    position:
                      changes.position
                        ? {
                            ...changes.position,
                          }
                        : hub.position,
                  }
                },
              ),
          }),
        ),

      finishEquipmentHubEdit:
        (): void =>
          set(
            (state) => {
              const snapshot =
                state
                  .equipmentHubEditSnapshot

              if (!snapshot) {
                return state
              }

              const current =
                createSnapshot(
                  state.walls,
                  state.cameras,
                  state.equipmentHubs,
                )

              if (
                snapshotsAreEqual(
                  snapshot,
                  current,
                )
              ) {
                return {
                  equipmentHubEditSnapshot:
                    null,
                }
              }

              return {
                past: [
                  ...state.past,
                  snapshot,
                ],

                future: [],

                equipmentHubEditSnapshot:
                  null,
              }
            },
          ),

      clearSelection:
        (): void =>
          set(
            (state) => ({
              walls:
                state.walls.map(
                  (wall) => ({
                    ...wall,

                    selected:
                      false,
                  }),
                ),

              cameras:
                state.cameras.map(
                  (camera) => ({
                    ...camera,

                    selected:
                      false,
                  }),
                ),

              equipmentHubs:
                state.equipmentHubs.map(
                  (hub) => ({
                    ...hub,

                    selected:
                      false,
                  }),
                ),
            }),
          ),

      selectObjectsInRect: (
        bounds,
        additive = false,
      ): void =>
        set(
          (state) => ({
            walls:
              state.walls.map(
                (wall) => {
                  const inside =
                    wallIntersectsBounds(
                      wall,
                      bounds,
                    )

                  return {
                    ...wall,

                    selected:
                      additive
                        ? Boolean(
                            wall.selected ||
                              inside,
                          )
                        : inside,
                  }
                },
              ),

            cameras:
              state.cameras.map(
                (camera) => {
                  const inside =
                    pointInsideBounds(
                      camera.position,
                      bounds,
                    )

                  return {
                    ...camera,

                    selected:
                      additive
                        ? Boolean(
                            camera.selected ||
                              inside,
                          )
                        : inside,
                  }
                },
              ),

            equipmentHubs:
              state.equipmentHubs.map(
                (hub) => {
                  const inside =
                    pointInsideBounds(
                      hub.position,
                      bounds,
                    )

                  return {
                    ...hub,

                    selected:
                      additive
                        ? Boolean(
                            hub.selected ||
                              inside,
                          )
                        : inside,
                  }
                },
              ),
          }),
        ),

      deleteSelectedObject:
        (): void =>
          set(
            (state) => {
              const hasSelection =
                state.walls.some(
                  (wall) =>
                    wall.selected,
                ) ||
                state.cameras.some(
                  (camera) =>
                    camera.selected,
                ) ||
                state.equipmentHubs.some(
                  (hub) =>
                    hub.selected,
                )

              if (
                !hasSelection
              ) {
                return state
              }

              return {
                past: [
                  ...state.past,

                  createSnapshot(
                    state.walls,
                    state.cameras,
                    state.equipmentHubs,
                  ),
                ],

                walls:
                  state.walls.filter(
                    (wall) =>
                      !wall.selected,
                  ),

                cameras:
                  state.cameras.filter(
                    (camera) =>
                      !camera.selected,
                  ),

                equipmentHubs:
                  state.equipmentHubs.filter(
                    (hub) =>
                      !hub.selected,
                  ),

                future: [],
              }
            },
          ),

      /*
       * Used by Open Project.
       *
       * equipmentHubs is optional
       * so older SiteForge project
       * files can still load.
       */
      loadProjectScene: (
        scene,
      ): void =>
        set({
          tool: 'select',

          zoom:
            scene.zoom,

          offsetX:
            scene.offsetX,

          offsetY:
            scene.offsetY,

          isPanning:
            false,

          walls:
            cloneWalls(
              scene.walls,
            ).map(
              (wall) => ({
                ...wall,

                selected:
                  false,
              }),
            ),

          cameras:
            cloneCameras(
              scene.cameras,
            ).map(
              (camera) => ({
                ...camera,

                selected:
                  false,
              }),
            ),

          equipmentHubs:
            cloneEquipmentHubs(
              scene.equipmentHubs ??
                [],
            ).map(
              (hub) => ({
                ...hub,

                selected:
                  false,
              }),
            ),

          wallStart:
            null,

          past: [],
          future: [],

          wallEditSnapshot:
            null,

          cameraEditSnapshot:
            null,

          equipmentHubEditSnapshot:
            null,

          movingWallId:
            null,

          movingWallOffset: {
            x: 0,
            y: 0,
          },
        }),

      undo: (): void =>
        set(
          (state) => {
            if (
              state.past.length ===
              0
            ) {
              return state
            }

            const previous =
              state.past[
                state.past.length -
                  1
              ]

            return {
              walls:
                cloneWalls(
                  previous.walls,
                ),

              cameras:
                cloneCameras(
                  previous.cameras,
                ),

              equipmentHubs:
                cloneEquipmentHubs(
                  previous
                    .equipmentHubs,
                ),

              past:
                state.past.slice(
                  0,
                  -1,
                ),

              future: [
                createSnapshot(
                  state.walls,
                  state.cameras,
                  state.equipmentHubs,
                ),

                ...state.future,
              ],

              wallStart:
                null,

              wallEditSnapshot:
                null,

              cameraEditSnapshot:
                null,

              equipmentHubEditSnapshot:
                null,

              movingWallId:
                null,

              movingWallOffset: {
                x: 0,
                y: 0,
              },
            }
          },
        ),

      redo: (): void =>
        set(
          (state) => {
            if (
              state.future
                .length === 0
            ) {
              return state
            }

            const next =
              state.future[0]

            return {
              walls:
                cloneWalls(
                  next.walls,
                ),

              cameras:
                cloneCameras(
                  next.cameras,
                ),

              equipmentHubs:
                cloneEquipmentHubs(
                  next.equipmentHubs,
                ),

              past: [
                ...state.past,

                createSnapshot(
                  state.walls,
                  state.cameras,
                  state.equipmentHubs,
                ),
              ],

              future:
                state.future.slice(
                  1,
                ),

              wallStart:
                null,

              wallEditSnapshot:
                null,

              cameraEditSnapshot:
                null,

              equipmentHubEditSnapshot:
                null,

              movingWallId:
                null,

              movingWallOffset: {
                x: 0,
                y: 0,
              },
            }
          },
        ),
    }),
  )
  
  