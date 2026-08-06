import { MousePointer2, Square, DoorOpen, Camera } from "lucide-react";
import { useDesignerStore } from "../../store/designerStore";
import { Tool } from "./types";

const tools = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "wall", label: "Wall", icon: Square },
  { id: "door", label: "Door", icon: DoorOpen },
  { id: "camera", label: "Camera", icon: Camera },
];

export default function Toolbar() {
  const tool = useDesignerStore((s) => s.tool);
  const setTool = useDesignerStore((s) => s.setTool);

  return (
    <div
      style={{
        height: 50,
        background: "#1d1d1d",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 12px",
        borderBottom: "1px solid #333",
      }}
    >
      {tools.map((t) => {
        const Icon = t.icon;

        return (
          <button
            key={t.id}
            onClick={() => setTool(t.id as Tool)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              background: tool === t.id ? "#00BCD4" : "transparent",
              color: tool === t.id ? "#111" : "#ddd",
            }}
          >
            <Icon size={18} />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
