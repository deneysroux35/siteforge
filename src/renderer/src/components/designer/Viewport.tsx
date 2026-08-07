import type { ReactNode } from "react";
import { Group } from "react-konva";

interface ViewportProps {
  zoom: number;
  offsetX: number;
  offsetY: number;
  children: ReactNode;
}

export default function Viewport({
  zoom,
  offsetX,
  offsetY,
  children,
}: ViewportProps) {
  return (
    <Group
      x={offsetX}
      y={offsetY}
      scaleX={zoom}
      scaleY={zoom}
    >
      {children}
    </Group>
  );
}
