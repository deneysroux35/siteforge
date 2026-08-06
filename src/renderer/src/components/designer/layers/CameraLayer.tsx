import {
  Circle,
  Group,
  Line,
  Rect,
} from "react-konva";

import type { KonvaEventObject } from "konva/lib/Node";

import { useDesignerStore } from "../../../store/designerStore";

const GRID_SIZE = 25;

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export default function CameraLayer() {
  const tool = useDesignerStore(
    (state) => state.tool,
  );

  const cameras = useDesignerStore(
    (state) => state.cameras,
  );

  const selectCamera =
    useDesignerStore(
      (state) =>
        state.selectCamera,
    );

  const beginCameraMove =
    useDesignerStore(
      (state) =>
        state.beginCameraMove,
    );

  const updateCameraPosition =
    useDesignerStore(
      (state) =>
        state.updateCameraPosition,
    );

  const finishCameraMove =
    useDesignerStore(
      (state) =>
        state.finishCameraMove,
    );

  const handleDragStart = (
    event: KonvaEventObject<DragEvent>,
    cameraId: string,
  ) => {
    event.cancelBubble = true;

    selectCamera(cameraId);
    beginCameraMove();
  };

  const handleDragMove = (
    event: KonvaEventObject<DragEvent>,
    cameraId: string,
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

    updateCameraPosition(
      cameraId,
      { x, y },
    );
  };

  const handleDragEnd = (
    event: KonvaEventObject<DragEvent>,
  ) => {
    event.cancelBubble = true;
    finishCameraMove();
  };

  return (
    <>
      {cameras.map((camera) => (
        <Group
          key={camera.id}
          x={camera.position.x}
          y={camera.position.y}
          rotation={camera.rotation}
          draggable={
            tool === "select"
          }
          dragDistance={3}
          onMouseDown={(event) => {
            event.cancelBubble = true;

            if (tool === "select") {
              selectCamera(
                camera.id,
              );
            }
          }}
          onClick={(event) => {
            event.cancelBubble = true;

            if (tool === "select") {
              selectCamera(
                camera.id,
              );
            }
          }}
          onDragStart={(event) =>
            handleDragStart(
              event,
              camera.id,
            )
          }
          onDragMove={(event) =>
            handleDragMove(
              event,
              camera.id,
            )
          }
          onDragEnd={
            handleDragEnd
          }
        >
          {camera.selected && (
            <Circle
              x={0}
              y={0}
              radius={30}
              fill="transparent"
              stroke="#ffd700"
              strokeWidth={3}
              dash={[7, 5]}
              listening={false}
            />
          )}

          <Line
            points={[
              -18,
              0,
              -7,
              0,
            ]}
            stroke="#ffffff"
            strokeWidth={4}
            lineCap="round"
          />

          <Rect
            x={-7}
            y={-8}
            width={27}
            height={16}
            fill={
              camera.selected
                ? "#ffd700"
                : "#d9e2e8"
            }
            stroke="#39ff14"
            strokeWidth={2}
            cornerRadius={4}
          />

          <Circle
            x={20}
            y={0}
            radius={7}
            fill="#101820"
            stroke="#39ff14"
            strokeWidth={2}
          />

          <Circle
            x={-18}
            y={0}
            radius={5}
            fill="#39ff14"
          />
        </Group>
      ))}
    </>
  );
}
