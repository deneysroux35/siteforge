import type { CSSProperties } from "react";

import {
  Camera,
  Database,
  HardDrive,
  Layers3,
  PlugZap,
  Server,
  WalletCards,
  Zap,
} from "lucide-react";

import { useDesignerStore } from "../../store/designerStore";

import {
  calculateProjectSummary,
  formatZAR,
} from "../../services/projectEngine";

const rowStyle: CSSProperties = {
  minHeight: 39,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  padding: "0 3px",
  borderBottom: "1px solid #292f38",
};

const labelStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  color: "#9fa8b5",
  fontSize: 11,
};

const valueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: 12,
  fontWeight: 800,
  textAlign: "right",
};

export default function ProjectSummary() {
  const walls = useDesignerStore(
    (state) => state.walls,
  );

  const cameras = useDesignerStore(
    (state) => state.cameras,
  );

  const summary = calculateProjectSummary({
    walls,
    cameras,
  });

  const assignmentText =
    summary.unassignedCameraCount > 0
      ? `${summary.assignedCameraCount} / ${summary.cameraCount}`
      : `${summary.assignedCameraCount} assigned`;

  return (
    <div>
      <div style={rowStyle}>
        <div style={labelStyle}>
          <Layers3
            size={14}
            color="#ffd54f"
          />
          Walls
        </div>

        <div style={valueStyle}>
          {summary.wallCount}
        </div>
      </div>

      <div style={rowStyle}>
        <div style={labelStyle}>
          <Camera
            size={14}
            color="#39ff14"
          />
          Cameras
        </div>

        <div style={valueStyle}>
          {summary.cameraCount}
        </div>
      </div>

      <div style={rowStyle}>
        <div style={labelStyle}>
          <Database
            size={14}
            color="#4fc3f7"
          />
          Products assigned
        </div>

        <div
          style={{
            ...valueStyle,
            color:
              summary.unassignedCameraCount > 0
                ? "#ffb74d"
                : "#39ff14",
          }}
        >
          {assignmentText}
        </div>
      </div>

      <div style={rowStyle}>
        <div style={labelStyle}>
          <WalletCards
            size={14}
            color="#ffd54f"
          />
          Camera cost
        </div>

        <div
          style={{
            ...valueStyle,
            color: "#ffd54f",
          }}
        >
          {formatZAR(
            summary.totalCameraCost,
          )}
        </div>
      </div>

      <div style={rowStyle}>
        <div style={labelStyle}>
          <Zap
            size={14}
            color="#ffb74d"
          />
          Camera power
        </div>

        <div style={valueStyle}>
          {summary.totalCameraPower.toFixed(1)} W
        </div>
      </div>

      <div style={rowStyle}>
        <div style={labelStyle}>
          <Server
            size={14}
            color="#4fc3f7"
          />
          Recommended NVR
        </div>

        <div style={valueStyle}>
          {summary.recommendedNVRChannels > 0
            ? `${summary.recommendedNVRChannels} ch`
            : "None"}
        </div>
      </div>

      <div style={rowStyle}>
        <div style={labelStyle}>
          <PlugZap
            size={14}
            color="#39ff14"
          />
          PoE switch
        </div>

        <div style={valueStyle}>
          {summary.recommendedPoESwitchPorts > 0
            ? `${summary.recommendedPoESwitchPorts} port`
            : "None"}
        </div>
      </div>

      <div style={rowStyle}>
        <div style={labelStyle}>
          <Zap
            size={14}
            color="#ff8a80"
          />
          PoE budget
        </div>

        <div style={valueStyle}>
          {summary.recommendedPoEPowerBudget} W
        </div>
      </div>

      <div
        style={{
          ...rowStyle,
          borderBottom: "none",
        }}
      >
        <div style={labelStyle}>
          <HardDrive
            size={14}
            color="#b388ff"
          />
          Storage estimate
        </div>

        <div
          style={{
            ...valueStyle,
            color: "#b388ff",
          }}
        >
          {summary.estimatedStorageTB.toFixed(
            2,
          )}{" "}
          TB
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          padding: 9,
          background: "#111419",
          border: "1px solid #292f38",
          borderRadius: 7,
          color: "#747f8d",
          fontSize: 9,
          lineHeight: 1.5,
        }}
      >
        Estimate: 30 days, 15 FPS,
        H.265 and continuous recording.
      </div>
    </div>
  );
}
