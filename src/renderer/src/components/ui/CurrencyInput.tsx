import type {
  CSSProperties,
  JSX,
} from 'react'

import { theme } from './theme'

export interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  currencySymbol?: string
  step?: number
  placeholder?: string
  style?: CSSProperties
}

export default function CurrencyInput({
  value,
  onChange,
  currencySymbol = 'R',
  step = 100,
  placeholder = '0.00',
  style,
}: CurrencyInputProps): JSX.Element {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          color: theme.colors.textMuted,
          fontSize: theme.font.size.sm,
          pointerEvents: 'none',
        }}
      >
        {currencySymbol}
      </span>

      <input
        type="number"
        min={0}
        step={step}
        value={value === 0 ? '' : value}
        placeholder={placeholder}
        onFocus={(event): void => {
          event.currentTarget.select()
        }}
        onChange={(event): void => {
          const text = event.target.value

          if (text === '') {
            onChange(0)
            return
          }

          const nextValue = Number(text)

          if (Number.isNaN(nextValue)) {
            return
          }

          onChange(Math.max(0, nextValue))
        }}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          minHeight: 34,
          padding: '8px 9px 8px 28px',
          background: theme.colors.surfaceAlt,
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.small,
          outline: 'none',
          fontFamily: theme.font.family,
          fontSize: theme.font.size.sm,
          ...style,
        }}
      />
    </div>
  )
}
