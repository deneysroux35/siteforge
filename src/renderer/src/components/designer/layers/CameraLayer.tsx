import {
  Circle,
  Group,
  Line,
  Rect,
} from "react-konva";

import { useDesignerStore } from "../../../store/designerStore";

export default function CameraLayer() {
  const cameras = useDesignerStore(
    (state) => state.cameras,
  );

  return (
    <>
      {cameras.map((camera) => (
        <Group
          key={camera.id}
          x={camera.position.x}
          y={camera.position.y}
          rotation={camera.rotation}
          listening={false}
        >
          {/* Camera mounting arm */}
          <Line
            points={[-18, 0, -7, 0]}
            stroke="#ffffff"
            strokeWidth={4}
            lineCap="round"
          />

          {/* Camera body */}
          <Rect
            x={-7}
            y={-8}
            width={27}
            height={16}
            fill="#d9e2e8"
            stroke="#39ff14"
            strokeWidth={2}
            cornerRadius={4}
          />

          {/* Camera lens */}
          <Circle
            x={20}
            y={0}
            radius={7}
            fill="#101820"
            stroke="#39ff14"
            strokeWidth={2}
          />

          {/* Mounting point */}
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
