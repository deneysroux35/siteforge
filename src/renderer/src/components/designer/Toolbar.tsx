import { useEffect, type CSSProperties } from "react";
import {
  Camera,
  DoorOpen,
  MousePointer2,
  Square,
} from "lucide-react";

import { useDesignerStore } from "../../store/designerStore";
import type { Tool } from "./types";

interface ToolDefinition {
  id: Tool;
  label: string;
  shortcut: string;
  icon: typeof MousePointer2;
}

const tools: ToolDefinition[] = [
  {
    id: "select",
    label: "Select",
    shortcut: "V",
    icon: MousePointer2,
  },
  {
    id: "wall",
    label: "Wall",
    shortcut: "W",
    icon: Square,
  },
  {
    id: "door",
    label: "Door",
    shortcut: "D",
    icon: DoorOpen,
  },
  {
    id: "camera",
    label: "Camera",
    shortcut: "C",
    icon: Camera,
  },
];

const dockButtonStyle: CSSProperties = {
  width: 58,
  height: 58,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  borderRadius: 9,
  cursor: "pointer",
  transition:
    "background 140ms ease, border-color 140ms ease, color 140ms ease, box-shadow 140ms ease, transform 140ms ease",
};

export default function Toolbar() {
  const tool = useDesignerStore((state) => state.tool);

  const setTool = useDesignerStore(
    (state) => state.setTool,
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target =
        event.target as HTMLElement | null;

      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (
        isTyping ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return;
      }

      const pressedKey =
        event.key.toLowerCase();

      if (pressedKey === "v") {
        setTool("select");
      }

      if (pressedKey === "w") {
        setTool("wall");
      }

      if (pressedKey === "d") {
        setTool("door");
      }

      if (pressedKey === "c") {
        setTool("camera");
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [setTool]);

  return (
    <aside
      style={{
        width: 76,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "12px 8px",
        background: "#14171c",
        borderRight: "1px solid #2e3440",
        overflowY: "auto",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: 42,
          height: 3,
          marginBottom: 4,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, transparent, #39ff14, transparent)",
          boxShadow:
            "0 0 12px rgba(57, 255, 20, 0.45)",
        }}
      />

      {tools.map((item) => {
        const Icon = item.icon;
        const active = tool === item.id;

        return (
          <button
            key={item.id}
            type="button"
            title={`${item.label} (${item.shortcut})`}
            aria-label={`${item.label} tool`}
            aria-pressed={active}
            onClick={() =>
              setTool(item.id)
            }
            onMouseEnter={(event) => {
              if (active) {
                return;
              }

              event.currentTarget.style.background =
                "#242a33";

              event.currentTarget.style.borderColor =
                "#46505f";

              event.currentTarget.style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(event) => {
              if (active) {
                return;
              }

              event.currentTarget.style.background =
                "transparent";

              event.currentTarget.style.borderColor =
                "transparent";

              event.currentTarget.style.transform =
                "translateY(0)";
            }}
            style={{
              ...dockButtonStyle,

              background: active
                ? "linear-gradient(180deg, #39ff14, #22d80b)"
                : "transparent",

              color: active
                ? "#071007"
                : "#b7bec8",

              border: active
                ? "1px solid #6dff55"
                : "1px solid transparent",

              boxShadow: active
                ? "0 0 18px rgba(57, 255, 20, 0.28)"
                : "none",
            }}
          >
            <Icon size={22} strokeWidth={2} />

            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 800 : 600,
                lineHeight: 1,
              }}
            >
              {item.label}
            </span>

            <span
              style={{
                position: "absolute",
                pointerEvents: "none",
                opacity: 0,
              }}
            >
              {item.shortcut}
            </span>
          </button>
        );
      })}

      <div
        style={{
          width: 44,
          height: 1,
          margin: "6px 0",
          background: "#2e3440",
        }}
      />

      <div
        style={{
          width: 54,
          padding: "7px 4px",
          borderRadius: 7,
          background: "#1b1f26",
          border: "1px solid #2e3440",
          color: "#7c8591",
          fontSize: 9,
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        <div>
          V Select
        </div>

        <div>
          W Wall
        </div>

        <div>
          C Camera
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          width: 48,
          padding: "7px 3px",
          borderRadius: 7,
          background: "#101216",
          border: "1px solid #272d37",
          color: "#39ff14",
          fontSize: 9,
          fontWeight: 700,
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        {tool}
      </div>
    </aside>
  );
}
