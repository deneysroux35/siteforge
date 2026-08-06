import { MousePointer2, Camera, Minus, ZoomIn } from "lucide-react";
import { useDesignerStore } from "../../store/designerStore";

export default function StatusBar() {
  const zoom = useDesignerStore((state) => state.zoom);

  const walls = useDesignerStore((state) => state.walls);

  const cameras = useDesignerStore((state) => state.cameras);

  const selectedWall = walls.find(
    (wall) => wall.selected,
  );

  const selectedCamera = cameras.find(
    (camera) => camera.selected,
  );

  let selection = "None";

  if (selectedWall) {
    selection = "Wall";
  }

  if (selectedCamera) {
    selection = selectedCamera.name;
  }

  return (
    <footer
      style={{
        height: 38,
        background: "#14171c",
        borderTop: "1px solid #2e3440",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
        color: "#b8c0cc",
        fontSize: 12,
        userSelect: "none",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Left Side */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ZoomIn size={14} color="#39ff14" />

          <span>
            Zoom{" "}
            <strong
              style={{
                color: "#ffffff",
              }}
            >
              {Math.round(zoom * 100)}%
            </strong>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Minus size={14} color="#4FC3F7" />

          <span>
            Snap{" "}
            <strong
              style={{
                color: "#ffffff",
              }}
            >
              25 px
            </strong>
          </span>
        </div>
      </div>

      {/* Right Side */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
        }}
      >
        <span>
          Walls{" "}
          <strong
            style={{
              color: "#FFD54F",
            }}
          >
            {walls.length}
          </strong>
        </span>

        <span>
          Cameras{" "}
          <strong
            style={{
              color: "#39ff14",
            }}
          >
            {cameras.length}
          </strong>
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            minWidth: 220,
          }}
        >
          {selectedCamera ? (
            <Camera
              size={14}
              color="#39ff14"
            />
          ) : (
            <MousePointer2
              size={14}
              color="#FFD54F"
            />
          )}

          <span>
            Selected{" "}
            <strong
              style={{
                color: "#ffffff",
              }}
            >
              {selection}
            </strong>
          </span>
        </div>
      </div>
    </footer>
  );
}
