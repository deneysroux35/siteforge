import { Line } from "react-konva";
import { useDesignerStore } from "../../store/designerStore";

export default function WallLayer() {
  const walls = useDesignerStore((state) => state.walls);

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
          stroke="#00bcd4"
          strokeWidth={wall.thickness}
          lineCap="round"
          lineJoin="round"
        />
      ))}
    </>
  );
}
