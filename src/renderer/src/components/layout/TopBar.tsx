export default function TopBar() {
  return (
    <header
      style={{
        height: 50,
        background: "#1f1f1f",
        borderBottom: "1px solid #333",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        color: "#ccc",
        fontSize: 14,
      }}
    >
      <span style={{ marginRight: 20 }}>File</span>
      <span style={{ marginRight: 20 }}>Edit</span>
      <span style={{ marginRight: 20 }}>View</span>
      <span style={{ marginRight: 20 }}>Insert</span>
      <span style={{ marginRight: 20 }}>Cameras</span>
      <span style={{ marginRight: 20 }}>Reports</span>
      <span>Help</span>
    </header>
  );
}
