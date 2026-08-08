import type {
  JSX,
} from 'react'

import {
  Group,
  Line,
  Rect,
  Text,
} from 'react-konva'

import type {
  KonvaEventObject,
} from 'konva/lib/Node'

import {
  useDesignerStore,
} from '../../../store/designerStore'

import {
  analyseHubPoe,
} from '../../../services/poeEngine'

import {
  calculateProjectSummary,
} from '../../../services/projectEngine'

import {
  calculateSmartEquipment,
} from '../../../services/equipmentEngine'

const GRID_SIZE = 25
const PIXELS_PER_METRE = 25

function snapToGrid(
  value: number,
): number {
  return (
    Math.round(
      value / GRID_SIZE,
    ) * GRID_SIZE
  )
}

export default function EquipmentHubLayer(): JSX.Element {
  const equipmentHubs =
    useDesignerStore(
      (state) =>
        state.equipmentHubs,
    )

  const cameras =
    useDesignerStore(
      (state) =>
        state.cameras,
    )

  const selectEquipmentHub =
    useDesignerStore(
      (state) =>
        state.selectEquipmentHub,
    )

  const beginEquipmentHubEdit =
    useDesignerStore(
      (state) =>
        state.beginEquipmentHubEdit,
    )

  const updateEquipmentHubPosition =
    useDesignerStore(
      (state) =>
        state.updateEquipmentHubPosition,
    )

  const finishEquipmentHubEdit =
    useDesignerStore(
      (state) =>
        state.finishEquipmentHubEdit,
    )

  return (
    <>
      {equipmentHubs.map(
        (hub) => {
          const assignedCameras =
            cameras.filter(
              (camera) =>
                camera.assignedHubId ===
                hub.id,
            )

          const cameraCount =
            assignedCameras.length

          const cableRuns =
            assignedCameras.map(
              (camera) => {
                const deltaX =
                  hub.position.x -
                  camera.position.x

                const deltaY =
                  hub.position.y -
                  camera.position.y

                const pixelDistance =
                  Math.sqrt(
                    deltaX ** 2 +
                      deltaY ** 2,
                  )

                return (
                  pixelDistance /
                  PIXELS_PER_METRE
                )
              },
            )

          const totalCableMetres =
            cableRuns.reduce(
              (
                total,
                metres,
              ) =>
                total +
                metres,
              0,
            )

          const longestCableMetres =
            cableRuns.reduce(
              (
                longest,
                metres,
              ) =>
                Math.max(
                  longest,
                  metres,
                ),
              0,
            )

          const poeAnalysis =
            analyseHubPoe(
              hub.id,
              cameras,
            )

          const recommendedSwitch =
            poeAnalysis.recommendedSwitch

          const projectSummary =
            calculateProjectSummary({
              walls: [],
              cameras:
                assignedCameras,
            })

          const smartEquipment =
            calculateSmartEquipment(
              projectSummary,
            )

          const recommendedNvr =
            smartEquipment.nvr

          const nvrName =
            recommendedNvr
              ? recommendedNvr.model
              : cameraCount === 0
                ? 'NO LOAD'
                : 'NO NVR'

          const nvrChannelText =
            recommendedNvr
              ? `${cameraCount} / ${recommendedNvr.channels}`
              : `${cameraCount}`

          const nvrBandwidthText =
            recommendedNvr
              ? `${projectSummary.estimatedBandwidthMbps.toFixed(
                  1,
                )} / ${recommendedNvr.incomingBandwidthMbps} Mbps`
              : `${projectSummary.estimatedBandwidthMbps.toFixed(
                  1,
                )} Mbps`

          const nvrStorageText =
            recommendedNvr
              ? `${projectSummary.estimatedStorageTB.toFixed(
                  1,
                )} / ${recommendedNvr.maxStorageTB} TB`
              : `${projectSummary.estimatedStorageTB.toFixed(
                  1,
                )} TB`

          const hasCableFailure =
            longestCableMetres >
            100

          const hasCableWarning =
            longestCableMetres >=
            90

          const rackStatus =
            hasCableFailure
              ? 'CABLE OVER LIMIT'
              : hasCableWarning
                ? 'CABLE WARNING'
                : cameraCount > 0 &&
                    !recommendedNvr
                  ? 'NO SUITABLE NVR'
                  : poeAnalysis.status

          const statusColor =
            rackStatus ===
              'CABLE OVER LIMIT' ||
            rackStatus ===
              'NO SUITABLE SWITCH' ||
            rackStatus ===
              'NO SUITABLE NVR'
              ? '#ff5d5d'
              : rackStatus ===
                    'CABLE WARNING' ||
                  rackStatus ===
                    'WARNING'
                ? '#ffd54f'
                : '#39ff14'

          const cardVisible =
            cameraCount > 0 ||
            hub.selected

          const switchName =
            recommendedSwitch
              ? recommendedSwitch.model
              : cameraCount === 0
                ? 'NO LOAD'
                : 'NO SWITCH'

          const portText =
            recommendedSwitch
              ? `${poeAnalysis.requiredPoePorts} / ${recommendedSwitch.poePorts}`
              : `${poeAnalysis.requiredPoePorts}`

          const poeText =
            recommendedSwitch
              ? `${poeAnalysis.totalPoeWatts.toFixed(
                  1,
                )} / ${recommendedSwitch.poeBudgetWatts} W`
              : `${poeAnalysis.totalPoeWatts.toFixed(
                  1,
                )} W`

          const headroomText =
            recommendedSwitch
              ? `${poeAnalysis.poeHeadroomWatts.toFixed(
                  1,
                )} W`
              : '—'

          return (
            <Group
              key={hub.id}
              x={hub.position.x}
              y={hub.position.y}
              draggable

              onMouseDown={(
                event,
              ): void => {
                event.cancelBubble =
                  true

                selectEquipmentHub(
                  hub.id,
                )
              }}

              onDragStart={(
                event,
              ): void => {
                event.cancelBubble =
                  true

                selectEquipmentHub(
                  hub.id,
                )

                beginEquipmentHubEdit()
              }}

              onDragMove={(
                event:
                  KonvaEventObject<DragEvent>,
              ): void => {
                event.cancelBubble =
                  true

                const node =
                  event.target

                const x =
                  snapToGrid(
                    node.x(),
                  )

                const y =
                  snapToGrid(
                    node.y(),
                  )

                node.position({
                  x,
                  y,
                })

                updateEquipmentHubPosition(
                  hub.id,
                  {
                    x,
                    y,
                  },
                )
              }}

              onDragEnd={(
                event,
              ): void => {
                event.cancelBubble =
                  true

                finishEquipmentHubEdit()
              }}
            >
              {/* RACK BODY */}

              <Rect
                x={-31}
                y={-25}
                width={62}
                height={50}

                fill={
                  hub.selected
                    ? '#1a311c'
                    : '#151a20'
                }

                stroke={
                  hub.selected
                    ? statusColor
                    : '#59616d'
                }

                strokeWidth={
                  hub.selected
                    ? 3
                    : 2
                }

                cornerRadius={9}

                shadowColor={
                  statusColor
                }

                shadowBlur={
                  hub.selected
                    ? 20
                    : 8
                }

                shadowOpacity={
                  hub.selected
                    ? 0.55
                    : 0.16
                }
              />

              {/* INNER RACK */}

              <Rect
                x={-19}
                y={-13}
                width={38}
                height={26}

                fill="#0c1014"

                stroke={
                  statusColor
                }

                strokeWidth={1.5}

                cornerRadius={4}
              />

              {/* RACK SLOTS */}

              <Rect
                x={-14}
                y={-8}
                width={28}
                height={3}

                fill={
                  statusColor
                }

                cornerRadius={2}
              />

              <Rect
                x={-14}
                y={-2}
                width={28}
                height={3}

                fill={
                  statusColor
                }

                opacity={0.72}

                cornerRadius={2}
              />

              <Rect
                x={-14}
                y={4}
                width={28}
                height={3}

                fill={
                  statusColor
                }

                opacity={0.48}

                cornerRadius={2}
              />

              {/* CAMERA COUNT BADGE */}

              <Rect
                x={17}
                y={-31}
                width={28}
                height={16}

                fill="#101318"

                stroke={
                  statusColor
                }

                strokeWidth={1}

                cornerRadius={5}
              />

              <Text
                x={18}
                y={-27}
                width={26}

                text={`${cameraCount} CAM`}

                align="center"

                fontSize={7}

                fontStyle="bold"

                fill={
                  statusColor
                }

                listening={false}
              />

              {/* RACK NAME */}

              <Text
                x={-60}
                y={31}
                width={120}

                text={hub.name}

                align="center"

                fontSize={10}

                fontStyle="bold"

                fill={
                  hub.selected
                    ? statusColor
                    : '#d0d6de'
                }

                listening={false}
              />

              {/* RACK TYPE */}

              <Text
                x={-60}
                y={44}
                width={120}

                text={
                  hub.type.toUpperCase()
                }

                align="center"

                fontSize={7}

                fill="#68717d"

                listening={false}
              />

              {/* RACK INTELLIGENCE CARD */}

              {cardVisible && (
                <Group
                  x={48}
                  y={-78}

                  listening={false}
                >
                  {/* CONNECTOR */}

                  <Line
                    points={[
                      -17,
                      78,
                      0,
                      78,
                    ]}

                    stroke={
                      statusColor
                    }

                    strokeWidth={1.5}

                    dash={[
                      4,
                      4,
                    ]}

                    opacity={0.75}

                    listening={false}
                  />

                  {/* CARD */}

                  <Rect
                    x={0}
                    y={0}

                    width={164}
                    height={210}

                    fill="#101419"

                    stroke={
                      statusColor
                    }

                    strokeWidth={1}

                    cornerRadius={8}

                    shadowColor="#000000"

                    shadowBlur={12}

                    shadowOpacity={0.4}

                    listening={false}
                  />

                  {/* TITLE */}

                  <Text
                    x={10}
                    y={9}
                    width={144}

                    text="RACK INTELLIGENCE"

                    fill="#7f8995"

                    fontSize={7}

                    fontStyle="bold"

                    listening={false}
                  />

                  {/* CAMERA COUNT */}

                  <Text
                    x={10}
                    y={23}
                    width={144}

                    text={`${cameraCount} CAMERAS`}

                    fill="#ffffff"

                    fontSize={9}

                    fontStyle="bold"

                    listening={false}
                  />

                  {/* TOTAL CABLE */}

                  <Text
                    x={10}
                    y={38}
                    width={144}

                    text={`${totalCableMetres.toFixed(
                      1,
                    )} m TOTAL CABLE`}

                    fill="#4fc3f7"

                    fontSize={8}

                    fontStyle="bold"

                    listening={false}
                  />

                  {/* LONGEST RUN */}

                  <Text
                    x={10}
                    y={51}
                    width={144}

                    text={`MAX RUN ${longestCableMetres.toFixed(
                      1,
                    )} m`}

                    fill="#9ba5b1"

                    fontSize={7}

                    listening={false}
                  />

                  {/* SWITCH */}

                  <Text
                    x={10}
                    y={67}
                    width={144}

                    text={`SWITCH  ${switchName}`}

                    fill={
                      recommendedSwitch
                        ? '#ffffff'
                        : cameraCount === 0
                          ? '#7f8995'
                          : '#ff5d5d'
                    }

                    fontSize={8}

                    fontStyle="bold"

                    listening={false}
                  />

                  {/* PORTS */}

                  <Text
                    x={10}
                    y={82}
                    width={144}

                    text={`PORTS   ${portText}`}

                    fill="#c5ccd6"

                    fontSize={7}

                    listening={false}
                  />

                  {/* POE LOAD */}

                  <Text
                    x={10}
                    y={94}
                    width={144}

                    text={`PoE     ${poeText}`}

                    fill="#c5ccd6"

                    fontSize={7}

                    listening={false}
                  />

                  {/* POE HEADROOM */}

                  <Text
                    x={10}
                    y={106}
                    width={144}

                    text={`HEADROOM ${headroomText}`}

                    fill="#c5ccd6"

                    fontSize={7}

                    listening={false}
                  />

                  {/* UTILISATION */}

                  <Text
                    x={10}
                    y={118}
                    width={144}

                    text={
                      recommendedSwitch
                        ? `UTIL    PORT ${poeAnalysis.portUtilisationPercentage.toFixed(
                            0,
                          )}% · PoE ${poeAnalysis.poeUtilisationPercentage.toFixed(
                            0,
                          )}%`
                        : 'UTIL    —'
                    }

                    fill="#9ba5b1"

                    fontSize={7}

                    listening={false}
                  />

                  {/* NVR */}

                  <Text
                    x={10}
                    y={132}
                    width={144}

                    text={`NVR     ${nvrName}`}

                    fill={
                      recommendedNvr
                        ? '#ffffff'
                        : cameraCount === 0
                          ? '#7f8995'
                          : '#ff5d5d'
                    }

                    fontSize={8}

                    fontStyle="bold"

                    listening={false}
                  />

                  {/* NVR CHANNELS */}

                  <Text
                    x={10}
                    y={146}
                    width={144}

                    text={`CHANNELS ${nvrChannelText}`}

                    fill="#c5ccd6"

                    fontSize={7}

                    listening={false}
                  />

                  {/* NVR BANDWIDTH */}

                  <Text
                    x={10}
                    y={158}
                    width={144}

                    text={`BANDWIDTH ${nvrBandwidthText}`}

                    fill="#c5ccd6"

                    fontSize={7}

                    listening={false}
                  />

                  {/* STORAGE */}

                  <Text
                    x={10}
                    y={170}
                    width={144}

                    text={`STORAGE ${nvrStorageText}`}

                    fill="#c5ccd6"

                    fontSize={7}

                    listening={false}
                  />

                  {/* STATUS BAR */}

                  <Rect
                    x={9}
                    y={190}
                    width={146}
                    height={12}

                    fill={
                      `${statusColor}22`
                    }

                    stroke={
                      `${statusColor}88`
                    }

                    strokeWidth={1}

                    cornerRadius={5}

                    listening={false}
                  />

                  <Text
                    x={10}
                    y={193}
                    width={144}

                    text={
                      rackStatus
                    }

                    align="center"

                    fill={
                      statusColor
                    }

                    fontSize={7}

                    fontStyle="bold"

                    listening={false}
                  />
                </Group>
              )}
            </Group>
          )
        },
      )}
    </>
  )
}
