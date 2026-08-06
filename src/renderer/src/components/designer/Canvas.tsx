import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Circle,
  Layer,
  Line,
  Rect,
  Stage,
} from "react-konva";

import type { KonvaEventObject } from "konva/lib/Node";
import type Konva from "konva";

import { v4 as uuidv4 } from "uuid";

import CameraLayer from "./layers/CameraLayer";
import Grid from "./layers/Grid";
import MeasurementLabel from "./layers/MeasurementLabel";
import SelectionLayer from "./layers/SelectionLayer";
import WallLayer from "./layers/WallLayer";

import { useDesignerStore } from "../../store/designerStore";

import type { Point } from "./types";

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 5;
const ZOOM_FACTOR = 1.1;
const GRID_SIZE = 25;

interface ScreenPoint {
  x: number;
  y: number;
}

function snapToGrid(
  value: number,
): number {
  return (
    Math.round(
      value / GRID_SIZE,
    ) * GRID_SIZE
  );
}

export default function Canvas() {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const stageRef =
    useRef<Konva.Stage>(null);

  const lastPanPointer =
    useRef<ScreenPoint | null>(
      null,
    );

  const [size, setSize] =
    useState({
      width: 1,
      height: 1,
    });

  const [
    previewPoint,
    setPreviewPoint,
  ] = useState<Point | null>(
    null,
  );

  const tool = useDesignerStore(
    (state) => state.tool,
  );

  const zoom = useDesignerStore(
    (state) => state.zoom,
  );

  const offsetX =
    useDesignerStore(
      (state) => state.offsetX,
    );

  const offsetY =
    useDesignerStore(
      (state) => state.offsetY,
    );

  const isPanning =
    useDesignerStore(
      (state) =>
        state.isPanning,
    );

  const wallStart =
    useDesignerStore(
      (state) =>
        state.wallStart,
    );

  const setZoom =
    useDesignerStore(
      (state) => state.setZoom,
    );

  const setOffset =
    useDesignerStore(
      (state) =>
        state.setOffset,
    );

  const setPanning =
    useDesignerStore(
      (state) =>
        state.setPanning,
    );

  const setWallStart =
    useDesignerStore(
      (state) =>
        state.setWallStart,
    );

  const addWall =
    useDesignerStore(
      (state) => state.addWall,
    );

  const addCamera =
    useDesignerStore(
      (state) =>
        state.addCamera,
    );

  const clearSelection =
    useDesignerStore(
      (state) =>
        state.clearSelection,
    );

  const deleteSelectedObject =
    useDesignerStore(
      (state) =>
        state.deleteSelectedObject,
    );

  const undo = useDesignerStore(
    (state) => state.undo,
  );

  const redo = useDesignerStore(
    (state) => state.redo,
  );

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    const updateSize = () => {
      setSize({
        width:
          container.clientWidth,
        height:
          container.clientHeight,
      });
    };

    updateSize();

    const observer =
      new ResizeObserver(
        updateSize,
      );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setZoom(1);

    setOffset(
      size.width / 2,
      size.height / 2,
    );
  }, [
    size.width,
    size.height,
    setZoom,
    setOffset,
  ]);

  useEffect(() => {
    if (tool !== "wall") {
      setWallStart(null);
      setPreviewPoint(null);
    }
  }, [
    tool,
    setWallStart,
  ]);

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const target =
        event.target as
          | HTMLElement
          | null;

      const isTyping =
        target?.tagName ===
          "INPUT" ||
        target?.tagName ===
          "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) {
        return;
      }

      const modifierPressed =
        event.ctrlKey ||
        event.metaKey;

      if (
        modifierPressed &&
        event.shiftKey &&
        event.key.toLowerCase() ===
          "z"
      ) {
        event.preventDefault();
        redo();
        return;
      }

      if (
        modifierPressed &&
        event.key.toLowerCase() ===
          "z"
      ) {
        event.preventDefault();
        undo();
        return;
      }

      if (
        modifierPressed &&
        event.key.toLowerCase() ===
          "y"
      ) {
        event.preventDefault();
        redo();
        return;
      }

      if (
        event.key === "Delete" ||
        event.key === "Backspace"
      ) {
        event.preventDefault();

        deleteSelectedObject();
        return;
      }

      if (
        event.key === "Escape"
      ) {
        event.preventDefault();

        setWallStart(null);
        setPreviewPoint(null);
        clearSelection();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    clearSelection,
    deleteSelectedObject,
    redo,
    setWallStart,
    undo,
  ]);

  const getScreenPointer =
    (): ScreenPoint | null => {
      const pointer =
        stageRef.current
          ?.getPointerPosition();

      if (!pointer) {
        return null;
      }

      return {
        x: pointer.x,
        y: pointer.y,
      };
    };

  const screenToWorld = (
    pointer: ScreenPoint,
  ): Point => ({
    x: snapToGrid(
      (pointer.x - offsetX) /
        zoom,
    ),

    y: snapToGrid(
      (pointer.y - offsetY) /
        zoom,
    ),
  });

  const handleWheel = (
    event:
      KonvaEventObject<WheelEvent>,
  ) => {
    event.evt.preventDefault();

    const pointer =
      getScreenPointer();

    if (!pointer) {
      return;
    }

    const worldPoint = {
      x:
        (pointer.x - offsetX) /
        zoom,

      y:
        (pointer.y - offsetY) /
        zoom,
    };

    const requestedZoom =
      event.evt.deltaY < 0
        ? zoom * ZOOM_FACTOR
        : zoom / ZOOM_FACTOR;

    const newZoom = Math.min(
      MAX_ZOOM,
      Math.max(
        MIN_ZOOM,
        requestedZoom,
      ),
    );

    setZoom(newZoom);

    setOffset(
      pointer.x -
        worldPoint.x *
          newZoom,

      pointer.y -
        worldPoint.y *
          newZoom,
    );
  };

  const handleMouseDown = (
    event:
      KonvaEventObject<MouseEvent>,
  ) => {
    const pointer =
      getScreenPointer();

    if (!pointer) {
      return;
    }

    if (
      event.evt.button === 1
    ) {
      event.evt.preventDefault();

      lastPanPointer.current =
        pointer;

      setPanning(true);
      return;
    }

    if (
      event.evt.button !== 0
    ) {
      return;
    }

    if (tool === "select") {
      const clickedStage =
        event.target ===
        event.target.getStage();

      const clickedBackground =
        event.target.name() ===
        "canvas-background";

      if (
        clickedStage ||
        clickedBackground
      ) {
        clearSelection();
      }

      return;
    }

    if (tool === "camera") {
      const worldPoint =
        screenToWorld(pointer);

      addCamera({
        id: uuidv4(),
        position: worldPoint,
        rotation: 0,
        selected: false,
        name: "Camera",
        fieldOfView: 90,
        range: 20,
      });

      return;
    }

    if (tool !== "wall") {
      return;
    }

    const worldPoint =
      screenToWorld(pointer);

    if (!wallStart) {
      setWallStart(worldPoint);
      setPreviewPoint(
        worldPoint,
      );
      return;
    }

    const zeroLength =
      wallStart.x ===
        worldPoint.x &&
      wallStart.y ===
        worldPoint.y;

    if (zeroLength) {
      return;
    }

    addWall({
      id: uuidv4(),
      start: wallStart,
      end: worldPoint,
      thickness: 5,
      selected: false,
      material: "Brick",
      height: 3000,
    });

    setWallStart(null);
    setPreviewPoint(null);
  };

  const handleMouseMove =
    () => {
      const pointer =
        getScreenPointer();

      if (!pointer) {
        return;
      }

      if (
        isPanning &&
        lastPanPointer.current
      ) {
        const movementX =
          pointer.x -
          lastPanPointer.current.x;

        const movementY =
          pointer.y -
          lastPanPointer.current.y;

        setOffset(
          offsetX + movementX,
          offsetY + movementY,
        );

        lastPanPointer.current =
          pointer;

        return;
      }

      if (
        tool === "wall" &&
        wallStart
      ) {
        setPreviewPoint(
          screenToWorld(pointer),
        );
      }
    };

  const stopPanning = () => {
    lastPanPointer.current =
      null;

    setPanning(false);
  };

  const cursor = isPanning
    ? "grabbing"
    : tool === "wall"
      ? "crosshair"
      : tool === "camera"
        ? "copy"
        : "default";

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#202225",
        cursor,
      }}
    >
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        onWheel={handleWheel}
        onMouseDown={
          handleMouseDown
        }
        onMouseMove={
          handleMouseMove
        }
        onMouseUp={stopPanning}
        onMouseLeave={
          stopPanning
        }
      >
        <Layer
          listening={false}
        >
          <Rect
            name="canvas-background"
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            fill="#202225"
          />
        </Layer>

        <Layer
          x={offsetX}
          y={offsetY}
          scaleX={zoom}
          scaleY={zoom}
        >
          <Grid
            gridSize={GRID_SIZE}
          />

          <WallLayer />

          <CameraLayer />

          <SelectionLayer />

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
                  dash={[14, 8]}
                  lineCap="round"
                  listening={false}
                />

                <Circle
                  x={wallStart.x}
                  y={wallStart.y}
                  radius={7}
                  fill="#39ff14"
                  listening={false}
                />

                <Circle
                  x={previewPoint.x}
                  y={previewPoint.y}
                  radius={7}
                  fill="#ffffff"
                  stroke="#39ff14"
                  strokeWidth={3}
                  listening={false}
                />

                <MeasurementLabel
                  start={wallStart}
                  end={previewPoint}
                />
              </>
            )}
        </Layer>
      </Stage>
    </div>
  );
}
