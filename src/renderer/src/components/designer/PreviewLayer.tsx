import { Circle, Line, Text } from "react-konva";
import type { Point } from "./types";

interface PreviewLayerProps {
  start: Point | null;
  end: Point | null;
}

export default function PreviewLayer({
  start,
  end,
}: PreviewLayerProps) {
  if (!start || !end) {
    return null;
  }

  return (
    <>
      <Line
        points={[
          start.x,
          start.y,
          end.x,
          end.y,
        ]}
        stroke="#39FF14"
        strokeWidth={5}
        dash={[14, 8]}
        lineCap="round"
        lineJoin="round"
        listening={false}
        shadowColor="#39FF14"
        shadowBlur={8}
        shadowOpacity={0.7}
      />

      <Circle
        x={start.x}
        y={start.y}
        radius={7}
        fill="#39FF14"
        listening={false}
      />

      <Circle
        x={end.x}
        y={end.y}
        radius={7}
        fill="#ffffff"
        stroke="#39FF14"
        strokeWidth={3}
        listening={false}
      />

      <Text
        x={end.x + 14}
        y={end.y - 22}
        text="WALL PREVIEW"
        fill="#39FF14"
        fontSize={13}
        fontStyle="bold"
        listening={false}
      />
    </>
  );
}
