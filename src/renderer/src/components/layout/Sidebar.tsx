import {
  LayoutDashboard,
  PencilRuler,
  FolderOpen,
  Users,
  Package,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

const menu = [
  { icon: LayoutDashboard, text: "Dashboard" },
  { icon: PencilRuler, text: "Designer" },
  { icon: FolderOpen, text: "Projects" },
  { icon: Users, text: "Customers" },
  { icon: Package, text: "Products" },
  { icon: FileText, text: "Quotes" },
  { icon: BarChart3, text: "Reports" },
  { icon: Settings, text: "Settings" },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        background: "#181818",
        color: "white",
        borderRight: "1px solid #2c2c2c",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: 24,
          fontSize: 28,
          fontWeight: 700,
          color: "#00BCD4",
        }}
      >
        SITEFORGE
      </div>

      <div style={{ padding: 10 }}>
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.text}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 12,
                background: "transparent",
                color: "#ddd",
                border: "none",
                cursor: "pointer",
                borderRadius: 8,
                marginBottom: 4,
                fontSize: 15,
              }}
            >
              <Icon size={18} />
              {item.text}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
