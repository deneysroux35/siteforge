import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import StatusBar from "./components/layout/StatusBar";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#111",
        color: "white",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TopBar />

        <main
          style={{
            flex: 1,
            overflow: "auto",
          }}
        >
          <Dashboard />
        </main>

        <StatusBar />
      </div>
    </div>
  );
}
