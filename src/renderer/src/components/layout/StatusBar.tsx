export default function StatusBar() {
  return (
    <footer
      style={{
        height: 28,
        background: "#1f1f1f",
        borderTop: "1px solid #333",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 15px",
        color: "#999",
        fontSize: 12,
      }}
    >
      <span>Ready</span>

      <span>Zoom 100%</span>
    </footer>
  );
}
