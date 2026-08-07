import type {
  CSSProperties,
  JSX,
} from 'react'

import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  CircleDollarSign,
  FolderKanban,
  Gauge,
  Plus,
  Users,
} from 'lucide-react'

import {
  useDesignerStore,
} from '../store/designerStore'

import {
  useProjectStore,
} from '../store/projectStore'

import {
  useQuoteStore,
} from '../store/quoteStore'

import {
  calculateProjectSummary,
  formatZAR,
} from '../services/projectEngine'

import {
  calculateSmartEquipment,
} from '../services/equipmentEngine'

import {
  buildProjectBom,
} from '../services/bomEngine'

import {
  calculateQuote,
} from '../services/quoteEngine'

const panelStyle: CSSProperties = {
  background: '#15191f',
  border: '1px solid #303641',
  borderRadius: 10,
}

export default function Dashboard(): JSX.Element {
  const project =
    useProjectStore(
      (state) => state.project,
    )

  const walls =
    useDesignerStore(
      (state) => state.walls,
    )

  const cameras =
    useDesignerStore(
      (state) => state.cameras,
    )

  const labourCost =
    useQuoteStore(
      (state) => state.labourCost,
    )

  const travelCost =
    useQuoteStore(
      (state) => state.travelCost,
    )

  const consumablesCost =
    useQuoteStore(
      (state) => state.consumablesCost,
    )

  const contingencyCost =
    useQuoteStore(
      (state) => state.contingencyCost,
    )

  const markupPercentage =
    useQuoteStore(
      (state) => state.markupPercentage,
    )

  const vatPercentage =
    useQuoteStore(
      (state) => state.vatPercentage,
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

  const bom =
    buildProjectBom({
      cameras,
      smartEquipment,
      estimatedCableMeters: 0,
    })

  const quote =
    calculateQuote({
      equipmentCost:
        bom.totalCost,

      labourCost,

      travelCost,

      consumablesCost,

      contingencyCost,

      markupPercentage,

      vatPercentage,
    })

  const health =
    calculateHealth({
      cameras:
        cameras.length,

      bomItems:
        bom.items.length,

      warnings:
        smartEquipment.warnings.length,

      labour:
        labourCost,

      margin:
        quote.grossMargin,
    })

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        background: '#0f1115',
        color: '#ffffff',
        fontFamily:
          'Segoe UI, sans-serif',
      }}
    >
      <header
        style={{
          padding:
            '22px 24px',
          background:
            '#13171d',
          borderBottom:
            '1px solid #303641',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                color: '#39ff14',
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: 1.2,
                textTransform:
                  'uppercase',
              }}
            >
              SiteForge Professional
            </div>

            <h1
              style={{
                margin:
                  '7px 0 0',
                fontSize: 24,
              }}
            >
              Dashboard
            </h1>

            <div
              style={{
                marginTop: 5,
                color: '#747f8d',
                fontSize: 10,
              }}
            >
              Active project:{' '}
              <strong
                style={{
                  color: '#c7ced7',
                }}
              >
                {project.name}
              </strong>
            </div>
          </div>

          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding:
                '9px 12px',
              background:
                '#173619',
              color:
                '#39ff14',
              border:
                '1px solid #2f7a34',
              borderRadius: 7,
              cursor: 'pointer',
              fontSize: 10,
              fontWeight: 900,
            }}
          >
            <Plus size={14} />
            New Project
          </button>
        </div>
      </header>

      <main
        style={{
          padding: 20,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, minmax(170px, 1fr))',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <DashboardKpi
            icon={
              <FolderKanban
                size={18}
              />
            }
            label="Current Project"
            value={project.name}
            accent="#4fc3f7"
          />

          <DashboardKpi
            icon={
              <BriefcaseBusiness
                size={18}
              />
            }
            label="Cameras"
            value={`${cameras.length}`}
            accent="#39ff14"
          />

          <DashboardKpi
            icon={
              <CircleDollarSign
                size={18}
              />
            }
            label="Quote Total"
            value={formatZAR(
              quote.grandTotal,
            )}
            accent="#ffd54f"
          />

          <DashboardKpi
            icon={
              <Gauge size={18} />
            }
            label="Project Health"
            value={`${health}%`}
            accent={
              health >= 80
                ? '#39ff14'
                : health >= 60
                  ? '#ffd54f'
                  : '#ff6b6b'
            }
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1.6fr) minmax(300px, 1fr)',
            gap: 14,
          }}
        >
          <section
            style={{
              ...panelStyle,
              overflow:
                'hidden',
            }}
          >
            <PanelHeader
              icon={
                <Activity
                  size={16}
                  color="#39ff14"
                />
              }
              title="Project Overview"
              subtitle="Live engineering and commercial status"
            />

            <div
              style={{
                padding: 14,
              }}
            >
              <StatusRow
                label="Walls"
                value={`${walls.length}`}
              />

              <StatusRow
                label="Cameras"
                value={`${cameras.length}`}
              />

              <StatusRow
                label="BOM Lines"
                value={`${bom.items.length}`}
              />

              <StatusRow
                label="Storage Estimate"
                value={`${summary.estimatedStorageTB.toFixed(
                  2,
                )} TB`}
              />

              <StatusRow
                label="Camera Power"
                value={`${summary.totalCameraPower.toFixed(
                  1,
                )} W`}
              />

              <StatusRow
                label="Equipment Cost"
                value={formatZAR(
                  bom.totalCost,
                )}
              />

              <StatusRow
                label="Selling Price"
                value={formatZAR(
                  quote.sellingPrice,
                )}
              />

              <StatusRow
                label="Gross Margin"
                value={`${quote.grossMargin.toFixed(
                  2,
                )}%`}
                last
              />
            </div>
          </section>

          <section
            style={{
              ...panelStyle,
              overflow:
                'hidden',
            }}
          >
            <PanelHeader
              icon={
                <BarChart3
                  size={16}
                  color="#4fc3f7"
                />
              }
              title="Project Health"
              subtitle="Current readiness snapshot"
            />

            <div
              style={{
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color:
                    health >= 80
                      ? '#39ff14'
                      : health >= 60
                        ? '#ffd54f'
                        : '#ff6b6b',
                }}
              >
                {health}%
              </div>

              <div
                style={{
                  height: 8,
                  marginTop: 12,
                  overflow:
                    'hidden',
                  background:
                    '#0d1014',
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width:
                      `${health}%`,
                    height: '100%',
                    background:
                      health >= 80
                        ? '#39ff14'
                        : health >= 60
                          ? '#ffd54f'
                          : '#ff6b6b',
                    borderRadius: 10,
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 14,
                }}
              >
                <HealthItem
                  label="Engineering"
                  ok={
                    cameras.length > 0
                  }
                />

                <HealthItem
                  label="Equipment"
                  ok={
                    bom.items.length > 0
                  }
                />

                <HealthItem
                  label="Warnings"
                  ok={
                    smartEquipment
                      .warnings.length ===
                    0
                  }
                />

                <HealthItem
                  label="Labour"
                  ok={
                    labourCost > 0
                  }
                />

                <HealthItem
                  label="Commercial Margin"
                  ok={
                    quote.grossMargin >=
                    20
                  }
                  last
                />
              </div>
            </div>
          </section>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(3, minmax(220px, 1fr))',
            gap: 14,
            marginTop: 14,
          }}
        >
          <QuickPanel
            title="Recent Projects"
            icon={
              <FolderKanban
                size={15}
              />
            }
            items={[
              project.name,
              'No additional recent projects yet',
            ]}
          />

          <QuickPanel
            title="Customers"
            icon={
              <Users size={15} />
            }
            items={[
              'Customer workspace ready for next sprint',
              'Project/customer linking coming soon',
            ]}
          />

          <QuickPanel
            title="Commercial"
            icon={
              <CircleDollarSign
                size={15}
              />
            }
            items={[
              `Cost: ${formatZAR(
                quote.subtotalCost,
              )}`,
              `Sell: ${formatZAR(
                quote.sellingPrice,
              )}`,
              `GP: ${formatZAR(
                quote.grossProfit,
              )}`,
            ]}
          />
        </div>
      </main>
    </div>
  )
}

interface DashboardKpiProps {
  icon: JSX.Element
  label: string
  value: string
  accent: string
}

function DashboardKpi({
  icon,
  label,
  value,
  accent,
}: DashboardKpiProps): JSX.Element {
  return (
    <div
      style={{
        ...panelStyle,
        padding: 14,
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
            borderRadius:
              '50%',
            background:
              accent,
            boxShadow:
              `0 0 8px ${accent}`,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 10,
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
          overflow: 'hidden',
          color: '#ffffff',
          fontSize: 16,
          fontWeight: 900,
          textOverflow:
            'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
    </div>
  )
}

interface PanelHeaderProps {
  icon: JSX.Element
  title: string
  subtitle: string
}

function PanelHeader({
  icon,
  title,
  subtitle,
}: PanelHeaderProps): JSX.Element {
  return (
    <div
      style={{
        padding: 14,
        background:
          '#171b21',
        borderBottom:
          '1px solid #303641',
      }}
    >
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
  )
}

interface StatusRowProps {
  label: string
  value: string
  last?: boolean
}

function StatusRow({
  label,
  value,
  last = false,
}: StatusRowProps): JSX.Element {
  return (
    <div
      style={{
        minHeight: 38,
        display: 'flex',
        alignItems: 'center',
        justifyContent:
          'space-between',
        borderBottom:
          last
            ? 'none'
            : '1px solid #292f38',
      }}
    >
      <span
        style={{
          color: '#7f8996',
          fontSize: 10,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        {value}
      </span>
    </div>
  )
}

interface HealthItemProps {
  label: string
  ok: boolean
  last?: boolean
}

function HealthItem({
  label,
  ok,
  last = false,
}: HealthItemProps): JSX.Element {
  return (
    <div
      style={{
        minHeight: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent:
          'space-between',
        borderBottom:
          last
            ? 'none'
            : '1px solid #292f38',
      }}
    >
      <span
        style={{
          color: '#7f8996',
          fontSize: 9,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: ok
            ? '#39ff14'
            : '#ffbd66',
          fontSize: 9,
          fontWeight: 900,
        }}
      >
        {ok
          ? 'PASS'
          : 'REVIEW'}
      </span>
    </div>
  )
}

interface QuickPanelProps {
  title: string
  icon: JSX.Element
  items: string[]
}

function QuickPanel({
  title,
  icon,
  items,
}: QuickPanelProps): JSX.Element {
  return (
    <section
      style={{
        ...panelStyle,
        padding: 14,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          marginBottom: 10,
          color: '#ffffff',
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        {icon}
        {title}
      </div>

      {items.map(
        (item, index) => (
          <div
            key={`${item}-${index}`}
            style={{
              padding:
                '8px 0',
              color:
                '#7f8996',
              borderBottom:
                index ===
                items.length - 1
                  ? 'none'
                  : '1px solid #292f38',
              fontSize: 9,
              lineHeight: 1.4,
            }}
          >
            {item}
          </div>
        ),
      )}
    </section>
  )
}

interface HealthInput {
  cameras: number
  bomItems: number
  warnings: number
  labour: number
  margin: number
}

function calculateHealth({
  cameras,
  bomItems,
  warnings,
  labour,
  margin,
}: HealthInput): number {
  let score = 0

  if (
    cameras > 0
  ) {
    score += 25
  }

  if (
    bomItems > 0
  ) {
    score += 25
  }

  if (
    warnings === 0
  ) {
    score += 20
  }

  if (
    labour > 0
  ) {
    score += 15
  }

  if (
    margin >= 20
  ) {
    score += 15
  }

  return Math.min(
    100,
    score,
  )
}
