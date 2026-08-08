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
                x={
                  midpointX - 40
                }
                y={
                  midpointY - 13
                }
                width={80}
                height={26}
                fill="#101318"
                stroke={cableColor}
                strokeWidth={1}
                cornerRadius={6}
                listening={false}
              />

              <Text
                x={
                  midpointX - 38
                }
                y={
                  midpointY - 9
                }
                width={76}
                text={`${metres.toFixed(
                  1,
                )} m`}
                align="center"
                fill="#ffffff"
                fontSize={10}
                fontStyle="bold"
                listening={false}
              />

              <Text
                x={
                  midpointX - 38
                }
                y={
                  midpointY + 3
                }
                width={76}
                text={cableStatus}
                align="center"
                fill={cableColor}
                fontSize={7}
                fontStyle="bold"
                listening={false}
              />
            </Group>
          )
        },
      )}
    </>
  )
}
