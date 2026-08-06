import { Line } from "react-konva";

import { useDesignerStore } from "../../../store/designerStore";

export default function WallLayer() {
  const walls = useDesignerStore(
    (state) => state.walls,
  );

  const selectWall = useDesignerStore(
    (state) => state.selectWall,
  );

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
              ? "#FFD700"
              : "#FFFFFF"
          }
          strokeWidth={
            wall.selected
              ? wall.thickness + 2
              : wall.thickness
          }
          lineCap="round"
          lineJoin="round"
          hitStrokeWidth={20}
          onClick={(e) => {
            e.cancelBubble = true;
            selectWall(wall.id);
          }}
        />
      ))}
    </>
  );
}
