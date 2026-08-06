import { Line } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";

import { useDesignerStore } from "../../../store/designerStore";

const GRID_SIZE = 25;

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export default function WallLayer() {
  const tool = useDesignerStore((state) => state.tool);
  const walls = useDesignerStore((state) => state.walls);

  const selectWall = useDesignerStore(
    (state) => state.selectWall,
  );

  const beginWallMove = useDesignerStore(
    (state) => state.beginWallMove,
  );

  const updateWallMoveOffset = useDesignerStore(
    (state) => state.updateWallMoveOffset,
  );

  const finishWallMove = useDesignerStore(
    (state) => state.finishWallMove,
  );

  const handleDragStart = (
    event: KonvaEventObject<DragEvent>,
    wallId: string,
  ) => {
    event.cancelBubble = true;

    selectWall(wallId);
    beginWallMove(wallId);
  };

  const handleDragMove = (
    event: KonvaEventObject<DragEvent>,
  ) => {
    event.cancelBubble = true;

    const moveX = snapToGrid(event.target.x());
    const moveY = snapToGrid(event.target.y());

    event.target.position({
      x: moveX,
      y: moveY,
    });

    updateWallMoveOffset(moveX, moveY);
  };

  const handleDragEnd = (
    event: KonvaEventObject<DragEvent>,
    wallId: string,
  ) => {
    event.cancelBubble = true;

    const moveX = snapToGrid(event.target.x());
    const moveY = snapToGrid(event.target.y());

    // Reset the temporary Konva node position.
    event.target.position({
      x: 0,
      y: 0,
    });

    // Save the movement into the wall coordinates.
    finishWallMove(
      wallId,
      moveX,
      moveY,
    );
  };

  return (
    <>
      {walls.map((wall) => (
        <Line
          key={wall.id}
          points={[
            wall.start.x,
            wall.start.y,
            wall.end.x,
            wall.end.y,
          ]}
          stroke={
            wall.selected
              ? "#ffd700"
              : "#ffffff"
          }
          strokeWidth={
            wall.selected
              ? wall.thickness + 2
              : wall.thickness
          }
          lineCap="round"
          lineJoin="round"
          hitStrokeWidth={30}
          draggable={tool === "select"}
          dragDistance={3}
          onClick={(event) => {
            event.cancelBubble = true;

            if (tool === "select") {
              selectWall(wall.id);
            }
          }}
          onMouseDown={(event) => {
            event.cancelBubble = true;

            if (tool === "select") {
              selectWall(wall.id);
            }
          }}
          onDragStart={(event) =>
            handleDragStart(
              event,
              wall.id,
            )
          }
          onDragMove={handleDragMove}
          onDragEnd={(event) =>
            handleDragEnd(
              event,
              wall.id,
            )
          }
        />
      ))}
    </>
  );
}
