import {
  LayoutDashboard,
  PencilRuler,
  FolderOpen,
  Users,
  Package,
  Landmark,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

import {
  useWorkspaceStore,
  type SiteForgeWorkspace,
} from "../../store/workspaceStore";

const menu = [
  {
    icon: LayoutDashboard,
    text: "Dashboard",
    workspace: "dashboard",
  },
  {
    icon: PencilRuler,
    text: "Designer",
    workspace: "designer",
  },
  {
    icon: FolderOpen,
    text: "Projects",
    workspace: "projects",
  },
  {
    icon: Users,
    text: "Customers",
    workspace: "customers",
  },
  {
    icon: Package,
    text: "Commercial",
    workspace: "commercial",
  },
  {
    icon: Landmark,
    text: "Finance",
    workspace: "finance",
  },
  {
    icon: FileText,
    text: "Proposals",
    workspace: "proposals",
  },
  {
    icon: BarChart3,
    text: "Reports",
    workspace: "reports",
  },
  {
    icon: Settings,
    text: "Settings",
    workspace: "settings",
  },
] satisfies {
  icon: any;
  text: string;
  workspace: SiteForgeWorkspace;
}[];

export default function Sidebar() {
  const activeWorkspace = useWorkspaceStore(
    (state) => state.activeWorkspace,
  );

  const setWorkspace = useWorkspaceStore(
    (state) => state.setWorkspace,
  );

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
          color: "#39ff14",
        }}
      >
        SITEFORGE
      </div>

      <div style={{ padding: 10 }}>
        {menu.map((item) => {
          const Icon = item.icon;

          const active =
            activeWorkspace === item.workspace;

          return (
            <button
              key={item.text}
              onClick={() =>
                setWorkspace(item.workspace)
              }
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 12,
                border: "none",
                cursor: "pointer",
                borderRadius: 8,
                marginBottom: 4,
                fontSize: 15,

                background: active
                  ? "#22301d"
                  : "transparent",

                color: active
                  ? "#39ff14"
                  : "#ddd",

                transition: "0.15s",
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
