import { Stage, Layer, Rect } from "react-konva";
import { useEffect, useRef, useState } from "react";

import Grid from "./Grid";
import Viewport from "./Viewport";

import { useDesignerStore } from "../../store/designerStore";

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  const zoom = useDesignerStore((state) => state.zoom);
  const offsetX = useDesignerStore((state) => state.offsetX);
  const offsetY = useDesignerStore((state) => state.offsetY);

  const [size, setSize] = useState({
    width: 1,
    height: 1,
  });

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;

      setSize({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#202225",
      }}
    >
      <Stage
        width={size.width}
        height={size.height}
      >
        {/* Background */}
        <Layer>
          <Rect
            width={size.width}
            height={size.height}
            fill="#202225"
          />
        </Layer>

        {/* CAD World */}
        <Layer>
          <Viewport
            zoom={zoom}
            offsetX={offsetX}
            offsetY={offsetY}
          >
            <Grid
              width={5000}
              height={5000}
            />
          </Viewport>
        </Layer>
      </Stage>
    </div>
  );
}
