import {
  useState,
  type JSX,
} from 'react'

import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Crosshair,
  Network,
  ShieldCheck,
} from 'lucide-react'

import {
  useDesignerStore,
} from '../../store/designerStore'

import {
  analyseDesign,
  type DesignFinding,
} from '../../services/designAnalysisEngine'

function getScoreColor(
  score: number,
): string {
  if (score >= 90) {
    return '#39ff14'
  }

  if (score >= 70) {
    return '#ffd54f'
  }

  return '#ff6b6b'
}

function getFindingColor(
  finding: DesignFinding,
): string {
  if (
    finding.severity ===
    'critical'
  ) {
    return '#ff6b6b'
  }

  if (
    finding.severity ===
    'warning'
  ) {
    return '#ffd54f'
  }

  return '#4fc3f7'
}

function getFindingBackground(
  finding: DesignFinding,
  active: boolean,
  hovered: boolean,
): string {
  if (active) {
    return finding.severity ===
      'critical'
      ? '#3a1c1c'
      : '#393017'
  }

  if (hovered) {
    return finding.severity ===
      'critical'
      ? '#311919'
      : '#302817'
  }

  return finding.severity ===
    'critical'
    ? '#2a1717'
    : '#2a2415'
}

export default function DesignAnalysisPanel(): JSX.Element {
  const [
    selectedFindingId,
    setSelectedFindingId,
  ] =
    useState<string | null>(
      null,
    )

  const [
    hoveredFindingId,
    setHoveredFindingId,
  ] =
    useState<string | null>(
      null,
    )

  const cameras =
    useDesignerStore(
      (state) =>
        state.cameras,
    )

  const equipmentHubs =
    useDesignerStore(
      (state) =>
        state.equipmentHubs,
    )

  const selectCamera =
    useDesignerStore(
      (state) =>
        state.selectCamera,
    )

  const clearSelection =
    useDesignerStore(
      (state) =>
        state.clearSelection,
    )

  const analysis =
    analyseDesign(
      cameras,
      equipmentHubs,
    )

  const scoreColor =
    getScoreColor(
      analysis.score,
    )

  function goToFinding(
    finding: DesignFinding,
  ): void {
    setSelectedFindingId(
      finding.id,
    )

    if (!finding.objectId) {
      clearSelection()
      return
    }

    const cameraExists =
      cameras.some(
        (camera) =>
          camera.id ===
          finding.objectId,
      )

    if (cameraExists) {
      selectCamera(
        finding.objectId,
      )
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection:
          'column',
        gap: 12,
      }}
    >
      {/* DESIGN SCORE */}

      <div
        style={{
          padding: 12,

          background:
            'linear-gradient(145deg, #171b21, #101318)',

          border:
            `1px solid ${scoreColor}`,

          borderRadius: 8,
        }}
      >
        <div
          style={{
            display: 'flex',

            alignItems:
              'center',

            justifyContent:
              'space-between',

            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                color:
                  '#7f8996',

                fontSize: 8,

                fontWeight:
                  900,

                letterSpacing:
                  1,

                textTransform:
                  'uppercase',
              }}
            >
              Design Score
            </div>

            <div
              style={{
                marginTop: 4,

                color:
                  scoreColor,

                fontSize: 28,

                fontWeight:
                  900,
              }}
            >
              {analysis.score}

              <span
                style={{
                  fontSize:
                    12,

                  color:
                    '#68717d',
                }}
              >
                {' '}
                / 100
              </span>
            </div>
          </div>

          <ShieldCheck
            size={28}
            color={
              scoreColor
            }
          />
        </div>

        <div
          style={{
            height: 7,

            marginTop: 10,

            background:
              '#0b0e12',

            borderRadius:
              999,

            overflow:
              'hidden',
          }}
        >
          <div
            style={{
              width:
                `${analysis.score}%`,

              height:
                '100%',

              background:
                scoreColor,

              borderRadius:
                999,

              transition:
                'width 180ms ease',
            }}
          />
        </div>
      </div>

      {/* METRICS */}

      <div
        style={{
          display: 'grid',

          gridTemplateColumns:
            '1fr 1fr',

          gap: 8,
        }}
      >
        <Metric
          label="Cameras"
          value={`${analysis.assignedCameraCount}/${analysis.cameraCount}`}
          accent="#39ff14"
        />

        <Metric
          label="Hubs"
          value={String(
            analysis.hubCount,
          )}
          accent="#4fc3f7"
        />

        <Metric
          label="Cable"
          value={`${analysis.totalCableMetres} m`}
          accent="#b388ff"
        />

        <Metric
          label="Warnings"
          value={String(
            analysis.warningCount,
          )}
          accent={
            analysis.warningCount >
            0
              ? '#ffd54f'
              : '#39ff14'
          }
        />
      </div>

      {/* CRITICAL SUMMARY */}

      {analysis.criticalCount >
        0 && (
        <div
          style={{
            display: 'flex',

            alignItems:
              'center',

            gap: 8,

            padding: 10,

            background:
              '#321a1a',

            border:
              '1px solid #612b2b',

            borderRadius: 7,

            color:
              '#ff8a8a',

            fontSize: 9,

            fontWeight:
              800,
          }}
        >
          <CircleAlert
            size={14}
          />

          {
            analysis.criticalCount
          }{' '}
          critical issue
          {
            analysis.criticalCount ===
            1
              ? ''
              : 's'
          }{' '}
          detected
        </div>
      )}

      {/* PERFECT DESIGN */}

      {analysis.findings
        .length === 0 ? (
        <div
          style={{
            display: 'flex',

            alignItems:
              'center',

            gap: 8,

            padding: 10,

            background:
              '#173619',

            border:
              '1px solid #2f7a34',

            borderRadius: 7,

            color:
              '#9eea91',

            fontSize: 9,

            fontWeight:
              800,
          }}
        >
          <CheckCircle2
            size={14}
          />

          No design issues
          detected.
        </div>
      ) : (
        <>
          {/* FINDINGS HEADER */}

          <div
            style={{
              display: 'flex',

              justifyContent:
                'space-between',

              alignItems:
                'center',

              gap: 10,
            }}
          >
            <div
              style={{
                color:
                  '#ffffff',

                fontSize: 10,

                fontWeight:
                  900,
              }}
            >
              Design Findings
            </div>

            <div
              style={{
                color:
                  '#68717d',

                fontSize: 8,
              }}
            >
              Click an issue
              to select its
              camera
            </div>
          </div>

          {/* FINDINGS */}

          <div
            style={{
              display: 'flex',

              flexDirection:
                'column',

              gap: 8,
            }}
          >
            {analysis.findings.map(
              (
                finding,
              ) => {
                const active =
                  selectedFindingId ===
                  finding.id

                const hovered =
                  hoveredFindingId ===
                  finding.id

                const color =
                  getFindingColor(
                    finding,
                  )

                const hasCamera =
                  Boolean(
                    finding.objectId &&
                    cameras.some(
                      (
                        camera,
                      ) =>
                        camera.id ===
                        finding.objectId,
                    ),
                  )

                return (
                  <div
                    key={
                      finding.id
                    }

                    role={
                      hasCamera
                        ? 'button'
                        : undefined
                    }

                    tabIndex={
                      hasCamera
                        ? 0
                        : -1
                    }

                    onClick={(): void => {
                      if (
                        hasCamera
                      ) {
                        goToFinding(
                          finding,
                        )
                      }
                    }}

                    onKeyDown={(
                      event,
                    ): void => {
                      if (
                        !hasCamera
                      ) {
                        return
                      }

                      if (
                        event.key ===
                          'Enter' ||
                        event.key ===
                          ' '
                      ) {
                        event.preventDefault()

                        goToFinding(
                          finding,
                        )
                      }
                    }}

                    onMouseEnter={(): void => {
                      setHoveredFindingId(
                        finding.id,
                      )
                    }}

                    onMouseLeave={(): void => {
                      setHoveredFindingId(
                        null,
                      )
                    }}

                    style={{
                      padding:
                        10,

                      background:
                        getFindingBackground(
                          finding,
                          active,
                          hovered,
                        ),

                      border:
                        `1px solid ${
                          active
                            ? color
                            : finding.severity ===
                                'critical'
                              ? '#5a2a2a'
                              : '#5d4d22'
                        }`,

                      borderRadius:
                        7,

                      cursor:
                        hasCamera
                          ? 'pointer'
                          : 'default',

                      boxShadow:
                        active
                          ? `0 0 12px ${color}33`
                          : 'none',

                      transform:
                        hovered &&
                        hasCamera
                          ? 'translateX(2px)'
                          : 'translateX(0)',

                      transition:
                        'background 120ms ease, border-color 120ms ease, transform 120ms ease, box-shadow 120ms ease',
                    }}
                  >
                    <div
                      style={{
                        display:
                          'flex',

                        alignItems:
                          'center',

                        justifyContent:
                          'space-between',

                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          display:
                            'flex',

                          alignItems:
                            'center',

                          gap: 7,

                          minWidth:
                            0,

                          color,
                          fontSize:
                            9,

                          fontWeight:
                            900,
                        }}
                      >
                        <AlertTriangle
                          size={
                            13
                          }
                        />

                        <span
                          style={{
                            overflow:
                              'hidden',

                            textOverflow:
                              'ellipsis',

                            whiteSpace:
                              'nowrap',
                          }}
                        >
                          {
                            finding.title
                          }
                        </span>
                      </div>

                      {hasCamera && (
                        <Crosshair
                          size={
                            13
                          }
                          color={
                            active
                              ? color
                              : '#68717d'
                          }
                        />
                      )}
                    </div>

                    <div
                      style={{
                        marginTop:
                          6,

                        color:
                          '#b7bec8',

                        fontSize:
                          9,

                        lineHeight:
                          1.5,
                      }}
                    >
                      {
                        finding.message
                      }
                    </div>

                    {finding.recommendation && (
                      <div
                        style={{
                          marginTop:
                            7,

                          paddingTop:
                            7,

                          borderTop:
                            '1px solid rgba(255,255,255,0.06)',

                          color:
                            '#8e99a6',

                          fontSize:
                            8,

                          lineHeight:
                            1.5,
                        }}
                      >
                        <strong
                          style={{
                            color:
                              '#ffffff',
                          }}
                        >
                          Recommendation:
                        </strong>{' '}
                        {
                          finding.recommendation
                        }
                      </div>
                    )}

                    {hasCamera && (
                      <button
                        type="button"

                        onClick={(
                          event,
                        ): void => {
                          event.stopPropagation()

                          goToFinding(
                            finding,
                          )
                        }}

                        style={{
                          width:
                            '100%',

                          marginTop:
                            9,

                          padding:
                            '7px 9px',

                          display:
                            'flex',

                          alignItems:
                            'center',

                          justifyContent:
                            'center',

                          gap: 6,

                          background:
                            active
                              ? `${color}22`
                              : '#15191f',

                          color,

                          border:
                            `1px solid ${color}66`,

                          borderRadius:
                            6,

                          cursor:
                            'pointer',

                          fontSize:
                            8,

                          fontWeight:
                            900,

                          textTransform:
                            'uppercase',

                          letterSpacing:
                            0.5,
                        }}
                      >
                        <Crosshair
                          size={
                            12
                          }
                        />

                        Go to Camera
                      </button>
                    )}
                  </div>
                )
              },
            )}
          </div>
        </>
      )}

      {/* LIVE STATUS */}

      <div
        style={{
          display: 'flex',

          alignItems:
            'center',

          gap: 7,

          padding: 9,

          background:
            '#111419',

          border:
            '1px solid #292f38',

          borderRadius: 7,

          color:
            '#7f8996',

          fontSize: 8,

          lineHeight:
            1.5,
        }}
      >
        <Network
          size={13}
          color="#4fc3f7"
        />

        Analysis updates
        automatically as cameras,
        cable distances and
        equipment hubs change.
      </div>
    </div>
  )
}

interface MetricProps {
  label: string
  value: string
  accent: string
}

function Metric({
  label,
  value,
  accent,
}: MetricProps): JSX.Element {
  return (
    <div
      style={{
        padding: 9,

        background:
          '#111419',

        border:
          '1px solid #292f38',

        borderRadius: 7,
      }}
    >
      <div
        style={{
          color:
            '#68717d',

          fontSize: 7,

          fontWeight:
            900,

          textTransform:
            'uppercase',

          letterSpacing:
            0.6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: 4,

          color:
            accent,

          fontSize: 13,

          fontWeight:
            900,
        }}
      >
        {value}
      </div>
    </div>
  )
}
