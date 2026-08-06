import Canvas from "../components/designer/Canvas";
import Properties from "../components/designer/Properties";
import Toolbar from "../components/designer/Toolbar";

import StatusBar from "../components/layout/StatusBar";
import TopBar from "../components/layout/TopBar";

export default function Designer() {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#0f1115",
        color: "#ffffff",
      }}
    >
      <TopBar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <Toolbar />

        <main
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            position: "relative",
            overflow: "hidden",
            background: "#202225",
          }}
        >
          <Canvas />
        </main>

        <Properties />
      </div>

      <StatusBar />
    </div>
  );
}
