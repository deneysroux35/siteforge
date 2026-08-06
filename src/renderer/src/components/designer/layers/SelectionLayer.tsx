import { Circle, Line } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";

import { useDesignerStore } from "../../../store/designerStore";

const GRID_SIZE = 25;

function snapToGrid(value: number): number {
  return (
    Math.round(value / GRID_SIZE) *
    GRID_SIZE
  );
}

export default function SelectionLayer() {
  const selectedWall =
    useDesignerStore((state) =>
      state.walls.find(
        (wall) => wall.selected,
      ),
    );

  const movingWallId =
    useDesignerStore(
      (state) => state.movingWallId,
    );

  const movingWallOffset =
    useDesignerStore(
      (state) => state.movingWallOffset,
    );

  const beginWallEdit =
    useDesignerStore(
      (state) => state.beginWallEdit,
    );

  const updateWallEndpoint =
    useDesignerStore(
      (state) =>
        state.updateWallEndpoint,
    );

  const finishWallEdit =
    useDesignerStore(
      (state) => state.finishWallEdit,
    );

  if (!selectedWall) {
    return null;
  }

  const wallIsMoving =
    movingWallId === selectedWall.id;

  const moveX = wallIsMoving
    ? movingWallOffset.x
    : 0;

  const moveY = wallIsMoving
    ? movingWallOffset.y
    : 0;

  const startX =
    selectedWall.start.x + moveX;

  const startY =
    selectedWall.start.y + moveY;

  const endX =
    selectedWall.end.x + moveX;

  const endY =
    selectedWall.end.y + moveY;

  const handleDragStart = (
    event: KonvaEventObject<DragEvent>,
  ) => {
    event.cancelBubble = true;
    beginWallEdit();
  };

  const handleStartDragMove = (
    event: KonvaEventObject<DragEvent>,
  ) => {
    event.cancelBubble = true;

    const x = snapToGrid(
      event.target.x(),
    );

    const y = snapToGrid(
      event.target.y(),
    );

    event.target.position({
      x,
      y,
    });

    updateWallEndpoint(
      selectedWall.id,
      "start",
      { x, y },
    );
  };

  const handleEndDragMove = (
    event: KonvaEventObject<DragEvent>,
  ) => {
    event.cancelBubble = true;

    const x = snapToGrid(
      event.target.x(),
    );

    const y = snapToGrid(
      event.target.y(),
    );

    event.target.position({
      x,
      y,
    });

    updateWallEndpoint(
      selectedWall.id,
      "end",
      { x, y },
    );
  };

  const handleDragEnd = (
    event: KonvaEventObject<DragEvent>,
  ) => {
    event.cancelBubble = true;
    finishWallEdit();
  };

  return (
    <>
      <Line
        points={[
          startX,
          startY,
          endX,
          endY,
        ]}
        stroke="#39ff14"
        strokeWidth={
          selectedWall.thickness + 6
        }
        opacity={0.35}
        lineCap="round"
        listening={false}
      />

      {!wallIsMoving && (
        <>
          <Circle
            x={selectedWall.start.x}
            y={selectedWall.start.y}
            radius={14}
            fill="#39ff14"
            stroke="#ffffff"
            strokeWidth={4}
            shadowColor="#39ff14"
            shadowBlur={12}
            draggable
            onMouseDown={(event) => {
              event.cancelBubble = true;
            }}
            onDragStart={handleDragStart}
            onDragMove={
              handleStartDragMove
            }
            onDragEnd={handleDragEnd}
          />

          <Circle
            x={selectedWall.end.x}
            y={selectedWall.end.y}
            radius={14}
            fill="#39ff14"
            stroke="#ffffff"
            strokeWidth={4}
            shadowColor="#39ff14"
            shadowBlur={12}
            draggable
            onMouseDown={(event) => {
              event.cancelBubble = true;
            }}
            onDragStart={handleDragStart}
            onDragMove={
              handleEndDragMove
            }
            onDragEnd={handleDragEnd}
          />
        </>
      )}
    </>
  );
}
