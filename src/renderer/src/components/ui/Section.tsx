import type {
  JSX,
  ReactNode,
} from 'react'

import { theme } from './theme'

export interface SectionProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function Section({
  title,
  subtitle,
  children,
}: SectionProps): JSX.Element {
  return (
    <div
      style={{
        padding: 16,
      }}
    >
      <div
        style={{
          marginBottom: 14,
        }}
      >
        <div
          style={{
            color: theme.colors.text,
            fontWeight: theme.font.weight.bold,
            fontSize: theme.font.size.lg,
          }}
        >
          {title}
        </div>

        {subtitle && (
          <div
            style={{
              marginTop: 3,
              color: theme.colors.textMuted,
              fontSize: theme.font.size.sm,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {children}
    </div>
  )
}
