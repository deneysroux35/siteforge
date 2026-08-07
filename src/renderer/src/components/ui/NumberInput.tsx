import type {
  CSSProperties,
  JSX,
} from 'react'

import { theme } from './theme'

export interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  placeholder?: string
  style?: CSSProperties
}

export default function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  placeholder = '0',
  style,
}: NumberInputProps): JSX.Element {
  return (
    <input
      type="number"
      min={min}
      max={max}
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

        let safeValue = Math.max(
          min,
          nextValue,
        )

        if (max !== undefined) {
          safeValue = Math.min(
            max,
            safeValue,
          )
        }

        onChange(safeValue)
      }}
      style={{
        width: '100%',
        boxSizing: 'border-box',

        minHeight: 34,

        padding: '8px 9px',

        background:
          theme.colors.surfaceAlt,

        color:
          theme.colors.text,

        border:
          `1px solid ${theme.colors.border}`,

        borderRadius:
          theme.radius.small,

        outline: 'none',

        fontFamily:
          theme.font.family,

        fontSize:
          theme.font.size.sm,

        ...style,
      }}
    />
  )
}
