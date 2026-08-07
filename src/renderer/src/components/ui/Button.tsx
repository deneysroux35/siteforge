import type { CSSProperties, JSX, ReactNode } from 'react'

import { theme } from './theme'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost'

export interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: ButtonVariant
  icon?: ReactNode
  title?: string
  style?: CSSProperties
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = 'secondary',
  icon,
  title,
  style,
}: ButtonProps): JSX.Element {
  const variantStyle = getVariantStyle(variant)

  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,

        minHeight: 34,

        padding: '7px 11px',

        fontFamily: theme.font.family,
        fontSize: theme.font.size.sm,
        fontWeight: theme.font.weight.bold,

        borderRadius: theme.radius.small,

        cursor: disabled
          ? 'not-allowed'
          : 'pointer',

        opacity: disabled
          ? 0.5
          : 1,

        transition:
          'background 140ms ease, border-color 140ms ease, color 140ms ease',

        ...variantStyle,
        ...style,
      }}
    >
      {icon}

      {children}
    </button>
  )
}

function getVariantStyle(
  variant: ButtonVariant,
): CSSProperties {
  switch (variant) {
    case 'primary':
      return {
        background:
          theme.colors.successBackground,

        color:
          theme.colors.accent,

        border:
          `1px solid ${theme.colors.accent}66`,
      }

    case 'danger':
      return {
        background:
          theme.colors.dangerBackground,

        color:
          '#ff8a8a',

        border:
          '1px solid #612b2b',
      }

    case 'ghost':
      return {
        background:
          'transparent',

        color:
          theme.colors.textSecondary,

        border:
          '1px solid transparent',
      }

    case 'secondary':
    default:
      return {
        background:
          theme.colors.surfaceHover,

        color:
          theme.colors.textSecondary,

        border:
          `1px solid ${theme.colors.border}`,
      }
  }
}
