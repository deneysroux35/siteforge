import type {
  JSX,
  ReactNode,
} from 'react'

import { theme } from './theme'

export interface KPIProps {
  icon: ReactNode
  label: string
  value: string
  accent: string
}

export default function KPI({
  icon,
  label,
  value,
  accent,
}: KPIProps): JSX.Element {
  return (
    <div
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.large,
        padding: 15,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: accent,
        }}
      >
        {icon}

        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            background: accent,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 10,
          color: theme.colors.textMuted,
          fontSize: theme.font.size.sm,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 4,
          color: theme.colors.text,
          fontWeight: theme.font.weight.bold,
          fontSize: theme.font.size.lg,
        }}
      >
        {value}
      </div>
    </div>
  )
}
