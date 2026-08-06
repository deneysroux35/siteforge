import { Line } from "react-konva";
import type { ReactNode } from "react";

interface GridProps {
  gridSize?: number;
  extent?: number;
}

export default function Grid({
  gridSize = 25,
  extent = 5000,
}: GridProps) {
  const lines: ReactNode[] = [];

  for (let x = -extent; x <= extent; x += gridSize) {
    lines.push(
      <Line
        key={`vertical-${x}`}
        points={[x, -extent, x, extent]}
        stroke={x === 0 ? "#555" : "#303338"}
        strokeWidth={x === 0 ? 2 : 1}
        listening={false}
      />,
    );
  }

  for (let y = -extent; y <= extent; y += gridSize) {
    lines.push(
      <Line
        key={`horizontal-${y}`}
        points={[-extent, y, extent, y]}
        stroke={y === 0 ? "#555" : "#303338"}
        strokeWidth={y === 0 ? 2 : 1}
        listening={false}
      />,
    );
  }

  return <>{lines}</>;
}
