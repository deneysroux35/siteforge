import TopBar from "../components/layout/TopBar";

import Toolbar from "../components/designer/Toolbar";
import Canvas from "../components/designer/Canvas";
import Properties from "../components/designer/Properties";
import Status from "../components/designer/Status";

export default function Designer() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        background: "#202225",
      }}
    >
      <TopBar />

      <Toolbar />

      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <Canvas />
        </div>

        <Properties />
      </div>

      <Status />
    </div>
  );
}
