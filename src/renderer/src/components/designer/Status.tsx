import { useDesignerStore } from "../../store/designerStore";

export default function Status() {
  const tool = useDesignerStore((state) => state.tool);
  const zoom = useDesignerStore((state) => state.zoom);
  const isPanning = useDesignerStore(
    (state) => state.isPanning,
  );
  const wallStart = useDesignerStore(
    (state) => state.wallStart,
  );

  let message = `Active tool: ${tool}`;

  if (isPanning) {
    message = "Panning canvas...";
  } else if (tool === "wall" && wallStart) {
    message = "Wall started — click the second point";
  } else if (tool === "wall") {
    message = "Wall tool — click the first point";
  }

  return (
    <div
      style={{
        height: 28,
        flexShrink: 0,
        background: "#1b1b1b",
        borderTop: "1px solid #333",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 15px",
        color: "#999",
        fontSize: 12,
      }}
    >
      <span>{message}</span>

      <div
        style={{
          display: "flex",
          gap: 24,
        }}
      >
        <span>Snap: 25px</span>
        <span>Zoom: {Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
