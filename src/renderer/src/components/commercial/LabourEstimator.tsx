import {
  useEffect,
  useMemo,
  type CSSProperties,
  type JSX,
} from 'react'

import {
  Clock3,
  Plus,
  RotateCcw,
  Trash2,
  Users,
  Wrench,
} from 'lucide-react'

import {
  calculateLabourSummary,
} from '../../services/labourEngine'

import {
  useLabourStore,
} from '../../store/labourStore'

import {
  useQuoteStore,
} from '../../store/quoteStore'

import {
  formatZAR,
} from '../../services/projectEngine'

const panelStyle: CSSProperties = {
  background: '#15191f',
  border: '1px solid #303641',
  borderRadius: 10,
}

const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '8px 9px',
  background: '#101318',
  color: '#ffffff',
  border: '1px solid #343b47',
  borderRadius: 6,
  outline: 'none',
  fontSize: 10,
}

export default function LabourEstimator(): JSX.Element {
  const lines =
    useLabourStore(
      (state) => state.lines,
    )

  const addLine =
    useLabourStore(
      (state) => state.addLine,
    )

  const updateLine =
    useLabourStore(
      (state) => state.updateLine,
    )

  const removeLine =
    useLabourStore(
      (state) => state.removeLine,
    )

  const resetDefaults =
    useLabourStore(
      (state) => state.resetDefaults,
    )

  const setLabourCost =
    useQuoteStore(
      (state) => state.setLabourCost,
    )

  const summary =
    useMemo(
      () =>
        calculateLabourSummary(
          lines,
        ),
      [lines],
    )

  useEffect((): void => {
    setLabourCost(
      summary.totalCost,
    )
  }, [
    summary.totalCost,
    setLabourCost,
  ])

  return (
    <section
      style={{
        ...panelStyle,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          gap: 12,
          padding: 14,
          background: '#171b21',
          borderBottom:
            '1px solid #303641',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            <Users
              size={16}
              color="#4fc3f7"
            />

            Labour Estimator
          </div>

          <div
            style={{
              marginTop: 3,
              color: '#68717d',
              fontSize: 8,
            }}
          >
            Technician roles,
            headcount, days,
            hours and rates.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 7,
          }}
        >
          <button
            type="button"
            onClick={resetDefaults}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 9px',
              background: '#20242b',
              color: '#aab2bd',
              border:
                '1px solid #343b47',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 9,
              fontWeight: 800,
            }}
          >
            <RotateCcw size={13} />
            Reset
          </button>

          <button
            type="button"
            onClick={addLine}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 9px',
              background: '#173619',
              color: '#39ff14',
              border:
                '1px solid #2f7a34',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 9,
              fontWeight: 900,
            }}
          >
            <Plus size={13} />
            Add Role
          </button>
        </div>
      </div>

      <div
        style={{
          overflowX: 'auto',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse:
              'collapse',
            fontSize: 10,
          }}
        >
          <thead>
            <tr>
              <TableHeader>
                Role
              </TableHeader>

              <TableHeader align="right">
                Qty
              </TableHeader>

              <TableHeader align="right">
                Days
              </TableHeader>

              <TableHeader align="right">
                Hrs/Day
              </TableHeader>

              <TableHeader align="right">
                Hourly Rate
              </TableHeader>

              <TableHeader align="right">
                Total Hours
              </TableHeader>

              <TableHeader align="right">
                Total
              </TableHeader>

              <TableHeader>
                Action
              </TableHeader>
            </tr>
          </thead>

          <tbody>
            {summary.lines.map(
              (line) => (
                <tr
                  key={line.id}
                  style={{
                    borderBottom:
                      '1px solid #282e38',
                  }}
                >
                  <TableCell>
                    <input
                      type="text"
                      value={line.role}
                      onChange={(
                        event,
                      ): void => {
                        updateLine(
                          line.id,
                          {
                            role:
                              event.target.value,
                          },
                        )
                      }}
                      style={{
                        ...inputStyle,
                        minWidth: 170,
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <NumberInput
                      value={line.quantity}
                      step={1}
                      onChange={(
                        value,
                      ): void => {
                        updateLine(
                          line.id,
                          {
                            quantity:
                              value,
                          },
                        )
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <NumberInput
                      value={line.days}
                      step={0.5}
                      onChange={(
                        value,
                      ): void => {
                        updateLine(
                          line.id,
                          {
                            days:
                              value,
                          },
                        )
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <NumberInput
                      value={
                        line.hoursPerDay
                      }
                      step={0.5}
                      onChange={(
                        value,
                      ): void => {
                        updateLine(
                          line.id,
                          {
                            hoursPerDay:
                              value,
                          },
                        )
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <CurrencyInput
                      value={
                        line.hourlyRate
                      }
                      onChange={(
                        value,
                      ): void => {
                        updateLine(
                          line.id,
                          {
                            hourlyRate:
                              value,
                          },
                        )
                      }}
                    />
                  </TableCell>

                  <TableCell
                    align="right"
                    highlight
                  >
                    {line.totalHours.toFixed(
                      1,
                    )}
                  </TableCell>

                  <TableCell
                    align="right"
                    highlight
                  >
                    {formatZAR(
                      line.totalCost,
                    )}
                  </TableCell>

                  <TableCell>
                    <button
                      type="button"
                      title="Remove role"
                      onClick={(): void => {
                        removeLine(
                          line.id,
                        )
                      }}
                      style={{
                        width: 30,
                        height: 30,
                        display: 'grid',
                        placeItems:
                          'center',
                        background:
                          '#321a1a',
                        color:
                          '#ff7d7d',
                        border:
                          '1px solid #612b2b',
                        borderRadius: 6,
                        cursor:
                          'pointer',
                      }}
                    >
                      <Trash2
                        size={13}
                      />
                    </button>
                  </TableCell>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {summary.lines.length === 0 && (
        <div
          style={{
            padding: 28,
            textAlign: 'center',
            color: '#747f8d',
            fontSize: 10,
          }}
        >
          No labour roles added.
          Click Add Role to begin.
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(3, minmax(140px, 1fr))',
          gap: 10,
          padding: 14,
          background: '#111419',
          borderTop:
            '1px solid #303641',
        }}
      >
        <SummaryCard
          icon={
            <Users
              size={15}
              color="#4fc3f7"
            />
          }
          label="People"
          value={`${summary.totalPeople}`}
        />

        <SummaryCard
          icon={
            <Clock3
              size={15}
              color="#ffb74d"
            />
          }
          label="Total Hours"
          value={summary.totalHours.toFixed(
            1,
          )}
        />

        <SummaryCard
          icon={
            <Wrench
              size={15}
              color="#39ff14"
            />
          }
          label="Labour Cost"
          value={formatZAR(
            summary.totalCost,
          )}
          highlight
        />
      </div>
    </section>
  )
}

interface NumberInputProps {
  value: number
  step: number
  onChange: (
    value: number,
  ) => void
}

function NumberInput({
  value,
  step,
  onChange,
}: NumberInputProps): JSX.Element {
  return (
    <input
      type="number"
      min={0}
      step={step}
      value={
        value === 0
          ? ''
          : value
      }
      placeholder="0"
      onFocus={(event): void => {
        event.currentTarget.select()
      }}
      onChange={(event): void => {
        const text =
          event.target.value

        if (text === '') {
          onChange(0)
          return
        }

        const nextValue =
          Number(text)

        if (
          Number.isNaN(
            nextValue,
          )
        ) {
          return
        }

        onChange(
          Math.max(
            0,
            nextValue,
          ),
        )
      }}
      style={{
        ...inputStyle,
        width: 82,
        textAlign: 'right',
      }}
    />
  )
}

interface CurrencyInputProps {
  value: number

  onChange: (
    value: number,
  ) => void
}

function CurrencyInput({
  value,
  onChange,
}: CurrencyInputProps): JSX.Element {
  return (
    <div
      style={{
        position: 'relative',
        width: 118,
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 9,
          top: '50%',
          transform:
            'translateY(-50%)',
          color: '#68717d',
          fontSize: 8,
          pointerEvents: 'none',
        }}
      >
        R
      </span>

      <input
        type="number"
        min={0}
        step={25}
        value={
          value === 0
            ? ''
            : value
        }
        placeholder="0.00"
        onFocus={(event): void => {
          event.currentTarget.select()
        }}
        onChange={(event): void => {
          const text =
            event.target.value

          if (text === '') {
            onChange(0)
            return
          }

          const nextValue =
            Number(text)

          if (
            Number.isNaN(
              nextValue,
            )
          ) {
            return
          }

          onChange(
            Math.max(
              0,
              nextValue,
            ),
          )
        }}
        style={{
          ...inputStyle,
          width: '100%',
          paddingLeft: 23,
          textAlign: 'right',
        }}
      />
    </div>
  )
}

interface TableHeaderProps {
  children: string
  align?: 'left' | 'right'
}

function TableHeader({
  children,
  align = 'left',
}: TableHeaderProps): JSX.Element {
  return (
    <th
      style={{
        padding: '9px 8px',
        background: '#101318',
        borderBottom:
          '1px solid #343b47',
        color: '#68717d',
        textAlign: align,
        fontSize: 7,
        fontWeight: 900,
        letterSpacing: 0.5,
        textTransform:
          'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </th>
  )
}

interface TableCellProps {
  children:
    | string
    | number
    | JSX.Element

  align?: 'left' | 'right'

  highlight?: boolean
}

function TableCell({
  children,
  align = 'left',
  highlight = false,
}: TableCellProps): JSX.Element {
  return (
    <td
      style={{
        padding: '9px 8px',
        color: highlight
          ? '#ffd54f'
          : '#bbc2cb',
        textAlign: align,
        fontWeight: highlight
          ? 800
          : 500,
        verticalAlign: 'middle',
      }}
    >
      {children}
    </td>
  )
}

interface SummaryCardProps {
  icon: JSX.Element
  label: string
  value: string
  highlight?: boolean
}

function SummaryCard({
  icon,
  label,
  value,
  highlight = false,
}: SummaryCardProps): JSX.Element {
  return (
    <div
      style={{
        padding: 10,
        background: '#15191f',
        border:
          '1px solid #292f38',
        borderRadius: 7,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: '#68717d',
          fontSize: 8,
          fontWeight: 800,
          textTransform:
            'uppercase',
        }}
      >
        {icon}
        {label}
      </div>

      <div
        style={{
          marginTop: 5,
          color: highlight
            ? '#39ff14'
            : '#ffffff',
          fontSize: 14,
          fontWeight: 900,
        }}
      >
        {value}
      </div>
    </div>
  )
}
