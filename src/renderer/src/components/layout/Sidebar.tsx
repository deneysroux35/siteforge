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
} from "lucide-react"

import {
  useWorkspaceStore,
  type SiteForgeWorkspace,
} from "../../store/workspaceStore"

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
  icon: any
  text: string
  workspace: SiteForgeWorkspace
}[]

export default function Sidebar() {
  const activeWorkspace = useWorkspaceStore(
    (state) => state.activeWorkspace,
  )

  const setWorkspace = useWorkspaceStore(
    (state) => state.setWorkspace,
  )

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
          padding: "22px 20px 18px",
          borderBottom: "1px solid #242424",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              display: "grid",
              placeItems: "center",
              borderRadius: 8,
              background:
                "linear-gradient(135deg, #39ff14, #11a500)",
              color: "#071007",
              fontSize: 15,
              fontWeight: 900,
              boxShadow:
                "0 0 18px rgba(57,255,20,0.18)",
            }}
          >
            SC
          </div>

          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 0.5,
                color: "#ffffff",
              }}
            >
              SENTRY
              <span
                style={{
                  color: "#39ff14",
                }}
              >
                CAD
              </span>
            </div>

            <div
              style={{
                marginTop: 2,
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: "#68717d",
              }}
            >
              Design. Engineer. Protect.
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 10 }}>
        {menu.map((item) => {
          const Icon = item.icon

          const active =
            activeWorkspace === item.workspace

          return (
            <button
              key={item.text}
              type="button"
              onClick={() =>
                setWorkspace(item.workspace)
              }
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 12,
                border: active
                  ? "1px solid rgba(57,255,20,0.14)"
                  : "1px solid transparent",
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

                boxShadow: active
                  ? "0 0 18px rgba(57,255,20,0.06)"
                  : "none",

                transition: "0.15s",
              }}
            >
              <Icon size={18} />

              {item.text}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
