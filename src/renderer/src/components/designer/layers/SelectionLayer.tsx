import { Circle, Line } from "react-konva";
import { useDesignerStore } from "../../../store/designerStore";

export default function SelectionLayer() {
  const selectedWall = useDesignerStore((state) =>
    state.walls.find((wall) => wall.selected),
  );

  if (!selectedWall) {
    return null;
  }

  return (
    <>
      {/* Selection highlight */}
      <Line
        points={[
          selectedWall.start.x,
          selectedWall.start.y,
          selectedWall.end.x,
          selectedWall.end.y,
        ]}
        stroke="#ffd700"
        strokeWidth={selectedWall.thickness + 3}
        opacity={0.45}
        lineCap="round"
        listening={false}
      />

      {/* Start handle */}
      <Circle
        x={selectedWall.start.x}
        y={selectedWall.start.y}
        radius={9}
        fill="#ffffff"
        stroke="#ffd700"
        strokeWidth={3}
        listening={false}
      />

      {/* End handle */}
      <Circle
        x={selectedWall.end.x}
        y={selectedWall.end.y}
        radius={9}
        fill="#ffffff"
        stroke="#ffd700"
        strokeWidth={3}
        listening={false}
      />
    </>
  );
}
