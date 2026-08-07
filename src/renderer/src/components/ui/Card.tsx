import type {
  CSSProperties,
  JSX,
  ReactNode,
} from 'react'

import { theme } from './theme'

export interface CardProps {
  children: ReactNode
  style?: CSSProperties
}

export default function Card({
  children,
  style,
}: CardProps): JSX.Element {
  return (
    <div
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.large,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
