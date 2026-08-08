import type {
  JSX,
} from 'react'

import {
  Group,
  Rect,
  Text,
} from 'react-konva'

import type {
  KonvaEventObject,
} from 'konva/lib/Node'

import {
  useDesignerStore,
} from '../../../store/designerStore'

const GRID_SIZE = 25

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
        (hub) => (
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
            <Rect
              x={-28}
              y={-22}

              width={56}
              height={44}

              fill={
                hub.selected
                  ? '#1f3a1f'
                  : '#171b21'
              }

              stroke={
                hub.selected
                  ? '#39ff14'
                  : '#59616d'
              }

              strokeWidth={
                hub.selected
                  ? 3
                  : 2
              }

              cornerRadius={8}

              shadowColor="#39ff14"

              shadowBlur={
                hub.selected
                  ? 18
                  : 8
              }

              shadowOpacity={
                hub.selected
                  ? 0.55
                  : 0.18
              }
            />

            <Rect
              x={-18}
              y={-11}

              width={36}
              height={22}

              fill="#0d1014"

              stroke="#39ff14"

              strokeWidth={1.5}

              cornerRadius={4}
            />

            <Rect
              x={-13}
              y={-6}

              width={26}
              height={3}

              fill="#39ff14"

              cornerRadius={2}
            />

            <Rect
              x={-13}
              y={0}

              width={26}
              height={3}

              fill="#39ff14"

              opacity={0.75}

              cornerRadius={2}
            />

            <Rect
              x={-13}
              y={6}

              width={26}
              height={3}

              fill="#39ff14"

              opacity={0.5}

              cornerRadius={2}
            />

            <Text
              x={-45}
              y={28}

              width={90}

              text={hub.name}

              align="center"

              fontSize={10}

              fontStyle="bold"

              fill={
                hub.selected
                  ? '#39ff14'
                  : '#c5ccd6'
              }

              listening={false}
            />

            <Text
              x={-45}
              y={40}

              width={90}

              text={
                hub.type.toUpperCase()
              }

              align="center"

              fontSize={7}

              fill="#68717d"

              listening={false}
            />
          </Group>
        ),
      )}
    </>
  )
}
