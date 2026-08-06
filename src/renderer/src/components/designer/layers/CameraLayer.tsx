import {
  Circle,
  Group,
  Line,
  Rect,
  Text,
} from "react-konva";

import type { KonvaEventObject } from "konva/lib/Node";

import { useDesignerStore } from "../../../store/designerStore";

const GRID_SIZE = 25;
const PIXELS_PER_METRE = 50;
const CONE_SEGMENTS = 32;
const ROTATION_HANDLE_DISTANCE = 70;

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

function normaliseAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

function createCoveragePoints(
  fieldOfView: number,
  radius: number,
): number[] {
  const points: number[] = [20, 0];

  const startAngle = -fieldOfView / 2;
  const angleStep =
    fieldOfView / CONE_SEGMENTS;

  for (
    let index = 0;
    index <= CONE_SEGMENTS;
    index += 1
  ) {
    const angleDegrees =
      startAngle + angleStep * index;

    const angleRadians =
      angleDegrees *
      (Math.PI / 180);

    points.push(
      20 +
        Math.cos(angleRadians) *
          radius,

      Math.sin(angleRadians) *
        radius,
    );
  }

  return points;
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

  const beginCameraEdit =
    useDesignerStore(
      (state) =>
        state.beginCameraEdit,
    );

  const updateCameraPosition =
    useDesignerStore(
      (state) =>
        state.updateCameraPosition,
    );

  const updateCameraRotation =
    useDesignerStore(
      (state) =>
        state.updateCameraRotation,
    );

  const finishCameraEdit =
    useDesignerStore(
      (state) =>
        state.finishCameraEdit,
    );

  const handleCameraDragStart = (
    event: KonvaEventObject<DragEvent>,
    cameraId: string,
  ) => {
    event.cancelBubble = true;

    selectCamera(cameraId);
    beginCameraEdit();
  };

  const handleCameraDragMove = (
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

  const handleCameraDragEnd = (
    event: KonvaEventObject<DragEvent>,
  ) => {
    event.cancelBubble = true;
    finishCameraEdit();
  };

  const handleRotationStart = (
    event: KonvaEventObject<DragEvent>,
    cameraId: string,
  ) => {
    event.cancelBubble = true;

    selectCamera(cameraId);
    beginCameraEdit();
  };

  const handleRotationMove = (
    event: KonvaEventObject<DragEvent>,
    cameraId: string,
    cameraX: number,
    cameraY: number,
  ) => {
    event.cancelBubble = true;

    const handleX = event.target.x();
    const handleY = event.target.y();

    const deltaX =
      handleX - cameraX;

    const deltaY =
      handleY - cameraY;

    let angle =
      Math.atan2(deltaY, deltaX) *
      (180 / Math.PI);

    if (event.evt.shiftKey) {
      angle =
        Math.round(angle / 5) * 5;
    }

    const normalised =
      normaliseAngle(angle);

    updateCameraRotation(
      cameraId,
      normalised,
    );

    const radians =
      normalised *
      (Math.PI / 180);

    event.target.position({
      x:
        cameraX +
        Math.cos(radians) *
          ROTATION_HANDLE_DISTANCE,

      y:
        cameraY +
        Math.sin(radians) *
          ROTATION_HANDLE_DISTANCE,
    });
  };

  const handleRotationEnd = (
    event: KonvaEventObject<DragEvent>,
  ) => {
    event.cancelBubble = true;
    finishCameraEdit();
  };

  return (
    <>
      {cameras.map((camera) => {
        const coverageRadius =
          camera.range *
          PIXELS_PER_METRE;

        const coveragePoints =
          createCoveragePoints(
            camera.fieldOfView,
            coverageRadius,
          );

        const coverageColour =
          camera.selected
            ? "#39ff14"
            : "#00d9ff";

        const rotationRadians =
          camera.rotation *
          (Math.PI / 180);

        const handleX =
          camera.position.x +
          Math.cos(rotationRadians) *
            ROTATION_HANDLE_DISTANCE;

        const handleY =
          camera.position.y +
          Math.sin(rotationRadians) *
            ROTATION_HANDLE_DISTANCE;

        return (
          <Group key={camera.id}>
            {/* Rotating camera and cone */}
            <Group
              x={camera.position.x}
              y={camera.position.y}
              rotation={camera.rotation}
              draggable={
                tool === "select"
              }
              dragDistance={3}
              onMouseDown={(event) => {
                event.cancelBubble = true;

                if (
                  tool === "select"
                ) {
                  selectCamera(
                    camera.id,
                  );
                }
              }}
              onClick={(event) => {
                event.cancelBubble = true;

                if (
                  tool === "select"
                ) {
                  selectCamera(
                    camera.id,
                  );
                }
              }}
              onDragStart={(event) =>
                handleCameraDragStart(
                  event,
                  camera.id,
                )
              }
              onDragMove={(event) =>
                handleCameraDragMove(
                  event,
                  camera.id,
                )
              }
              onDragEnd={
                handleCameraDragEnd
              }
            >
              <Line
                points={coveragePoints}
                closed
                fill={coverageColour}
                opacity={
                  camera.selected
                    ? 0.28
                    : 0.16
                }
                stroke={coverageColour}
                strokeWidth={
                  camera.selected
                    ? 3
                    : 2
                }
                lineJoin="round"
                listening={false}
              />

              <Line
                points={[
                  20,
                  0,
                  20 +
                    coverageRadius,
                  0,
                ]}
                stroke={
                  coverageColour
                }
                strokeWidth={2}
                dash={[12, 8]}
                opacity={0.9}
                listening={false}
              />

              {camera.selected && (
                <Circle
                  x={0}
                  y={0}
                  radius={32}
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

            {/* Rotation controls */}
            {camera.selected &&
              tool === "select" && (
                <>
                  <Line
                    points={[
                      camera.position.x,
                      camera.position.y,
                      handleX,
                      handleY,
                    ]}
                    stroke="#ffd700"
                    strokeWidth={2}
                    dash={[6, 5]}
                    listening={false}
                  />

                  <Circle
                    x={handleX}
                    y={handleY}
                    radius={12}
                    fill="#ffd700"
                    stroke="#ffffff"
                    strokeWidth={3}
                    shadowColor="#ffd700"
                    shadowBlur={10}
                    draggable
                    onMouseDown={(
                      event,
                    ) => {
                      event.cancelBubble =
                        true;
                    }}
                    onDragStart={(
                      event,
                    ) =>
                      handleRotationStart(
                        event,
                        camera.id,
                      )
                    }
                    onDragMove={(
                      event,
                    ) =>
                      handleRotationMove(
                        event,
                        camera.id,
                        camera.position.x,
                        camera.position.y,
                      )
                    }
                    onDragEnd={
                      handleRotationEnd
                    }
                  />

                  <Text
                    x={handleX + 16}
                    y={handleY - 9}
                    text={`${Math.round(
                      camera.rotation,
                    )}°`}
                    fill="#ffd700"
                    fontSize={14}
                    fontStyle="bold"
                    listening={false}
                  />
                </>
              )}
          </Group>
        );
      })}
    </>
  );
}
