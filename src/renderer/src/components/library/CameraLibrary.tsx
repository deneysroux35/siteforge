import type { CSSProperties } from "react";

import {
  cameraDatabase,
  manufacturers,
} from "../../data/cameras";

import type { CameraProduct } from "../../data/productTypes";

import { useDesignerStore } from "../../store/designerStore";
import { useProductStore } from "../../store/productStore";

interface CameraLibraryProps {
  onClose: () => void;
}

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  background: "#242424",
  color: "#ffffff",
  border: "1px solid #3c3c3c",
  borderRadius: 7,
  outline: "none",
  fontSize: 13,
};

const buttonStyle: CSSProperties = {
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CameraLibrary({
  onClose,
}: CameraLibraryProps) {
  const cameraSearch = useProductStore(
    (state) => state.cameraSearch,
  );

  const selectedManufacturer = useProductStore(
    (state) => state.selectedManufacturer,
  );

  const setCameraSearch = useProductStore(
    (state) => state.setCameraSearch,
  );

  const setSelectedManufacturer = useProductStore(
    (state) => state.setSelectedManufacturer,
  );

  const clearCameraFilters = useProductStore(
    (state) => state.clearCameraFilters,
  );

  const selectedCamera = useDesignerStore((state) =>
    state.cameras.find((camera) => camera.selected),
  );

  const beginCameraEdit = useDesignerStore(
    (state) => state.beginCameraEdit,
  );

  const updateCameraProperties = useDesignerStore(
    (state) => state.updateCameraProperties,
  );

  const finishCameraEdit = useDesignerStore(
    (state) => state.finishCameraEdit,
  );

  const normalizedSearch =
    cameraSearch.trim().toLowerCase();

  const filteredCameras = cameraDatabase.filter(
    (camera) => {
      const manufacturerMatches =
        selectedManufacturer === "All" ||
        camera.manufacturer === selectedManufacturer;

      const searchMatches =
        normalizedSearch.length === 0 ||
        camera.manufacturer
          .toLowerCase()
          .includes(normalizedSearch) ||
        camera.model
          .toLowerCase()
          .includes(normalizedSearch) ||
        `${camera.resolutionMP}mp`.includes(
          normalizedSearch,
        );

      return manufacturerMatches && searchMatches;
    },
  );

  const applyCameraProduct = (
    product: CameraProduct,
  ) => {
    if (!selectedCamera) {
      return;
    }

    beginCameraEdit();

    updateCameraProperties(selectedCamera.id, {
      name: `${product.manufacturer} ${product.model}`,
      fieldOfView: product.horizontalFOV,
      range: product.maxDistance,
    });

    finishCameraEdit();
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.72)",
        padding: 30,
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: "min(880px, 92vw)",
          maxHeight: "82vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "#181818",
          border: "1px solid #3a3a3a",
          borderRadius: 12,
          boxShadow:
            "0 24px 70px rgba(0, 0, 0, 0.55)",
          color: "#ffffff",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: "1px solid #333",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
              }}
            >
              Camera Library
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#888",
                fontSize: 13,
              }}
            >
              Choose a product for the selected
              camera.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              ...buttonStyle,
              width: 36,
              height: 36,
              background: "#292929",
              color: "#cccccc",
              fontSize: 20,
            }}
          >
            ×
          </button>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1fr) 210px auto",
            gap: 10,
            padding: 16,
            borderBottom: "1px solid #333",
          }}
        >
          <input
            type="search"
            placeholder="Search manufacturer, model or resolution..."
            value={cameraSearch}
            onChange={(event) =>
              setCameraSearch(event.target.value)
            }
            style={inputStyle}
            autoFocus
          />

          <select
            value={selectedManufacturer}
            onChange={(event) =>
              setSelectedManufacturer(
                event.target.value,
              )
            }
            style={inputStyle}
          >
            <option value="All">
              All manufacturers
            </option>

            {manufacturers.map((manufacturer) => (
              <option
                key={manufacturer}
                value={manufacturer}
              >
                {manufacturer}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearCameraFilters}
            style={{
              ...buttonStyle,
              padding: "0 16px",
              background: "#303030",
              color: "#cccccc",
            }}
          >
            Clear
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
          }}
        >
          {filteredCameras.length === 0 ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#888",
              }}
            >
              No matching cameras found.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              {filteredCameras.map((camera) => (
                <article
                  key={camera.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 16,
                    background: "#222222",
                    border: "1px solid #353535",
                    borderRadius: 9,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#39ff14",
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.8,
                        }}
                      >
                        {camera.manufacturer}
                      </div>

                      <h3
                        style={{
                          margin: "6px 0 4px",
                          fontSize: 16,
                        }}
                      >
                        {camera.model}
                      </h3>
                    </div>

                    <div
                      style={{
                        color: "#ffd700",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatPrice(camera.price)}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                      marginTop: 14,
                      color: "#b8b8b8",
                      fontSize: 12,
                    }}
                  >
                    <div>
                      <strong>Resolution</strong>
                      <br />
                      {camera.resolutionMP}MP
                    </div>

                    <div>
                      <strong>Sensor</strong>
                      <br />
                      {camera.sensor}
                    </div>

                    <div>
                      <strong>Lens options</strong>
                      <br />
                      {camera.lensOptions.join(" / ")} mm
                    </div>

                    <div>
                      <strong>IR range</strong>
                      <br />
                      {camera.irRange} m
                    </div>

                    <div>
                      <strong>Horizontal FOV</strong>
                      <br />
                      {camera.horizontalFOV}°
                    </div>

                    <div>
                      <strong>Power</strong>
                      <br />
                      {camera.power} W
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!selectedCamera}
                    onClick={() =>
                      applyCameraProduct(camera)
                    }
                    style={{
                      ...buttonStyle,
                      marginTop: 16,
                      padding: "10px 12px",
                      background: selectedCamera
                        ? "#39ff14"
                        : "#333333",
                      color: selectedCamera
                        ? "#101510"
                        : "#777777",
                      cursor: selectedCamera
                        ? "pointer"
                        : "not-allowed",
                    }}
                  >
                    Apply to Selected Camera
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 18px",
            borderTop: "1px solid #333",
            color: "#888",
            fontSize: 12,
          }}
        >
          <span>
            {filteredCameras.length} camera
            {filteredCameras.length === 1
              ? ""
              : "s"}
          </span>

          <span>
            Selected device:{" "}
            {selectedCamera?.name ?? "None"}
          </span>
        </footer>
      </div>
    </div>
  );
}
