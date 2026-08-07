import type { CSSProperties, JSX } from 'react'

import {
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  PlugZap,
  Server,
  ShieldCheck,
  WalletCards,
  Zap,
} from 'lucide-react'

import { useDesignerStore } from '../../store/designerStore'

import {
  calculateProjectSummary,
  formatZAR,
} from '../../services/projectEngine'

import {
  calculateSmartEquipment,
} from '../../services/equipmentEngine'

const cardStyle: CSSProperties = {
  marginBottom: 9,
  padding: 11,
  background: '#111419',
  border: '1px solid #292f38',
  borderRadius: 8,
}

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
}

const labelStyle: CSSProperties = {
  color: '#8f99a6',
  fontSize: 10,
}

const valueStyle: CSSProperties = {
  color: '#ffffff',
  fontSize: 11,
  fontWeight: 800,
  textAlign: 'right',
}

export default function SmartEquipmentPanel(): JSX.Element {
  const walls = useDesignerStore(
    (state) => state.walls,
  )

  const cameras = useDesignerStore(
    (state) => state.cameras,
  )

  const summary =
    calculateProjectSummary({
      walls,
      cameras,
    })

  const recommendation =
    calculateSmartEquipment(
      summary,
    )

  const nvr =
    recommendation.nvr

  const poeSwitch =
    recommendation.poeSwitch

  const storage =
    recommendation.storage

  const ups =
    recommendation.ups

  const integratedPoe =
    Boolean(
      nvr &&
        nvr.poePorts >=
          summary.cameraCount &&
        nvr.poePorts > 0,
    )

  if (
    summary.cameraCount === 0
  ) {
    return (
      <div
        style={{
          padding: 12,
          background: '#111419',
          border: '1px solid #292f38',
          borderRadius: 8,
          color: '#747f8d',
          fontSize: 10,
          lineHeight: 1.5,
        }}
      >
        Place cameras on the canvas to generate
        automatic NVR, PoE, storage and UPS
        recommendations.
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
          padding: 9,
          background:
            recommendation.warnings.length === 0
              ? '#122918'
              : '#33230f',
          border:
            recommendation.warnings.length === 0
              ? '1px solid #286b35'
              : '1px solid #6f4918',
          borderRadius: 8,
          color:
            recommendation.warnings.length === 0
              ? '#39ff14'
              : '#ffbd66',
          fontSize: 10,
          fontWeight: 800,
        }}
      >
        {recommendation.warnings.length === 0 ? (
          <CheckCircle2 size={15} />
        ) : (
          <AlertTriangle size={15} />
        )}

        {recommendation.warnings.length === 0
          ? 'Smart equipment sizing passed.'
          : `${recommendation.warnings.length} design warning${
              recommendation.warnings.length === 1
                ? ''
                : 's'
            }`}
      </div>

      <div
        style={{
          marginBottom: 8,
          color: '#68717d',
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        Recorder
      </div>

      <div style={cardStyle}>
        <div style={rowStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#9fa8b5',
              fontSize: 11,
            }}
          >
            <Server
              size={14}
              color="#4fc3f7"
            />

            Recommended NVR
          </div>

          <div style={valueStyle}>
            {nvr
              ? nvr.model
              : 'Not found'}
          </div>
        </div>

        {nvr && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 8,
              marginTop: 10,
              paddingTop: 10,
              borderTop:
                '1px solid #292f38',
            }}
          >
            <Metric
              label="Channels"
              value={`${nvr.channels}`}
            />

            <Metric
              label="Max Resolution"
              value={`${nvr.maxResolutionMP} MP`}
            />

            <Metric
              label="PoE Ports"
              value={`${nvr.poePorts}`}
            />

            <Metric
              label="SATA Bays"
              value={`${nvr.sataBays}`}
            />

            <Metric
              label="Bandwidth"
              value={`${nvr.incomingBandwidthMbps} Mbps`}
            />

            <Metric
              label="Sell Price"
              value={formatZAR(
                nvr.sellPrice,
              )}
              highlight
            />
          </div>
        )}
      </div>

      <div
        style={{
          margin: '14px 0 8px',
          color: '#68717d',
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        Network / PoE
      </div>

      <div style={cardStyle}>
        <div style={rowStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#9fa8b5',
              fontSize: 11,
            }}
          >
            <PlugZap
              size={14}
              color="#39ff14"
            />

            PoE Source
          </div>

          <div style={valueStyle}>
            {integratedPoe
              ? `${nvr?.model} integrated`
              : poeSwitch
                ? poeSwitch.model
                : 'Not found'}
          </div>
        </div>

        {integratedPoe && (
          <div
            style={{
              marginTop: 10,
              paddingTop: 10,
              borderTop:
                '1px solid #292f38',
              color: '#39ff14',
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            Separate PoE switch not required.
          </div>
        )}

        {!integratedPoe &&
          poeSwitch && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr',
                gap: 8,
                marginTop: 10,
                paddingTop: 10,
                borderTop:
                  '1px solid #292f38',
              }}
            >
              <Metric
                label="PoE Ports"
                value={`${poeSwitch.poePorts}`}
              />

              <Metric
                label="Power Budget"
                value={`${poeSwitch.poeBudgetWatts} W`}
              />

              <Metric
                label="Managed"
                value={
                  poeSwitch.managed
                    ? 'Yes'
                    : 'No'
                }
              />

              <Metric
                label="Sell Price"
                value={formatZAR(
                  poeSwitch.sellPrice,
                )}
                highlight
              />
            </div>
          )}
      </div>

      <div
        style={{
          margin: '14px 0 8px',
          color: '#68717d',
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        Storage
      </div>

      <div style={cardStyle}>
        <div style={rowStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#9fa8b5',
              fontSize: 11,
            }}
          >
            <HardDrive
              size={14}
              color="#b388ff"
            />

            Surveillance Storage
          </div>

          <div style={valueStyle}>
            {storage.drive
              ? `${storage.quantity} × ${storage.drive.model}`
              : 'Not found'}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 1fr',
            gap: 8,
            marginTop: 10,
            paddingTop: 10,
            borderTop:
              '1px solid #292f38',
          }}
        >
          <Metric
            label="Required"
            value={`${storage.requiredStorageTB.toFixed(
              2,
            )} TB`}
          />

          <Metric
            label="Installed"
            value={`${storage.installedCapacityTB.toFixed(
              2,
            )} TB`}
          />

          <Metric
            label="Spare"
            value={`${storage.spareCapacityTB.toFixed(
              2,
            )} TB`}
          />

          <Metric
            label="Drive Cost"
            value={
              storage.drive
                ? formatZAR(
                    storage.drive.sellPrice *
                      storage.quantity,
                  )
                : formatZAR(0)
            }
            highlight
          />
        </div>
      </div>

      <div
        style={{
          margin: '14px 0 8px',
          color: '#68717d',
          fontSize: 9,
          fontWeight: 900,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        Power Protection
      </div>

      <div style={cardStyle}>
        <div style={rowStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#9fa8b5',
              fontSize: 11,
            }}
          >
            <Zap
              size={14}
              color="#ffb74d"
            />

            UPS
          </div>

          <div style={valueStyle}>
            {ups
              ? ups.model
              : 'Not found'}
          </div>
        </div>

        {ups && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 8,
              marginTop: 10,
              paddingTop: 10,
              borderTop:
                '1px solid #292f38',
            }}
          >
            <Metric
              label="Capacity"
              value={`${ups.capacityVA} VA`}
            />

            <Metric
              label="Watts"
              value={`${ups.capacityWatts} W`}
            />

            <Metric
              label="Sell Price"
              value={formatZAR(
                ups.sellPrice,
              )}
              highlight
            />
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 12,
          background:
            'linear-gradient(135deg, #222714, #171b13)',
          border: '1px solid #5d6428',
          borderRadius: 8,
        }}
      >
        <div style={rowStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#d8df9a',
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            <WalletCards
              size={15}
              color="#ffd54f"
            />

            Infrastructure Total
          </div>

          <div
            style={{
              color: '#ffd54f',
              fontSize: 14,
              fontWeight: 900,
            }}
          >
            {formatZAR(
              recommendation.infrastructureCost,
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 8,
            color: '#7f8968',
            fontSize: 9,
            lineHeight: 1.4,
          }}
        >
          Excludes cameras, cable, accessories and
          labour.
        </div>
      </div>

      {recommendation.warnings.length > 0 && (
        <div
          style={{
            marginTop: 12,
          }}
        >
          <div
            style={{
              marginBottom: 8,
              color: '#ffbd66',
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Design Warnings
          </div>

          {recommendation.warnings.map(
            (warning) => (
              <div
                key={warning}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                  marginBottom: 7,
                  padding: 9,
                  background: '#33230f',
                  border: '1px solid #6f4918',
                  borderRadius: 7,
                  color: '#ffbd66',
                  fontSize: 9,
                  lineHeight: 1.45,
                }}
              >
                <AlertTriangle
                  size={13}
                  style={{
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                />

                {warning}
              </div>
            ),
          )}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          marginTop: 10,
          color: '#68717d',
          fontSize: 9,
        }}
      >
        <ShieldCheck
          size={13}
          color="#39ff14"
        />

        Smart sizing is based on the current
        SiteForge equipment catalog.
      </div>
    </div>
  )
}

interface MetricProps {
  label: string
  value: string
  highlight?: boolean
}

function Metric({
  label,
  value,
  highlight = false,
}: MetricProps): JSX.Element {
  return (
    <div>
      <div style={labelStyle}>
        {label}
      </div>

      <div
        style={{
          ...valueStyle,
          color: highlight
            ? '#ffd54f'
            : '#ffffff',
        }}
      >
        {value}
      </div>
    </div>
  )
}
