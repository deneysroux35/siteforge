import {
  useMemo,
  type CSSProperties,
  type JSX,
} from 'react'

import {
  AlertTriangle,
  Calculator,
  Car,
  CircleDollarSign,
  Package,
  Percent,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  WalletCards,
  Wrench,
} from 'lucide-react'

import LabourEstimator from './LabourEstimator'

import { useDesignerStore } from '../../store/designerStore'
import { useQuoteStore } from '../../store/quoteStore'

import {
  calculateProjectSummary,
  formatZAR,
} from '../../services/projectEngine'

import {
  calculateSmartEquipment,
} from '../../services/equipmentEngine'

import {
  buildProjectBom,
} from '../../services/bomEngine'

import {
  calculateQuote,
} from '../../services/quoteEngine'

const panelStyle: CSSProperties = {
  background: '#15191f',
  border: '1px solid #303641',
  borderRadius: 10,
}

const numberInputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '9px 10px',
  background: '#101318',
  color: '#ffffff',
  border: '1px solid #343b47',
  borderRadius: 6,
  outline: 'none',
  fontSize: 11,
}

export default function QuoteBuilder(): JSX.Element {
  const walls = useDesignerStore(
    (state) => state.walls,
  )

  const cameras = useDesignerStore(
    (state) => state.cameras,
  )

  const labourCost = useQuoteStore(
    (state) => state.labourCost,
  )

  const travelCost = useQuoteStore(
    (state) => state.travelCost,
  )

  const consumablesCost = useQuoteStore(
    (state) => state.consumablesCost,
  )

  const contingencyCost = useQuoteStore(
    (state) => state.contingencyCost,
  )

  const markupPercentage = useQuoteStore(
    (state) => state.markupPercentage,
  )

  const vatPercentage = useQuoteStore(
    (state) => state.vatPercentage,
  )

  const setTravelCost = useQuoteStore(
    (state) => state.setTravelCost,
  )

  const setConsumablesCost = useQuoteStore(
    (state) => state.setConsumablesCost,
  )

  const setContingencyCost = useQuoteStore(
    (state) => state.setContingencyCost,
  )

  const setMarkupPercentage = useQuoteStore(
    (state) => state.setMarkupPercentage,
  )

  const setVatPercentage = useQuoteStore(
    (state) => state.setVatPercentage,
  )

  const projectSummary = useMemo(
    () =>
      calculateProjectSummary({
        walls,
        cameras,
      }),
    [walls, cameras],
  )

  const smartEquipment = useMemo(
    () =>
      calculateSmartEquipment(
        projectSummary,
      ),
    [projectSummary],
  )

  const bom = useMemo(
    () =>
      buildProjectBom({
        cameras,
        smartEquipment,
        estimatedCableMeters: 0,
      }),
    [
      cameras,
      smartEquipment,
    ],
  )

  const quote = useMemo(
    () =>
      calculateQuote({
        equipmentCost:
          bom.totalCost,

        labourCost,

        travelCost,

        consumablesCost,

        contingencyCost,

        markupPercentage,

        vatPercentage,
      }),
    [
      bom.totalCost,
      labourCost,
      travelCost,
      consumablesCost,
      contingencyCost,
      markupPercentage,
      vatPercentage,
    ],
  )

  const commercialHealth =
    calculateCommercialHealth({
      cameraCount:
        cameras.length,

      bomItems:
        bom.items.length,

      labourCost,

      travelCost,

      consumablesCost,

      contingencyCost,

      grossMargin:
        quote.grossMargin,
    })

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          'minmax(0, 1fr) 340px',
        gap: 14,
        alignItems: 'start',
      }}
    >
      <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, minmax(150px, 1fr))',
            gap: 10,
            marginBottom: 14,
          }}
        >
          <KpiCard
            icon={
              <Package size={17} />
            }
            label="Equipment Cost"
            value={formatZAR(
              quote.equipmentCost,
            )}
            accent="#4fc3f7"
          />

          <KpiCard
            icon={
              <CircleDollarSign
                size={17}
              />
            }
            label="Project Cost"
            value={formatZAR(
              quote.subtotalCost,
            )}
            accent="#ffb74d"
          />

          <KpiCard
            icon={
              <WalletCards
                size={17}
              />
            }
            label="Sell Ex VAT"
            value={formatZAR(
              quote.sellingPrice,
            )}
            accent="#39ff14"
          />

          <KpiCard
            icon={
              <TrendingUp
                size={17}
              />
            }
            label="Gross Profit"
            value={formatZAR(
              quote.grossProfit,
            )}
            accent="#ffd54f"
          />
        </div>

        <section
          style={{
            ...panelStyle,
            marginBottom: 14,
            overflow: 'hidden',
          }}
        >
          <SectionHeader
            icon={
              <ShoppingCart
                size={17}
                color="#39ff14"
              />
            }
            title="Equipment"
            subtitle="Live equipment from the active SiteForge design"
            badge="AUTO"
          />

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
                    Qty
                  </TableHeader>

                  <TableHeader>
                    SKU
                  </TableHeader>

                  <TableHeader>
                    Description
                  </TableHeader>

                  <TableHeader align="right">
                    Unit Cost
                  </TableHeader>

                  <TableHeader align="right">
                    Total Cost
                  </TableHeader>

                  <TableHeader>
                    Source
                  </TableHeader>
                </tr>
              </thead>

              <tbody>
                {bom.items.map(
                  (item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom:
                          '1px solid #282e38',
                      }}
                    >
                      <TableCell>
                        {item.quantity}
                      </TableCell>

                      <TableCell>
                        {item.sku}
                      </TableCell>

                      <TableCell>
                        {item.description}
                      </TableCell>

                      <TableCell align="right">
                        {formatZAR(
                          item.unitCost,
                        )}
                      </TableCell>

                      <TableCell
                        align="right"
                        highlight
                      >
                        {formatZAR(
                          item.totalCost,
                        )}
                      </TableCell>

                      <TableCell>
                        <SourceBadge
                          source={
                            item.source
                          }
                        />
                      </TableCell>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {bom.items.length === 0 && (
            <div
              style={{
                padding: 30,
                textAlign: 'center',
                color: '#747f8d',
                fontSize: 11,
              }}
            >
              Add cameras in the
              Designer to populate
              the quote automatically.
            </div>
          )}
        </section>

        <div
          style={{
            marginBottom: 14,
          }}
        >
          <LabourEstimator />
        </div>

        <section
          style={{
            ...panelStyle,
            padding: 14,
          }}
        >
          <div
            style={{
              marginBottom: 13,
            }}
          >
            <div
              style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 800,
              }}
            >
              Additional Commercial Costs
            </div>

            <div
              style={{
                marginTop: 4,
                color: '#747f8d',
                fontSize: 9,
              }}
            >
              Travel, consumables and
              contingency remain manual
              until their dedicated
              estimators are added.
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, minmax(180px, 1fr))',
              gap: 10,
            }}
          >
            <CostInput
              icon={
                <Car
                  size={15}
                  color="#ffb74d"
                />
              }
              label="Travel"
              description="Vehicle, fuel, accommodation and travel"
              value={travelCost}
              onChange={
                setTravelCost
              }
            />

            <CostInput
              icon={
                <Wrench
                  size={15}
                  color="#b388ff"
                />
              }
              label="Consumables"
              description="Fasteners, labels and installation materials"
              value={
                consumablesCost
              }
              onChange={
                setConsumablesCost
              }
            />

            <CostInput
              icon={
                <ShieldCheck
                  size={15}
                  color="#ffd54f"
                />
              }
              label="Contingency"
              description="Commercial risk allowance"
              value={
                contingencyCost
              }
              onChange={
                setContingencyCost
              }
            />
          </div>
        </section>
      </div>

      <div
        style={{
          position: 'sticky',
          top: 14,
        }}
      >
        <section
          style={{
            ...panelStyle,
            marginBottom: 12,
            padding: 14,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
              gap: 10,
            }}
          >
            <div>
              <div
                style={{
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Commercial Health
              </div>

              <div
                style={{
                  marginTop: 3,
                  color: '#747f8d',
                  fontSize: 8,
                }}
              >
                Quote readiness
              </div>
            </div>

            <div
              style={{
                color:
                  commercialHealth >=
                  80
                    ? '#39ff14'
                    : commercialHealth >=
                        60
                      ? '#ffd54f'
                      : '#ff6b6b',
                fontSize: 22,
                fontWeight: 900,
              }}
            >
              {commercialHealth}%
            </div>
          </div>

          <div
            style={{
              height: 7,
              marginTop: 11,
              overflow: 'hidden',
              background: '#0d1014',
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width:
                  `${commercialHealth}%`,
                height: '100%',
                background:
                  commercialHealth >=
                  80
                    ? '#39ff14'
                    : commercialHealth >=
                        60
                      ? '#ffd54f'
                      : '#ff6b6b',
                borderRadius: 10,
                transition:
                  'width 180ms ease',
              }}
            />
          </div>

          {commercialHealth < 100 && (
            <div
              style={{
                display: 'flex',
                alignItems:
                  'flex-start',
                gap: 7,
                marginTop: 11,
                padding: 8,
                background: '#211b10',
                border:
                  '1px solid #54421e',
                borderRadius: 6,
                color: '#d8b568',
                fontSize: 8,
                lineHeight: 1.45,
              }}
            >
              <AlertTriangle
                size={12}
                style={{
                  flexShrink: 0,
                  marginTop: 1,
                }}
              />

              Add missing commercial
              costs before issuing
              the final quotation.
            </div>
          )}
        </section>

        <section
          style={{
            ...panelStyle,
            marginBottom: 12,
            padding: 14,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              marginBottom: 12,
            }}
          >
            <Percent
              size={15}
              color="#39ff14"
            />

            <div
              style={{
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Margin Simulator
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                color: '#747f8d',
                fontSize: 9,
              }}
            >
              Markup
            </span>

            <span
              style={{
                color: '#39ff14',
                fontSize: 16,
                fontWeight: 900,
              }}
            >
              {markupPercentage.toFixed(
                0,
              )}
              %
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={markupPercentage}
            onChange={(event): void => {
              setMarkupPercentage(
                Number(
                  event.target.value,
                ),
              )
            }}
            style={{
              width: '100%',
              accentColor: '#39ff14',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              marginTop: 5,
              color: '#59616d',
              fontSize: 7,
            }}
          >
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>

          <div
            style={{
              marginTop: 13,
              paddingTop: 11,
              borderTop:
                '1px solid #292f38',
            }}
          >
            <SummaryRow
              label="Actual GP Margin"
              value={`${quote.grossMargin.toFixed(
                2,
              )}%`}
              highlight
            />

            <SummaryRow
              label="Gross Profit"
              value={formatZAR(
                quote.grossProfit,
              )}
            />
          </div>
        </section>

        <section
          style={{
            ...panelStyle,
            marginBottom: 12,
            padding: 14,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              marginBottom: 10,
            }}
          >
            <Receipt
              size={15}
              color="#4fc3f7"
            />

            <div
              style={{
                color: '#ffffff',
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              Tax
            </div>
          </div>

          <label
            style={{
              display: 'block',
              marginBottom: 5,
              color: '#747f8d',
              fontSize: 8,
            }}
          >
            VAT %
          </label>

          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={
              vatPercentage === 0
                ? ''
                : vatPercentage
            }
            onFocus={(event): void => {
              event.currentTarget.select()
            }}
            onChange={(event): void => {
              const text =
                event.target.value

              if (text === '') {
                setVatPercentage(0)
                return
              }

              const value =
                Number(text)

              if (
                Number.isNaN(value)
              ) {
                return
              }

              setVatPercentage(
                Math.max(
                  0,
                  value,
                ),
              )
            }}
            style={
              numberInputStyle
            }
          />
        </section>

        <section
          style={{
            ...panelStyle,
            padding: 15,
            background:
              'linear-gradient(145deg, #202614, #11150f)',
            border:
              '1px solid #596428',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              marginBottom: 12,
              color: '#d8df9a',
              fontSize: 12,
              fontWeight: 900,
            }}
          >
            <Calculator
              size={16}
              color="#39ff14"
            />

            Quote Summary
          </div>

          <SummaryRow
            label="Equipment"
            value={formatZAR(
              quote.equipmentCost,
            )}
          />

          <SummaryRow
            label="Labour"
            value={formatZAR(
              quote.labourCost,
            )}
          />

          <SummaryRow
            label="Travel"
            value={formatZAR(
              quote.travelCost,
            )}
          />

          <SummaryRow
            label="Consumables"
            value={formatZAR(
              quote.consumablesCost,
            )}
          />

          <SummaryRow
            label="Contingency"
            value={formatZAR(
              quote.contingencyCost,
            )}
          />

          <Divider />

          <SummaryRow
            label="Total Cost"
            value={formatZAR(
              quote.subtotalCost,
            )}
          />

          <SummaryRow
            label="Selling Price"
            value={formatZAR(
              quote.sellingPrice,
            )}
          />

          <SummaryRow
            label={`VAT (${vatPercentage.toFixed(
              1,
            )}%)`}
            value={formatZAR(
              quote.vatAmount,
            )}
          />

          <Divider />

          <div
            style={{
              marginTop: 8,
            }}
          >
            <div
              style={{
                color: '#8d976d',
                fontSize: 9,
                fontWeight: 800,
                textTransform:
                  'uppercase',
                letterSpacing: 0.7,
              }}
            >
              Grand Total
            </div>

            <div
              style={{
                marginTop: 4,
                color: '#39ff14',
                fontSize: 25,
                fontWeight: 900,
              }}
            >
              {formatZAR(
                quote.grandTotal,
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

interface CostInputProps {
  icon: JSX.Element
  label: string
  description: string
  value: number

  onChange: (
    value: number,
  ) => void
}

function CostInput({
  icon,
  label,
  description,
  value,
  onChange,
}: CostInputProps): JSX.Element {
  return (
    <div
      style={{
        padding: 11,
        background: '#111419',
        border:
          '1px solid #292f38',
        borderRadius: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          marginBottom: 4,
          color: '#ffffff',
          fontSize: 10,
          fontWeight: 800,
        }}
      >
        {icon}

        {label}
      </div>

      <div
        style={{
          minHeight: 24,
          color: '#68717d',
          fontSize: 8,
          lineHeight: 1.4,
        }}
      >
        {description}
      </div>

      <div
        style={{
          position: 'relative',
          marginTop: 7,
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 10,
            top: '50%',
            transform:
              'translateY(-50%)',
            color: '#68717d',
            fontSize: 9,
            pointerEvents: 'none',
          }}
        >
          R
        </span>

        <input
          type="number"
          min={0}
          step={100}
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
            ...numberInputStyle,
            paddingLeft: 25,
          }}
        />
      </div>
    </div>
  )
}

interface KpiCardProps {
  icon: JSX.Element
  label: string
  value: string
  accent: string
}

function KpiCard({
  icon,
  label,
  value,
  accent,
}: KpiCardProps): JSX.Element {
  return (
    <div
      style={{
        ...panelStyle,
        padding: 13,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          color: accent,
        }}
      >
        {icon}

        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: accent,
            boxShadow:
              `0 0 8px ${accent}`,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 9,
          color: '#68717d',
          fontSize: 8,
          fontWeight: 900,
          textTransform:
            'uppercase',
          letterSpacing: 0.6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 4,
          color: '#ffffff',
          fontSize: 15,
          fontWeight: 900,
        }}
      >
        {value}
      </div>
    </div>
  )
}

interface SectionHeaderProps {
  icon: JSX.Element
  title: string
  subtitle: string
  badge?: string
}

function SectionHeader({
  icon,
  title,
  subtitle,
  badge,
}: SectionHeaderProps): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent:
          'space-between',
        padding: 14,
        borderBottom:
          '1px solid #303641',
        background: '#171b21',
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
          {icon}

          {title}
        </div>

        <div
          style={{
            marginTop: 3,
            color: '#68717d',
            fontSize: 8,
          }}
        >
          {subtitle}
        </div>
      </div>

      {badge && (
        <div
          style={{
            padding: '4px 7px',
            color: '#39ff14',
            background: '#173619',
            border:
              '1px solid #2f7a34',
            borderRadius: 5,
            fontSize: 7,
            fontWeight: 900,
          }}
        >
          {badge}
        </div>
      )}
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
      }}
    >
      {children}
    </td>
  )
}

interface SourceBadgeProps {
  source:
    | 'camera'
    | 'smart-equipment'
    | 'estimate'
}

function SourceBadge({
  source,
}: SourceBadgeProps): JSX.Element {
  const label =
    source ===
    'smart-equipment'
      ? 'AUTO'
      : source ===
          'estimate'
        ? 'ESTIMATE'
        : 'DESIGN'

  const accent =
    source ===
    'smart-equipment'
      ? '#39ff14'
      : source ===
          'estimate'
        ? '#ffd54f'
        : '#4fc3f7'

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 6px',
        border:
          `1px solid ${accent}55`,
        borderRadius: 4,
        color: accent,
        fontSize: 7,
        fontWeight: 900,
      }}
    >
      {label}
    </span>
  )
}

interface SummaryRowProps {
  label: string
  value: string
  highlight?: boolean
}

function SummaryRow({
  label,
  value,
  highlight = false,
}: SummaryRowProps): JSX.Element {
  return (
    <div
      style={{
        minHeight: 31,
        display: 'flex',
        alignItems: 'center',
        justifyContent:
          'space-between',
        gap: 12,
      }}
    >
      <span
        style={{
          color: '#8d976d',
          fontSize: 9,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: highlight
            ? '#39ff14'
            : '#ffffff',
          fontSize: highlight
            ? 12
            : 10,
          fontWeight: 900,
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function Divider(): JSX.Element {
  return (
    <div
      style={{
        height: 1,
        margin: '6px 0',
        background: '#35401f',
      }}
    />
  )
}

interface CommercialHealthInput {
  cameraCount: number
  bomItems: number
  labourCost: number
  travelCost: number
  consumablesCost: number
  contingencyCost: number
  grossMargin: number
}

function calculateCommercialHealth({
  cameraCount,
  bomItems,
  labourCost,
  travelCost,
  consumablesCost,
  contingencyCost,
  grossMargin,
}: CommercialHealthInput): number {
  let score = 0

  if (cameraCount > 0) {
    score += 20
  }

  if (bomItems > 0) {
    score += 20
  }

  if (labourCost > 0) {
    score += 15
  }

  if (travelCost > 0) {
    score += 10
  }

  if (consumablesCost > 0) {
    score += 10
  }

  if (contingencyCost > 0) {
    score += 10
  }

  if (grossMargin >= 20) {
    score += 15
  }

  return Math.min(
    100,
    score,
  )
}
