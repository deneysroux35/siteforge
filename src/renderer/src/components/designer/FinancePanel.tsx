import type {
  CSSProperties,
  JSX,
} from 'react'

import {
  AlertTriangle,
  Banknote,
  Calculator,
  CalendarDays,
  FileSpreadsheet,
  Landmark,
  Percent,
  ReceiptText,
  WalletCards,
} from 'lucide-react'

import {
  calculateFinanceComparison,
  formatFinanceCurrency,
} from '../../services/financeEngine'

import {
  useFinanceStore,
} from '../../store/financeStore'

import {
  useDesignerStore,
} from '../../store/designerStore'

import {
  calculateProjectSummary,
} from '../../services/projectEngine'

import {
  calculateSmartEquipment,
} from '../../services/equipmentEngine'

const cardStyle:
  CSSProperties = {
    marginBottom: 10,

    padding: 11,

    background:
      '#111419',

    border:
      '1px solid #292f38',

    borderRadius:
      8,
  }

const rowStyle:
  CSSProperties = {
    display: 'flex',

    alignItems:
      'center',

    justifyContent:
      'space-between',

    gap: 10,
  }

const labelStyle:
  CSSProperties = {
    color:
      '#8f99a6',

    fontSize:
      10,
  }

const valueStyle:
  CSSProperties = {
    color:
      '#ffffff',

    fontSize:
      11,

    fontWeight:
      800,

    textAlign:
      'right',
  }

export default function FinancePanel(): JSX.Element {
  const walls =
    useDesignerStore(
      (state) =>
        state.walls,
    )

  const cameras =
    useDesignerStore(
      (state) =>
        state.cameras,
    )

  const profiles =
    useFinanceStore(
      (state) =>
        state.profiles,
    )

  const selectedProfileId =
    useFinanceStore(
      (state) =>
        state.selectedProfileId,
    )

  const selectProfile =
    useFinanceStore(
      (state) =>
        state.selectProfile,
    )

  const summary =
    calculateProjectSummary({
      walls,
      cameras,
    })

  const smartEquipment =
    calculateSmartEquipment(
      summary,
    )

  const selectedProfile =
    profiles.find(
      (profile) =>
        profile.id ===
        selectedProfileId,
    ) ??
    profiles[0]

  const cashPrice =
    summary.totalCameraCost +
    smartEquipment.infrastructureCost

  if (!selectedProfile) {
    return (
      <div
        style={{
          padding: 12,

          background:
            '#111419',

          border:
            '1px solid #292f38',

          borderRadius:
            8,

          color:
            '#747f8d',

          fontSize:
            10,
        }}
      >
        No finance profiles
        are available.
      </div>
    )
  }

  const comparison =
    calculateFinanceComparison(
      cashPrice,
      selectedProfile,
    )

  const factorMode =
    selectedProfile.calculationMode ===
    'factor-sheet'

  return (
    <div>
      <div
        style={{
          marginBottom: 8,

          color:
            '#68717d',

          fontSize:
            9,

          fontWeight:
            900,

          letterSpacing:
            1,

          textTransform:
            'uppercase',
        }}
      >
        Finance Profile
      </div>

      <div
        style={
          cardStyle
        }
      >
        <label
          style={{
            display:
              'block',

            marginBottom:
              6,

            color:
              '#9fa8b5',

            fontSize:
              10,

            fontWeight:
              800,
          }}
        >
          Provider / Profile
        </label>

        <select
          value={
            selectedProfile.id
          }
          onChange={(
            event,
          ): void => {
            selectProfile(
              event.target.value,
            )
          }}
          style={{
            width:
              '100%',

            padding:
              '9px 10px',

            background:
              '#20242b',

            color:
              '#ffffff',

            border:
              '1px solid #3a414d',

            borderRadius:
              6,

            outline:
              'none',

            fontSize:
              11,
          }}
        >
          {profiles.map(
            (profile) => (
              <option
                key={
                  profile.id
                }
                value={
                  profile.id
                }
              >
                {
                  profile.name
                }
              </option>
            ),
          )}
        </select>

        <div
          style={{
            display:
              'flex',

            alignItems:
              'center',

            gap: 7,

            marginTop:
              10,

            padding:
              '7px 8px',

            background:
              factorMode
                ? '#17243a'
                : '#172718',

            border:
              factorMode
                ? '1px solid #2e5989'
                : '1px solid #2f6735',

            borderRadius:
              6,

            color:
              factorMode
                ? '#66b7ff'
                : '#39ff14',

            fontSize:
              9,

            fontWeight:
              900,
          }}
        >
          {factorMode ? (
            <FileSpreadsheet
              size={13}
            />
          ) : (
            <Calculator
              size={13}
            />
          )}

          {factorMode
            ? 'FACTOR SHEET MODE'
            : 'CALCULATED FINANCE MODE'}
        </div>
      </div>

      <div
        style={{
          marginBottom:
            8,

          color:
            '#68717d',

          fontSize:
            9,

          fontWeight:
            900,

          letterSpacing:
            1,

          textTransform:
            'uppercase',
        }}
      >
        Cash Purchase
      </div>

      <div
        style={{
          ...cardStyle,

          background:
            'linear-gradient(135deg, #222714, #171b13)',

          border:
            '1px solid #5d6428',
        }}
      >
        <div
          style={
            rowStyle
          }
        >
          <div
            style={{
              display:
                'flex',

              alignItems:
                'center',

              gap: 8,

              color:
                '#d8df9a',

              fontSize:
                11,

              fontWeight:
                800,
            }}
          >
            <WalletCards
              size={15}
              color="#ffd54f"
            />

            Cash Price
          </div>

          <div
            style={{
              color:
                '#ffd54f',

              fontSize:
                15,

              fontWeight:
                900,
            }}
          >
            {formatFinanceCurrency(
              comparison.cashPrice,
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          margin:
            '14px 0 8px',

          color:
            '#68717d',

          fontSize:
            9,

          fontWeight:
            900,

          letterSpacing:
            1,

          textTransform:
            'uppercase',
        }}
      >
        Rental Options
      </div>

      {comparison.options.map(
        (option) => (
          <div
            key={
              option.termMonths
            }
            style={{
              ...cardStyle,

              border:
                option.valid
                  ? option.termMonths ===
                    36
                    ? '1px solid #3d7c45'
                    : '1px solid #292f38'
                  : '1px solid #6f4918',
            }}
          >
            <div
              style={{
                display:
                  'flex',

                alignItems:
                  'flex-start',

                justifyContent:
                  'space-between',

                gap: 10,
              }}
            >
              <div>
                <div
                  style={{
                    display:
                      'flex',

                    alignItems:
                      'center',

                    gap: 7,

                    color:
                      '#9fa8b5',

                    fontSize:
                      10,

                    fontWeight:
                      800,
                  }}
                >
                  <CalendarDays
                    size={14}
                    color="#4fc3f7"
                  />

                  {
                    option.termMonths
                  }{' '}
                  Months
                </div>
              </div>

              <div
                style={{
                  textAlign:
                    'right',
                }}
              >
                <div
                  style={{
                    color:
                      option.valid
                        ? '#39ff14'
                        : '#ffbd66',

                    fontSize:
                      15,

                    fontWeight:
                      900,
                  }}
                >
                  {option.valid
                    ? formatFinanceCurrency(
                        option.firstYearMonthlyTotal,
                      )
                    : 'Factor Required'}
                </div>

                {option.valid && (
                  <div
                    style={{
                      marginTop:
                        2,

                      color:
                        '#68717d',

                      fontSize:
                        8,
                    }}
                  >
                    per month
                  </div>
                )}
              </div>
            </div>

            {factorMode && (
              <div
                style={{
                  marginTop:
                    10,

                  paddingTop:
                    9,

                  borderTop:
                    '1px solid #292f38',
                }}
              >
                <div
                  style={
                    rowStyle
                  }
                >
                  <span
                    style={
                      labelStyle
                    }
                  >
                    Factor
                  </span>

                  <span
                    style={{
                      ...valueStyle,

                      color:
                        option.valid
                          ? '#66b7ff'
                          : '#ffbd66',
                    }}
                  >
                    {option.factorUsed &&
                    option.factorUsed >
                      0
                      ? option.factorUsed.toFixed(
                          6,
                        )
                      : 'Not entered'}
                  </span>
                </div>

                <div
                  style={{
                    ...rowStyle,

                    marginTop:
                      6,
                  }}
                >
                  <span
                    style={
                      labelStyle
                    }
                  >
                    Factor Basis
                  </span>

                  <span
                    style={
                      valueStyle
                    }
                  >
                    {selectedProfile.factorBasis ===
                    'per-1000'
                      ? 'Per R1,000'
                      : 'Multiplier'}
                  </span>
                </div>
              </div>
            )}

            {!option.valid &&
              option.warning && (
                <div
                  style={{
                    display:
                      'flex',

                    alignItems:
                      'flex-start',

                    gap: 7,

                    marginTop:
                      10,

                    padding:
                      8,

                    background:
                      '#33230f',

                    border:
                      '1px solid #6f4918',

                    borderRadius:
                      6,

                    color:
                      '#ffbd66',

                    fontSize:
                      9,

                    lineHeight:
                      1.45,
                  }}
                >
                  <AlertTriangle
                    size={13}
                    style={{
                      flexShrink:
                        0,
                    }}
                  />

                  {
                    option.warning
                  }
                </div>
              )}

            {option.valid && (
              <div
                style={{
                  display:
                    'grid',

                  gridTemplateColumns:
                    '1fr 1fr',

                  gap: 8,

                  marginTop:
                    10,

                  paddingTop:
                    10,

                  borderTop:
                    '1px solid #292f38',
                }}
              >
                <Metric
                  icon={
                    <Banknote
                      size={12}
                      color="#39ff14"
                    />
                  }
                  label="Financed"
                  value={formatFinanceCurrency(
                    option.financedAmount,
                  )}
                />

                <Metric
                  icon={
                    <ReceiptText
                      size={12}
                      color="#4fc3f7"
                    />
                  }
                  label="Fee"
                  value={formatFinanceCurrency(
                    option.onceOffFee,
                  )}
                />

                <Metric
                  icon={
                    <Percent
                      size={12}
                      color="#ffb74d"
                    />
                  }
                  label="Residual"
                  value={formatFinanceCurrency(
                    option.residualAmount,
                  )}
                />

                <Metric
                  icon={
                    <Landmark
                      size={12}
                      color="#ffd54f"
                    />
                  }
                  label="Total"
                  value={formatFinanceCurrency(
                    option.totalEstimatedCost,
                  )}
                />
              </div>
            )}
          </div>
        ),
      )}

      {factorMode && (
        <div
          style={{
            padding:
              10,

            background:
              '#17243a',

            border:
              '1px solid #2e5989',

            borderRadius:
              7,

            color:
              '#9ccfff',

            fontSize:
              9,

            lineHeight:
              1.5,
          }}
        >
          This profile is ready
          for an official finance
          factor sheet. The 24,
          36 and 60 month factors
          currently remain blank.
        </div>
      )}
    </div>
  )
}

interface MetricProps {
  icon:
    JSX.Element

  label:
    string

  value:
    string
}

function Metric({
  icon,
  label,
  value,
}: MetricProps): JSX.Element {
  return (
    <div>
      <div
        style={{
          display:
            'flex',

          alignItems:
            'center',

          gap: 5,

          color:
            '#68717d',

          fontSize:
            8,
        }}
      >
        {icon}

        {label}
      </div>

      <div
        style={{
          marginTop:
            3,

          color:
            '#ffffff',

          fontSize:
            10,

          fontWeight:
            800,
        }}
      >
        {value}
      </div>
    </div>
  )
}
