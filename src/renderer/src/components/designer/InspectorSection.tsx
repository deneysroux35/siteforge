import {
  useState,
  type ReactNode,
} from "react";

import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface InspectorSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  accentColor?: string;
  badge?: string;
}

export default function InspectorSection({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = true,
  accentColor = "#39ff14",
  badge,
}: InspectorSectionProps) {
  const [open, setOpen] =
    useState(defaultOpen);

  return (
    <section
      style={{
        marginBottom: 10,
        background: "#15181e",
        border: "1px solid #303641",
        borderRadius: 9,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        aria-expanded={open}
        style={{
          width: "100%",
          minHeight: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "9px 11px",
          background: open
            ? "#1d222a"
            : "#181c22",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          userSelect: "none",
        }}
      >
        <div
          style={{
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 7,
              background: `${accentColor}18`,
              border: `1px solid ${accentColor}45`,
              color: accentColor,
            }}
          >
            {icon}
          </div>

          <div
            style={{
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 0.4,
              }}
            >
              {title}
            </div>

            {subtitle && (
              <div
                style={{
                  marginTop: 2,
                  overflow: "hidden",
                  color: "#747f8d",
                  fontSize: 10,
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {badge && (
            <span
              style={{
                padding: "3px 7px",
                borderRadius: 999,
                background: `${accentColor}18`,
                color: accentColor,
                border: `1px solid ${accentColor}45`,
                fontSize: 9,
                fontWeight: 800,
              }}
            >
              {badge}
            </span>
          )}

          {open ? (
            <ChevronDown
              size={16}
              color="#9ba5b2"
            />
          ) : (
            <ChevronRight
              size={16}
              color="#9ba5b2"
            />
          )}
        </div>
      </button>

      {open && (
        <div
          style={{
            padding: 12,
            borderTop: "1px solid #2a3039",
          }}
        >
          {children}
        </div>
      )}
    </section>
  );
}
