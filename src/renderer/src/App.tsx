import Sidebar from "./components/layout/Sidebar";
import Designer from "./pages/Designer";

export default function App() {
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#111",
        color: "#fff",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: "flex",
        }}
      >
        <Designer />
      </div>
    </div>
  );
}
