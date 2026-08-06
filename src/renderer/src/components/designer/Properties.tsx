import type {
  CSSProperties,
  FocusEvent,
} from "react";

import { useDesignerStore } from "../../store/designerStore";

const GRID_SIZE = 25;

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value),
  );
}

const labelStyle: CSSProperties = {
  display: "block",
  marginBottom: 6,
  color: "#a7a7a7",
  fontSize: 12,
  fontWeight: 600,
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 10px",
  background: "#252525",
  color: "#ffffff",
  border: "1px solid #3c3c3c",
  borderRadius: 6,
  outline: "none",
  fontSize: 13,
};

const fieldStyle: CSSProperties = {
  marginBottom: 16,
};

export default function Properties() {
  const selectedWall =
    useDesignerStore((state) =>
      state.walls.find(
        (wall) => wall.selected,
      ),
    );

  const selectedCamera =
    useDesignerStore((state) =>
      state.cameras.find(
        (camera) => camera.selected,
      ),
    );

  const beginCameraEdit =
    useDesignerStore(
      (state) =>
        state.beginCameraEdit,
    );

  const updateCameraProperties =
    useDesignerStore(
      (state) =>
        state.updateCameraProperties,
    );

  const finishCameraEdit =
    useDesignerStore(
      (state) =>
        state.finishCameraEdit,
    );

  const deleteSelectedObject =
    useDesignerStore(
      (state) =>
        state.deleteSelectedObject,
    );

  const handleInputFocus = () => {
    beginCameraEdit();
  };

  const handleInputBlur = (
    event: FocusEvent<HTMLInputElement>,
  ) => {
    event.currentTarget.style.borderColor =
      "#3c3c3c";

    finishCameraEdit();
  };

  const handleFocusHighlight = (
    event: FocusEvent<HTMLInputElement>,
  ) => {
    event.currentTarget.style.borderColor =
      "#39ff14";
  };

  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        background: "#1b1b1b",
        borderLeft: "1px solid #333",
        padding: 20,
        color: "#ddd",
        overflowY: "auto",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: 22,
        }}
      >
        Properties
      </h3>

      {!selectedWall &&
        !selectedCamera && (
          <p
            style={{
              color: "#888",
            }}
          >
            Select an object to edit its
            properties.
          </p>
        )}

      {selectedWall && (
        <>
          <h4
            style={{
              color: "#ffd700",
              marginTop: 0,
            }}
          >
            Wall
          </h4>

          <div style={fieldStyle}>
            <span style={labelStyle}>
              Material
            </span>

            <div style={inputStyle}>
              {selectedWall.material}
            </div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>
              Height
            </span>

            <div style={inputStyle}>
              {selectedWall.height} mm
            </div>
          </div>

          <div style={fieldStyle}>
            <span style={labelStyle}>
              Thickness
            </span>

            <div style={inputStyle}>
              {selectedWall.thickness}px
            </div>
          </div>
        </>
      )}

      {selectedCamera && (
        <>
          <h4
            style={{
              color: "#39ff14",
              marginTop: 0,
              marginBottom: 18,
            }}
          >
            Camera
          </h4>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Camera Name
            </label>

            <input
              type="text"
              value={selectedCamera.name}
              style={inputStyle}
              onFocus={(event) => {
                handleInputFocus();
                handleFocusHighlight(event);
              }}
              onBlur={handleInputBlur}
              onChange={(event) => {
                updateCameraProperties(
                  selectedCamera.id,
                  {
                    name:
                      event.target.value,
                  },
                );
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div>
              <label style={labelStyle}>
                X Position
              </label>

              <input
                type="number"
                value={
                  selectedCamera.position.x
                }
                step={GRID_SIZE}
                style={inputStyle}
                onFocus={(event) => {
                  handleInputFocus();
                  handleFocusHighlight(
                    event,
                  );
                }}
                onBlur={handleInputBlur}
                onChange={(event) => {
                  const value =
                    Number(
                      event.target.value,
                    );

                  if (
                    Number.isNaN(value)
                  ) {
                    return;
                  }

                  updateCameraProperties(
                    selectedCamera.id,
                    {
                      position: {
                        x: snapToGrid(
                          value,
                        ),
                        y:
                          selectedCamera
                            .position.y,
                      },
                    },
                  );
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Y Position
              </label>

              <input
                type="number"
                value={
                  selectedCamera.position.y
                }
                step={GRID_SIZE}
                style={inputStyle}
                onFocus={(event) => {
                  handleInputFocus();
                  handleFocusHighlight(
                    event,
                  );
                }}
                onBlur={handleInputBlur}
                onChange={(event) => {
                  const value =
                    Number(
                      event.target.value,
                    );

                  if (
                    Number.isNaN(value)
                  ) {
                    return;
                  }

                  updateCameraProperties(
                    selectedCamera.id,
                    {
                      position: {
                        x:
                          selectedCamera
                            .position.x,
                        y: snapToGrid(
                          value,
                        ),
                      },
                    },
                  );
                }}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Rotation
            </label>

            <input
              type="number"
              min={0}
              max={359}
              step={1}
              value={Math.round(
                selectedCamera.rotation,
              )}
              style={inputStyle}
              onFocus={(event) => {
                handleInputFocus();
                handleFocusHighlight(event);
              }}
              onBlur={handleInputBlur}
              onChange={(event) => {
                const value =
                  Number(
                    event.target.value,
                  );

                if (
                  Number.isNaN(value)
                ) {
                  return;
                }

                const rotation =
                  ((value % 360) + 360) %
                  360;

                updateCameraProperties(
                  selectedCamera.id,
                  {
                    rotation,
                  },
                );
              }}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Field of View
            </label>

            <input
              type="range"
              min={10}
              max={170}
              step={1}
              value={
                selectedCamera.fieldOfView
              }
              style={{
                width: "100%",
                accentColor: "#39ff14",
              }}
              onFocus={handleInputFocus}
              onBlur={() =>
                finishCameraEdit()
              }
              onChange={(event) => {
                updateCameraProperties(
                  selectedCamera.id,
                  {
                    fieldOfView: clamp(
                      Number(
                        event.target.value,
                      ),
                      10,
                      170,
                    ),
                  },
                );
              }}
            />

            <div
              style={{
                marginTop: 7,
                color: "#39ff14",
                fontSize: 13,
                textAlign: "right",
              }}
            >
              {selectedCamera.fieldOfView}°
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Coverage Range
            </label>

            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={selectedCamera.range}
              style={{
                width: "100%",
                accentColor: "#39ff14",
              }}
              onFocus={handleInputFocus}
              onBlur={() =>
                finishCameraEdit()
              }
              onChange={(event) => {
                updateCameraProperties(
                  selectedCamera.id,
                  {
                    range: clamp(
                      Number(
                        event.target.value,
                      ),
                      1,
                      100,
                    ),
                  },
                );
              }}
            />

            <div
              style={{
                marginTop: 7,
                color: "#39ff14",
                fontSize: 13,
                textAlign: "right",
              }}
            >
              {selectedCamera.range} m
            </div>
          </div>

          <button
            type="button"
            onClick={
              deleteSelectedObject
            }
            style={{
              width: "100%",
              marginTop: 10,
              padding: "10px 12px",
              background: "#3a1919",
              color: "#ff8a8a",
              border: "1px solid #6b2929",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Delete Camera
          </button>
        </>
      )}
    </aside>
  );
}
