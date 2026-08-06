import { useEffect, useRef, useState } from "react";
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

import Grid from "./Grid";
import WallLayer from "./WallLayer";

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

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const lastPanPointer = useRef<ScreenPoint | null>(null);

  const [size, setSize] = useState({
    width: 1,
    height: 1,
  });

  const [previewPoint, setPreviewPoint] =
    useState<Point | null>(null);

  const tool = useDesignerStore((state) => state.tool);
  const zoom = useDesignerStore((state) => state.zoom);
  const offsetX = useDesignerStore((state) => state.offsetX);
  const offsetY = useDesignerStore((state) => state.offsetY);
  const isPanning = useDesignerStore(
    (state) => state.isPanning,
  );
  const wallStart = useDesignerStore(
    (state) => state.wallStart,
  );

  const setZoom = useDesignerStore(
    (state) => state.setZoom,
  );
  const setOffset = useDesignerStore(
    (state) => state.setOffset,
  );
  const setPanning = useDesignerStore(
    (state) => state.setPanning,
  );
  const setWallStart = useDesignerStore(
    (state) => state.setWallStart,
  );
  const addWall = useDesignerStore(
    (state) => state.addWall,
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const updateSize = () => {
      setSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    /*
      Reset the viewport to the centre whenever this
      Canvas component starts.
    */
    setZoom(1);
    setOffset(size.width / 2, size.height / 2);
  }, [size.width, size.height, setZoom, setOffset]);

  useEffect(() => {
    if (tool !== "wall") {
      setWallStart(null);
      setPreviewPoint(null);
    }
  }, [tool, setWallStart]);

  const getScreenPointer = (): ScreenPoint | null => {
    const pointer =
      stageRef.current?.getPointerPosition();

    if (!pointer) return null;

    return {
      x: pointer.x,
      y: pointer.y,
    };
  };

  const screenToWorld = (
    pointer: ScreenPoint,
  ): Point => ({
    x: snapToGrid(
      (pointer.x - offsetX) / zoom,
    ),
    y: snapToGrid(
      (pointer.y - offsetY) / zoom,
    ),
  });

  const handleWheel = (
    event: KonvaEventObject<WheelEvent>,
  ) => {
    event.evt.preventDefault();

    const pointer = getScreenPointer();

    if (!pointer) return;

    const worldPoint = {
      x: (pointer.x - offsetX) / zoom,
      y: (pointer.y - offsetY) / zoom,
    };

    const requestedZoom =
      event.evt.deltaY < 0
        ? zoom * ZOOM_FACTOR
        : zoom / ZOOM_FACTOR;

    const newZoom = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, requestedZoom),
    );

    setZoom(newZoom);

    setOffset(
      pointer.x - worldPoint.x * newZoom,
      pointer.y - worldPoint.y * newZoom,
    );
  };

  const handleMouseDown = (
    event: KonvaEventObject<MouseEvent>,
  ) => {
    const pointer = getScreenPointer();

    if (!pointer) return;

    if (event.evt.button === 1) {
      event.evt.preventDefault();
      lastPanPointer.current = pointer;
      setPanning(true);
      return;
    }

    if (
      event.evt.button !== 0 ||
      tool !== "wall"
    ) {
      return;
    }

    const worldPoint = screenToWorld(pointer);

    if (!wallStart) {
      setWallStart(worldPoint);
      setPreviewPoint(worldPoint);
      return;
    }

    const zeroLength =
      wallStart.x === worldPoint.x &&
      wallStart.y === worldPoint.y;

    if (zeroLength) return;

    addWall({
      id: uuidv4(),
      start: wallStart,
      end: worldPoint,
      thickness: 5,
    });

    setWallStart(null);
    setPreviewPoint(null);
  };

  const handleMouseMove = () => {
    const pointer = getScreenPointer();

    if (!pointer) return;

    if (isPanning && lastPanPointer.current) {
      const movementX =
        pointer.x - lastPanPointer.current.x;
      const movementY =
        pointer.y - lastPanPointer.current.y;

      setOffset(
        offsetX + movementX,
        offsetY + movementY,
      );

      lastPanPointer.current = pointer;
      return;
    }

    if (tool === "wall" && wallStart) {
      setPreviewPoint(screenToWorld(pointer));
    }
  };

  const stopPanning = () => {
    lastPanPointer.current = null;
    setPanning(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#202225",
        cursor: isPanning
          ? "grabbing"
          : tool === "wall"
            ? "crosshair"
            : "default",
      }}
    >
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopPanning}
        onMouseLeave={stopPanning}
      >
        <Layer listening={false}>
          <Rect
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
          <Grid gridSize={GRID_SIZE} />

          <WallLayer />

          {wallStart && previewPoint && (
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
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
}
