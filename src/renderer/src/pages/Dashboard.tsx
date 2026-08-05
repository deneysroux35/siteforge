export default function Dashboard() {
  return (
    <div
      style={{
        padding: 40,
        color: "white",
      }}
    >
      <h1 style={{ fontSize: 36, marginBottom: 10 }}>
        Welcome to SiteForge
      </h1>

      <p style={{ color: "#999", fontSize: 18 }}>
        Professional CCTV Design & Quotation Platform
      </p>

      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 40,
        }}
      >
        {[
          "Projects",
          "Customers",
          "Quotes",
          "Products",
        ].map((item) => (
          <div
            key={item}
            style={{
              width: 180,
              height: 120,
              background: "#1f1f1f",
              borderRadius: 12,
              padding: 20,
              border: "1px solid #333",
            }}
          >
            <h2>{item}</h2>

            <h1 style={{ color: "#00bcd4" }}>0</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
