import { Group, Rect, Text } from "react-konva";
import type { Point } from "./types";

interface MeasurementLabelProps {
  start: Point | null;
  end: Point | null;
}

const PIXELS_PER_METRE = 50;

export default function MeasurementLabel({
  start,
  end,
}: MeasurementLabelProps) {
  if (!start || !end) {
    return null;
  }

  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;

  const lengthPixels = Math.hypot(deltaX, deltaY);
  const lengthMetres = lengthPixels / PIXELS_PER_METRE;

  let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  if (angle < 0) {
    angle += 360;
  }

  const middleX = (start.x + end.x) / 2;
  const middleY = (start.y + end.y) / 2;

  const label = `${lengthMetres.toFixed(2)} m   ${angle.toFixed(0)}°`;
  const labelWidth = Math.max(110, label.length * 7 + 18);

  return (
    <Group
      x={middleX - labelWidth / 2}
      y={middleY - 38}
      listening={false}
    >
      <Rect
        width={labelWidth}
        height={26}
        fill="#101510"
        stroke="#39ff14"
        strokeWidth={1}
        cornerRadius={5}
        opacity={0.95}
      />

      <Text
        width={labelWidth}
        height={26}
        text={label}
        fill="#39ff14"
        fontSize={13}
        fontStyle="bold"
        align="center"
        verticalAlign="middle"
      />
    </Group>
  );
}
