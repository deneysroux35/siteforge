import type {
  JSX,
} from 'react'

import {
  CheckCircle2,
  Cpu,
  Eye,
  Moon,
  Ruler,
  Sparkles,
} from 'lucide-react'

import type {
  Camera,
} from './types'

import {
  recommendCamera,
} from '../../services/cameraRecommendationEngine'

import {
  useDesignerStore,
} from '../../store/designerStore'

interface CameraRecommendationPanelProps {
  camera: Camera
}

interface InfoRowProps {
  label: string
  value: string
  accent?: string
}

function InfoRow({
  label,
  value,
  accent,
}: InfoRowProps): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent:
          'space-between',
        gap: 12,
        padding: '7px 0',
        borderBottom:
          '1px solid #272d36',
      }}
    >
      <span
        style={{
          color: '#858f9c',
          fontSize: 10,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color:
            accent ??
            '#ffffff',
          fontSize: 10,
          textAlign: 'right',
        }}
      >
        {value}
      </strong>
    </div>
  )
}

export default function CameraRecommendationPanel({
  camera,
}: CameraRecommendationPanelProps): JSX.Element {
  const beginCameraEdit =
    useDesignerStore(
      (state) =>
        state.beginCameraEdit,
    )

  const finishCameraEdit =
    useDesignerStore(
      (state) =>
        state.finishCameraEdit,
    )

  const recommendation =
    recommendCamera({
      requiredDistance:
        camera.range,

      indoor: false,

      nightVision: true,
    })

  if (
    !recommendation.product
  ) {
    return (
      <div
        style={{
          padding: 12,
          background: '#2b1818',
          border:
            '1px solid #603030',
          borderRadius: 8,
          color: '#ff8a8a',
          fontSize: 10,
          lineHeight: 1.5,
        }}
      >
        No camera in the current
        product catalogue meets the
        required design distance of{' '}

        <strong>
          {camera.range} m
        </strong>

        .
      </div>
    )
  }

  const product =
    recommendation.product

  const recommendationApplied =
    camera.manufacturer ===
      product.manufacturer &&
    camera.model ===
      product.model

  function applyRecommendation(): void {
    beginCameraEdit()

    useDesignerStore.setState(
      (state) => ({
        cameras:
          state.cameras.map(
            (existingCamera) => {
              if (
                existingCamera.id !==
                camera.id
              ) {
                return existingCamera
              }

              return {
                ...existingCamera,

                /*
                 * Store the chosen
                 * catalogue product
                 * directly on the
                 * camera.
                 */
                manufacturer:
                  product.manufacturer,

                model:
                  product.model,

                /*
                 * Use the catalogue
                 * FoV so the drawing
                 * reflects the actual
                 * recommended camera.
                 */
                fieldOfView:
                  product.horizontalFOV,

                /*
                 * Keep camera.range
                 * unchanged.
                 *
                 * Range is the user's
                 * DESIGN REQUIREMENT,
                 * while maxDistance
                 * belongs to the
                 * catalogue product.
                 */
              }
            },
          ),
      }),
    )

    finishCameraEdit()
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection:
          'column',
        gap: 10,
      }}
    >
      {/* RECOMMENDATION */}

      <div
        style={{
          padding: 11,
          background:
            'linear-gradient(145deg, #173619, #101c11)',
          border:
            '1px solid #2f7a34',
          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems:
              'center',
            gap: 7,
            color: '#39ff14',
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: 0.7,
            textTransform:
              'uppercase',
          }}
        >
          <Sparkles
            size={14}
          />

          Recommended Camera
        </div>

        <div
          style={{
            marginTop: 8,
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 900,
          }}
        >
          {product.manufacturer}
        </div>

        <div
          style={{
            marginTop: 2,
            color: '#c9d0d8',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {product.model}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 9,
            color: '#9eea91',
            fontSize: 9,
          }}
        >
          <CheckCircle2
            size={12}
          />

          {recommendation.confidence}%
          recommendation confidence
        </div>
      </div>

      {/* TECHNICAL MATCH */}

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
            alignItems:
              'center',
            gap: 7,
            marginBottom: 6,
            color: '#4fc3f7',
            fontSize: 10,
            fontWeight: 800,
          }}
        >
          <Cpu
            size={13}
          />

          Technical Match
        </div>

        <InfoRow
          label="Required Distance"
          value={`${camera.range} m`}
          accent="#ffd54f"
        />

        <InfoRow
          label="Resolution"
          value={`${product.resolutionMP} MP`}
        />

        <InfoRow
          label="Default Lens"
          value={`${product.defaultLens} mm`}
        />

        <InfoRow
          label="Horizontal FoV"
          value={`${product.horizontalFOV}°`}
        />

        <InfoRow
          label="IR Range"
          value={`${product.irRange} m`}
        />

        <InfoRow
          label="Maximum Distance"
          value={`${product.maxDistance} m`}
          accent="#39ff14"
        />

        <InfoRow
          label="Camera Power"
          value={`${product.power} W`}
        />

        <InfoRow
          label="Catalogue Price"
          value={`R ${product.price.toLocaleString(
            'en-ZA',
          )}`}
          accent="#ffd54f"
        />
      </div>

      {/* DESIGN TILES */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(3, 1fr)',
          gap: 6,
        }}
      >
        <StatusTile
          icon={
            <Ruler
              size={13}
            />
          }
          label="Distance"
          value={`${camera.range}m`}
        />

        <StatusTile
          icon={
            <Eye
              size={13}
            />
          }
          label="FoV"
          value={`${product.horizontalFOV}°`}
        />

        <StatusTile
          icon={
            <Moon
              size={13}
            />
          }
          label="Night"
          value={`${product.irRange}m`}
        />
      </div>

      {/* REASON */}

      <div
        style={{
          padding: 10,
          background: '#171b21',
          border:
            '1px solid #303641',
          borderRadius: 7,
          color: '#9ba5b1',
          fontSize: 9,
          lineHeight: 1.55,
        }}
      >
        <strong
          style={{
            display: 'block',
            marginBottom: 4,
            color: '#ffffff',
          }}
        >
          Why SentryCAD selected this camera
        </strong>

        {recommendation.reason}
      </div>

      {/* ACCEPT RECOMMENDATION */}

      {recommendationApplied ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'center',
            gap: 7,
            padding:
              '10px 12px',
            background:
              '#173619',
            color:
              '#39ff14',
            border:
              '1px solid #2f7a34',
            borderRadius: 7,
            fontSize: 9,
            fontWeight: 900,
            textTransform:
              'uppercase',
            letterSpacing: 0.5,
          }}
        >
          <CheckCircle2
            size={14}
          />

          Recommendation Applied
        </div>
      ) : (
        <button
          type="button"
          onClick={
            applyRecommendation
          }
          style={{
            width: '100%',
            padding:
              '11px 12px',

            display: 'flex',
            alignItems:
              'center',
            justifyContent:
              'center',
            gap: 7,

            background:
              'linear-gradient(180deg, #39ff14, #23d90c)',

            color:
              '#071007',

            border:
              '1px solid #6dff55',

            borderRadius: 7,

            cursor:
              'pointer',

            fontSize: 9,

            fontWeight: 900,

            textTransform:
              'uppercase',

            letterSpacing: 0.5,

            boxShadow:
              '0 0 16px rgba(57,255,20,0.20)',
          }}
        >
          <CheckCircle2
            size={14}
          />

          Accept Recommendation
        </button>
      )}

      {/* CURRENT PRODUCT STATUS */}

      <div
        style={{
          padding: 9,
          background:
            '#101318',
          border:
            '1px solid #292f38',
          borderRadius: 7,
          fontSize: 8,
          lineHeight: 1.5,
          color: '#7f8996',
        }}
      >
        <strong
          style={{
            color: '#ffffff',
          }}
        >
          Current camera:
        </strong>{' '}

        {camera.manufacturer ??
          'Unassigned'}{' '}

        {camera.model ??
          ''}
      </div>
    </div>
  )
}

interface StatusTileProps {
  icon: JSX.Element
  label: string
  value: string
}

function StatusTile({
  icon,
  label,
  value,
}: StatusTileProps): JSX.Element {
  return (
    <div
      style={{
        padding: 8,
        background:
          '#111419',
        border:
          '1px solid #292f38',
        borderRadius: 7,
        textAlign:
          'center',
      }}
    >
      <div
        style={{
          display: 'grid',
          placeItems:
            'center',
          color:
            '#39ff14',
        }}
      >
        {icon}
      </div>

      <div
        style={{
          marginTop: 5,
          color:
            '#68717d',
          fontSize: 7,
          fontWeight: 800,
          textTransform:
            'uppercase',
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 2,
          color:
            '#ffffff',
          fontSize: 10,
          fontWeight: 900,
        }}
      >
        {value}
      </div>
    </div>
  )
}
