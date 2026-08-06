import type { CSSProperties } from "react";

import {
  AlertTriangle,
  Camera,
  CheckCircle2,
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

const cardStyle: CSSProperties = {
  padding: 11,
  marginBottom: 9,
  background: "#111419",
  border: "1px solid #292f38",
  borderRadius: 8,
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
};

const labelStyle: CSSProperties = {
  color: "#8f99a6",
  fontSize: 10,
};

const valueStyle: CSSProperties = {
  color: "#ffffff",
  fontSize: 11,
  fontWeight: 800,
  textAlign: "right",
};

export default function EquipmentSchedule() {
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

  if (summary.cameraCount === 0) {
    return (
      <div
        style={{
          padding: 12,
          background: "#111419",
          border: "1px solid #292f38",
          borderRadius: 8,
          color: "#747f8d",
          fontSize: 10,
          lineHeight: 1.5,
        }}
      >
        Place cameras on the canvas to build the
        equipment schedule automatically.
      </div>
    );
  }

  return (
    <div>
      {summary.unassignedCameraCount > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 9,
            marginBottom: 10,
            padding: 10,
            background: "#33230f",
            border: "1px solid #6f4918",
            borderRadius: 8,
            color: "#ffbd66",
            fontSize: 10,
            lineHeight: 1.5,
          }}
        >
          <AlertTriangle
            size={15}
            style={{
              flexShrink: 0,
              marginTop: 1,
            }}
          />

          <div>
            <strong>
              {summary.unassignedCameraCount} camera
              {summary.unassignedCameraCount === 1
                ? ""
                : "s"}{" "}
              not assigned.
            </strong>

            <div
              style={{
                marginTop: 3,
                color: "#c99c60",
              }}
            >
              Open the Camera Library and apply a
              product before generating the final
              quotation.
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          marginBottom: 8,
          color: "#68717d",
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        Camera Schedule
      </div>

      {summary.cameraSchedule.map((item) => {
        const itemPower =
          item.power * item.quantity;

        return (
          <article
            key={
              item.productId ??
              `${item.manufacturer}-${item.model}`
            }
            style={cardStyle}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 7,
                  background: item.productId
                    ? "#173619"
                    : "#33230f",
                  border: item.productId
                    ? "1px solid #2f7a34"
                    : "1px solid #6f4918",
                  color: item.productId
                    ? "#39ff14"
                    : "#ffbd66",
                }}
              >
                <Camera size={15} />
              </div>

              <div
                style={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    color: item.productId
                      ? "#39ff14"
                      : "#ffbd66",
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                  }}
                >
                  {item.manufacturer}
                </div>

                <div
                  style={{
                    marginTop: 3,
                    overflow: "hidden",
                    color: "#ffffff",
                    fontSize: 12,
                    fontWeight: 800,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={item.model}
                >
                  {item.model}
                </div>
              </div>

              <div
                style={{
                  flexShrink: 0,
                  padding: "4px 7px",
                  background: "#20242b",
                  border: "1px solid #343b47",
                  borderRadius: 999,
                  color: "#ffffff",
                  fontSize: 10,
                  fontWeight: 900,
                }}
              >
                × {item.quantity}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginTop: 11,
                paddingTop: 10,
                borderTop: "1px solid #292f38",
              }}
            >
              <div>
                <div style={labelStyle}>
                  Resolution
                </div>

                <div style={valueStyle}>
                  {item.resolutionMP > 0
                    ? `${item.resolutionMP} MP`
                    : "Not assigned"}
                </div>
              </div>

              <div>
                <div style={labelStyle}>
                  IR Range
                </div>

                <div style={valueStyle}>
                  {item.irRange > 0
                    ? `${item.irRange} m`
                    : "Not assigned"}
                </div>
              </div>

              <div>
                <div style={labelStyle}>
                  Unit Price
                </div>

                <div style={valueStyle}>
                  {formatZAR(item.unitPrice)}
                </div>
              </div>

              <div>
                <div style={labelStyle}>
                  Line Total
                </div>

                <div
                  style={{
                    ...valueStyle,
                    color: "#ffd54f",
                  }}
                >
                  {formatZAR(item.totalPrice)}
                </div>
              </div>

              <div>
                <div style={labelStyle}>
                  Unit Power
                </div>

                <div style={valueStyle}>
                  {item.power.toFixed(1)} W
                </div>
              </div>

              <div>
                <div style={labelStyle}>
                  Line Power
                </div>

                <div style={valueStyle}>
                  {itemPower.toFixed(1)} W
                </div>
              </div>
            </div>
          </article>
        );
      })}

      <div
        style={{
          margin: "14px 0 8px",
          color: "#68717d",
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        Recommended Infrastructure
      </div>

      <div style={cardStyle}>
        <div style={rowStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#9fa8b5",
              fontSize: 11,
            }}
          >
            <Server
              size={14}
              color="#4fc3f7"
            />

            Network Video Recorder
          </div>

          <div style={valueStyle}>
            {summary.recommendedNVRChannels > 0
              ? `${summary.recommendedNVRChannels} channel`
              : "Not required"}
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={rowStyle}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#9fa8b5",
              fontSize: 11,
            }}
          >
            <PlugZap
              size={14}
              color="#39ff14"
            />

            PoE Switch
          </div>

          <div style={valueStyle}>
            {summary.recommendedPoESwitchPorts > 0
              ? `${summary.recommendedPoESwitchPorts} port`
              : "Not required"}
          </div>
        </div>

        <div
          style={{
            ...rowStyle,
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid #292f38",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#9fa8b5",
              fontSize: 11,
            }}
          >
            <Zap
              size={14}
              color="#ffb74d"
            />

            Minimum PoE Budget
          </div>

          <div style={valueStyle}>
            {summary.recommendedPoEPowerBudget} W
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 12,
          background:
            "linear-gradient(135deg, #222714, #171b13)",
          border: "1px solid #5d6428",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#d8df9a",
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            <WalletCards
              size={15}
              color="#ffd54f"
            />

            Camera Equipment Total
          </div>

          <div
            style={{
              color: "#ffd54f",
              fontSize: 14,
              fontWeight: 900,
            }}
          >
            {formatZAR(summary.totalCameraCost)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginTop: 9,
            color:
              summary.unassignedCameraCount === 0
                ? "#39ff14"
                : "#ffbd66",
            fontSize: 9,
            fontWeight: 800,
          }}
        >
          {summary.unassignedCameraCount === 0 ? (
            <CheckCircle2 size={13} />
          ) : (
            <AlertTriangle size={13} />
          )}

          {summary.unassignedCameraCount === 0
            ? "All placed cameras have products assigned."
            : "Total excludes cameras without assigned products."}
        </div>
      </div>
    </div>
  );
}
