import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
} from 'react-konva'

import type {
  KonvaEventObject,
} from 'konva/lib/Node'

import type Konva from 'konva'

import {
  v4 as uuidv4,
} from 'uuid'

import CableLayer from './layers/CableLayer'
import CameraLayer from './layers/CameraLayer'
import EquipmentHubLayer from './layers/EquipmentHubLayer'
import Grid from './layers/Grid'
import MeasurementLabel from './layers/MeasurementLabel'
import SelectionLayer from './layers/SelectionLayer'
import WallLayer from './layers/WallLayer'

import {
  useDesignerStore,
} from '../../store/designerStore'

import type {
  Point,
} from './types'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 5
const ZOOM_FACTOR = 1.1
const GRID_SIZE = 25

interface ScreenPoint {
  x: number
  y: number
}

function snapToGrid(
  value: number,
): number {
  return (
    Math.round(
      value / GRID_SIZE,
    ) * GRID_SIZE
  )
}

export default function Canvas() {
  const containerRef =
    useRef<HTMLDivElement>(
      null,
    )

  const stageRef =
    useRef<Konva.Stage>(
      null,
    )

  const lastPanPointer =
    useRef<ScreenPoint | null>(
      null,
    )

  const [size, setSize] =
    useState({
      width: 1,
      height: 1,
    })

  const [
    previewPoint,
    setPreviewPoint,
  ] = useState<Point | null>(
    null,
  )

  const tool =
    useDesignerStore(
      (state) =>
        state.tool,
    )

  const zoom =
    useDesignerStore(
      (state) =>
        state.zoom,
    )

  const offsetX =
    useDesignerStore(
      (state) =>
        state.offsetX,
    )

  const offsetY =
    useDesignerStore(
      (state) =>
        state.offsetY,
    )

  const isPanning =
    useDesignerStore(
      (state) =>
        state.isPanning,
    )

  const wallStart =
    useDesignerStore(
      (state) =>
        state.wallStart,
    )

  const setZoom =
    useDesignerStore(
      (state) =>
        state.setZoom,
    )

  const setOffset =
    useDesignerStore(
      (state) =>
        state.setOffset,
    )

  const setPanning =
    useDesignerStore(
      (state) =>
        state.setPanning,
    )

  const setWallStart =
    useDesignerStore(
      (state) =>
        state.setWallStart,
    )

  const addWall =
    useDesignerStore(
      (state) =>
        state.addWall,
    )

  const addCamera =
    useDesignerStore(
      (state) =>
        state.addCamera,
    )

  const addEquipmentHub =
    useDesignerStore(
      (state) =>
        state.addEquipmentHub,
    )

  const equipmentHubs =
    useDesignerStore(
      (state) =>
        state.equipmentHubs,
    )

  const clearSelection =
    useDesignerStore(
      (state) =>
        state.clearSelection,
    )

  const deleteSelectedObject =
    useDesignerStore(
      (state) =>
        state.deleteSelectedObject,
    )

  const undo =
    useDesignerStore(
      (state) =>
        state.undo,
    )

  const redo =
    useDesignerStore(
      (state) =>
        state.redo,
    )

  /*
   * Resize the Konva stage whenever
   * the canvas container changes size.
   *
   * The ref is read inside updateSize()
   * so TypeScript knows the element
   * cannot be null when clientWidth /
   * clientHeight are accessed.
   */
  useEffect(() => {
    function updateSize(): void {
      const container =
        containerRef.current

      if (!container) {
        return
      }

      setSize({
        width:
          container.clientWidth,

        height:
          container.clientHeight,
      })
    }

    updateSize()

    const container =
      containerRef.current

    if (!container) {
      return
    }

    const observer =
      new ResizeObserver(
        updateSize,
      )

    observer.observe(
      container,
    )

    return () => {
      observer.disconnect()
    }
  }, [])

  /*
   * Centre the CAD origin inside
   * the viewport.
   */
  useEffect(() => {
    setZoom(1)

    setOffset(
      size.width / 2,
      size.height / 2,
    )
  }, [
    size.width,
    size.height,
    setZoom,
    setOffset,
  ])

  /*
   * Cancel an unfinished wall when
   * switching away from Wall mode.
   */
  useEffect(() => {
    if (
      tool !== 'wall'
    ) {
      setWallStart(null)
      setPreviewPoint(null)
    }
  }, [
    tool,
    setWallStart,
  ])

  /*
   * Designer keyboard commands.
   */
  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ): void {
      const target =
        event.target as
          | HTMLElement
          | null

      const isTyping =
        target?.tagName ===
          'INPUT' ||
        target?.tagName ===
          'TEXTAREA' ||
        target?.isContentEditable

      if (isTyping) {
        return
      }

      const modifierPressed =
        event.ctrlKey ||
        event.metaKey

      /*
       * Ctrl + Shift + Z
       */
      if (
        modifierPressed &&
        event.shiftKey &&
        event.key
          .toLowerCase() ===
          'z'
      ) {
        event.preventDefault()

        redo()

        return
      }

      /*
       * Ctrl + Z
       */
      if (
        modifierPressed &&
        event.key
          .toLowerCase() ===
          'z'
      ) {
        event.preventDefault()

        undo()

        return
      }

      /*
       * Ctrl + Y
       */
      if (
        modifierPressed &&
        event.key
          .toLowerCase() ===
          'y'
      ) {
        event.preventDefault()

        redo()

        return
      }

      /*
       * Delete selected objects.
       */
      if (
        event.key ===
          'Delete' ||
        event.key ===
          'Backspace'
      ) {
        event.preventDefault()

        deleteSelectedObject()

        return
      }

      /*
       * Escape clears current
       * selection / wall preview.
       */
      if (
        event.key ===
        'Escape'
      ) {
        event.preventDefault()

        setWallStart(null)

        setPreviewPoint(null)

        clearSelection()
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [
    clearSelection,
    deleteSelectedObject,
    redo,
    setWallStart,
    undo,
  ])

  function getScreenPointer():
    ScreenPoint | null {
    const pointer =
      stageRef.current
        ?.getPointerPosition()

    if (!pointer) {
      return null
    }

    return {
      x: pointer.x,
      y: pointer.y,
    }
  }

  function screenToWorld(
    pointer: ScreenPoint,
  ): Point {
    return {
      x:
        snapToGrid(
          (
            pointer.x -
            offsetX
          ) / zoom,
        ),

      y:
        snapToGrid(
          (
            pointer.y -
            offsetY
          ) / zoom,
        ),
    }
  }

  function handleWheel(
    event:
      KonvaEventObject<
        WheelEvent
      >,
  ): void {
    event.evt.preventDefault()

    const pointer =
      getScreenPointer()

    if (!pointer) {
      return
    }

    const worldPoint = {
      x:
        (
          pointer.x -
          offsetX
        ) / zoom,

      y:
        (
          pointer.y -
          offsetY
        ) / zoom,
    }

    const requestedZoom =
      event.evt.deltaY < 0
        ? zoom *
          ZOOM_FACTOR
        : zoom /
          ZOOM_FACTOR

    const newZoom =
      Math.min(
        MAX_ZOOM,
        Math.max(
          MIN_ZOOM,
          requestedZoom,
        ),
      )

    setZoom(
      newZoom,
    )

    /*
     * Keep the world position under
     * the mouse pointer stationary
     * while zooming.
     */
    setOffset(
      pointer.x -
        worldPoint.x *
          newZoom,

      pointer.y -
        worldPoint.y *
          newZoom,
    )
  }

  function getNextRackName(): string {
    const usedNumbers = new Set(
      equipmentHubs
        .map((hub) => {
          const match =
            hub.name.match(
              /^Main Rack (\d+)$/,
            )

          if (!match) {
            return null
          }

          return Number(
            match[1],
          )
        })
        .filter(
          (number): number is number =>
            number !== null,
        ),
    )

    let nextNumber = 1

    while (
      usedNumbers.has(
        nextNumber,
      )
    ) {
      nextNumber += 1
    }

    return (
      'Main Rack ' +
      nextNumber
    )
  }

  function handleMouseDown(
    event:
      KonvaEventObject<
        MouseEvent
      >,
  ): void {
    const pointer =
      getScreenPointer()

    if (!pointer) {
      return
    }

    /*
     * Middle mouse button pan.
     */
    if (
      event.evt.button === 1
    ) {
      event.evt.preventDefault()

      lastPanPointer.current =
        pointer

      setPanning(true)

      return
    }

    /*
     * Ignore all buttons other
     * than left click.
     */
    if (
      event.evt.button !== 0
    ) {
      return
    }

    /*
     * SELECT TOOL
     */
    if (
      tool === 'select'
    ) {
      const clickedStage =
        event.target ===
        event.target.getStage()

      const clickedBackground =
        event.target.name() ===
        'canvas-background'

      if (
        clickedStage ||
        clickedBackground
      ) {
        clearSelection()
      }

      return
    }

    /*
     * CAMERA TOOL
     */
    if (
      tool === 'camera'
    ) {
      const worldPoint =
        screenToWorld(
          pointer,
        )

      addCamera({
        id:
          uuidv4(),

        position:
          worldPoint,

        rotation:
          0,

        selected:
          false,

        name:
          'Camera',

        manufacturer:
          'Unassigned',

        model:
          'Unassigned',

        assignedHubId:
          null,

        fieldOfView:
          90,

        range:
          20,
      })

      return
    }

    /*
     * EQUIPMENT HUB TOOL
     */
    if (
      tool ===
      'equipmentHub'
    ) {
      const worldPoint =
        screenToWorld(
          pointer,
        )

      addEquipmentHub({
        id:
          uuidv4(),

        name:
          getNextRackName(),

        position:
          worldPoint,

        type:
          'rack',

        selected:
          false,
      })

      return
    }

    /*
     * Any remaining tool is ignored
     * unless it is Wall.
     */
    if (
      tool !== 'wall'
    ) {
      return
    }

    const worldPoint =
      screenToWorld(
        pointer,
      )

    /*
     * First wall click.
     */
    if (
      !wallStart
    ) {
      setWallStart(
        worldPoint,
      )

      setPreviewPoint(
        worldPoint,
      )

      return
    }

    /*
     * Prevent zero-length walls.
     */
    const zeroLength =
      wallStart.x ===
        worldPoint.x &&
      wallStart.y ===
        worldPoint.y

    if (
      zeroLength
    ) {
      return
    }

    /*
     * Second wall click.
     */
    addWall({
      id:
        uuidv4(),

      start:
        wallStart,

      end:
        worldPoint,

      thickness:
        5,

      selected:
        false,

      material:
        'Brick',

      height:
        3000,
    })

    setWallStart(null)

    setPreviewPoint(null)
  }

  function handleMouseMove():
    void {
    const pointer =
      getScreenPointer()

    if (!pointer) {
      return
    }

    /*
     * PAN
     */
    if (
      isPanning &&
      lastPanPointer.current
    ) {
      const movementX =
        pointer.x -
        lastPanPointer.current.x

      const movementY =
        pointer.y -
        lastPanPointer.current.y

      setOffset(
        offsetX +
          movementX,

        offsetY +
          movementY,
      )

      lastPanPointer.current =
        pointer

      return
    }

    /*
     * WALL PREVIEW
     */
    if (
      tool === 'wall' &&
      wallStart
    ) {
      setPreviewPoint(
        screenToWorld(
          pointer,
        ),
      )
    }
  }

  function stopPanning():
    void {
    lastPanPointer.current =
      null

    setPanning(false)
  }

  const cursor =
    isPanning
      ? 'grabbing'
      : tool === 'wall'
        ? 'crosshair'
        : tool ===
            'camera'
          ? 'copy'
          : tool ===
              'equipmentHub'
            ? 'copy'
            : 'default'

  return (
    <div
      ref={
        containerRef
      }
      style={{
        width: '100%',
        height: '100%',

        overflow:
          'hidden',

        background:
          '#202225',

        cursor,
      }}
    >
      <Stage
        ref={
          stageRef
        }

        width={
          size.width
        }

        height={
          size.height
        }

        onWheel={
          handleWheel
        }

        onMouseDown={
          handleMouseDown
        }

        onMouseMove={
          handleMouseMove
        }

        onMouseUp={
          stopPanning
        }

        onMouseLeave={
          stopPanning
        }
      >
        {/* CANVAS BACKGROUND */}

        <Layer
          listening={
            false
          }
        >
          <Rect
            name="canvas-background"

            x={0}
            y={0}

            width={
              size.width
            }

            height={
              size.height
            }

            fill="#202225"
          />
        </Layer>

        {/* CAD WORLD */}

        <Layer
          x={
            offsetX
          }

          y={
            offsetY
          }

          scaleX={
            zoom
          }

          scaleY={
            zoom
          }
        >
          <Grid
            gridSize={
              GRID_SIZE
            }
          />

          <WallLayer />

          {/*
           * Cable lines deliberately
           * render below cameras and
           * hubs.
           */}
          <CableLayer />

          <CameraLayer />

          <EquipmentHubLayer />

          <SelectionLayer />

          {/* WALL PREVIEW */}

          {wallStart &&
            previewPoint && (
              <>
                <Line
                  points={[
                    wallStart.x,
                    wallStart.y,
                    previewPoint.x,
                    previewPoint.y,
                  ]}

                  stroke="#39ff14"

                  strokeWidth={5}

                  dash={[
                    14,
                    8,
                  ]}

                  lineCap="round"

                  listening={
                    false
                  }
                />

                <Circle
                  x={
                    wallStart.x
                  }

                  y={
                    wallStart.y
                  }

                  radius={7}

                  fill="#39ff14"

                  listening={
                    false
                  }
                />

                <Circle
                  x={
                    previewPoint.x
                  }

                  y={
                    previewPoint.y
                  }

                  radius={7}

                  fill="#ffffff"

                  stroke="#39ff14"

                  strokeWidth={3}

                  listening={
                    false
                  }
                />

                <MeasurementLabel
                  start={
                    wallStart
                  }

                  end={
                    previewPoint
                  }
                />
              </>
            )}
        </Layer>
      </Stage>
    </div>
  )
}
