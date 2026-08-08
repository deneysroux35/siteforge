import type { JSX } from 'react'

import {
  Group,
  Line,
  Rect,
  Text,
} from 'react-konva'

import {
  useDesignerStore,
} from '../../../store/designerStore'

const PIXELS_PER_METRE = 25

export default function CableLayer(): JSX.Element {
  const cameras =
    useDesignerStore(
      (state) => state.cameras,
    )

  const equipmentHubs =
    useDesignerStore(
      (state) =>
        state.equipmentHubs,
    )

  return (
    <>
      {cameras.map(
        (camera) => {
          if (
            !camera.assignedHubId
          ) {
            return null
          }

          const hub =
            equipmentHubs.find(
              (item) =>
                item.id ===
                camera.assignedHubId,
            )

          if (!hub) {
            return null
          }

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

          const metres =
            pixelDistance /
            PIXELS_PER_METRE

          const midpointX =
            (
              camera.position.x +
              hub.position.x
            ) / 2

          const midpointY =
            (
              camera.position.y +
              hub.position.y
            ) / 2

          const cableColor =
            metres > 100
              ? '#ff5d5d'
              : metres >= 90
                ? '#ffd54f'
                : '#39ff14'

          const cableStatus =
            metres > 100
              ? 'OVER LIMIT'
              : metres >= 90
                ? 'WARNING'
                : 'CAT6'

          const cameraName =
            camera.name?.trim() ||
            'Camera'

          const hubName =
            hub.name?.trim() ||
            'Equipment Hub'

          const routeLabel =
            `${cameraName} → ${hubName}`

          const distanceLabel =
            `${metres.toFixed(1)} m · ${cableStatus}`

          const labelWidth =
            Math.max(
              120,
              Math.min(
                220,
                routeLabel.length * 6.5,
              ),
            )

          const labelX =
            midpointX -
            labelWidth / 2

          const labelY =
            midpointY - 20

          return (
            <Group
              key={camera.id}
              listening={false}
            >
              <Line
                points={[
                  camera.position.x,
                  camera.position.y,
                  hub.position.x,
                  hub.position.y,
                ]}
                stroke={cableColor}
                strokeWidth={2}
                dash={[10, 7]}
                lineCap="round"
                opacity={0.9}
                listening={false}
              />

              <Rect
                x={labelX}
                y={labelY}
                width={labelWidth}
                height={40}
                fill="#101318"
                stroke={cableColor}
                strokeWidth={1}
                cornerRadius={7}
                shadowColor="#000000"
                shadowBlur={8}
                shadowOpacity={0.35}
                listening={false}
              />

              <Text
                x={labelX + 6}
                y={labelY + 6}
                width={
                  labelWidth - 12
                }
                text={routeLabel}
                align="center"
                fill="#ffffff"
                fontSize={9}
                fontStyle="bold"
                listening={false}
              />

              <Text
                x={labelX + 6}
                y={labelY + 22}
                width={
                  labelWidth - 12
                }
                text={distanceLabel}
                align="center"
                fill={cableColor}
                fontSize={8}
                fontStyle="bold"
                listening={false}
              />

              <Rect
                x={
                  camera.position.x - 3
                }
                y={
                  camera.position.y - 3
                }
                width={6}
                height={6}
                fill={cableColor}
                cornerRadius={3}
                listening={false}
              />

              <Rect
                x={
                  hub.position.x - 3
                }
                y={
                  hub.position.y - 3
                }
                width={6}
                height={6}
                fill={cableColor}
                cornerRadius={3}
                listening={false}
              />
            </Group>
          )
        },
      )}
    </>
  )
}
