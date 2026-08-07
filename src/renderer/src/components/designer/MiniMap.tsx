import {
  useRef,
  type JSX,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Maximize2 } from 'lucide-react'

import { useDesignerStore } from '../../store/designerStore'

const WORLD_MIN_X = -5000
const WORLD_MAX_X = 5000
const WORLD_MIN_Y = -5000
const WORLD_MAX_Y = 5000

const MAP_WIDTH = 210
const MAP_HEIGHT = 145

interface MiniMapProps {
  viewportWidth: number
  viewportHeight: number
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function worldToMapX(worldX: number): number {
  const worldWidth = WORLD_MAX_X - WORLD_MIN_X

  return ((worldX - WORLD_MIN_X) / worldWidth) * MAP_WIDTH
}

function worldToMapY(worldY: number): number {
  const worldHeight = WORLD_MAX_Y - WORLD_MIN_Y

  return ((worldY - WORLD_MIN_Y) / worldHeight) * MAP_HEIGHT
}

function mapToWorldX(mapX: number): number {
  const worldWidth = WORLD_MAX_X - WORLD_MIN_X

  return WORLD_MIN_X + (mapX / MAP_WIDTH) * worldWidth
}

function mapToWorldY(mapY: number): number {
  const worldHeight = WORLD_MAX_Y - WORLD_MIN_Y

  return WORLD_MIN_Y + (mapY / MAP_HEIGHT) * worldHeight
}

export default function MiniMap({
  viewportWidth,
  viewportHeight,
}: MiniMapProps): JSX.Element {
  const mapRef = useRef<SVGSVGElement>(null)
  const draggingRef = useRef(false)

  const walls = useDesignerStore((state) => state.walls)
  const cameras = useDesignerStore((state) => state.cameras)

  const zoom = useDesignerStore((state) => state.zoom)
  const offsetX = useDesignerStore((state) => state.offsetX)
  const offsetY = useDesignerStore((state) => state.offsetY)

  const setOffset = useDesignerStore((state) => state.setOffset)

  const viewportWorldWidth =
    viewportWidth > 0 ? viewportWidth / zoom : 0

  const viewportWorldHeight =
    viewportHeight > 0 ? viewportHeight / zoom : 0

  const viewportWorldLeft = -offsetX / zoom
  const viewportWorldTop = -offsetY / zoom

  const viewportMapX = worldToMapX(viewportWorldLeft)
  const viewportMapY = worldToMapY(viewportWorldTop)

  const viewportMapWidth =
    ((viewportWorldWidth /
      (WORLD_MAX_X - WORLD_MIN_X)) *
      MAP_WIDTH)

  const viewportMapHeight =
    ((viewportWorldHeight /
      (WORLD_MAX_Y - WORLD_MIN_Y)) *
      MAP_HEIGHT)

  function navigateToPointer(
    event: ReactPointerEvent<SVGSVGElement>,
  ): void {
    const bounds =
      event.currentTarget.getBoundingClientRect()

    const localX = clamp(
      ((event.clientX - bounds.left) / bounds.width) *
        MAP_WIDTH,
      0,
      MAP_WIDTH,
    )

    const localY = clamp(
      ((event.clientY - bounds.top) / bounds.height) *
        MAP_HEIGHT,
      0,
      MAP_HEIGHT,
    )

    const worldCenterX = mapToWorldX(localX)
    const worldCenterY = mapToWorldY(localY)

    const requestedLeft =
      worldCenterX - viewportWorldWidth / 2

    const requestedTop =
      worldCenterY - viewportWorldHeight / 2

    const maximumLeft =
      WORLD_MAX_X - viewportWorldWidth

    const maximumTop =
      WORLD_MAX_Y - viewportWorldHeight

    const safeLeft = clamp(
      requestedLeft,
      WORLD_MIN_X,
      Math.max(WORLD_MIN_X, maximumLeft),
    )

    const safeTop = clamp(
      requestedTop,
      WORLD_MIN_Y,
      Math.max(WORLD_MIN_Y, maximumTop),
    )

    setOffset(
      -safeLeft * zoom,
      -safeTop * zoom,
    )
  }

  function handlePointerDown(
    event: ReactPointerEvent<SVGSVGElement>,
  ): void {
    event.preventDefault()
    event.stopPropagation()

    draggingRef.current = true

    event.currentTarget.setPointerCapture(
      event.pointerId,
    )

    navigateToPointer(event)
  }

  function handlePointerMove(
    event: ReactPointerEvent<SVGSVGElement>,
  ): void {
    if (!draggingRef.current) {
      return
    }

    navigateToPointer(event)
  }

  function handlePointerUp(
    event: ReactPointerEvent<SVGSVGElement>,
  ): void {
    draggingRef.current = false

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      )
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        right: 14,
        bottom: 14,
        zIndex: 40,
        width: MAP_WIDTH,
        overflow: 'hidden',
        background: 'rgba(14, 17, 22, 0.96)',
        border: '1px solid #3a424f',
        borderRadius: 9,
        boxShadow: '0 12px 32px rgba(0,0,0,.45)',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 9px',
          background: '#1a1f26',
          borderBottom: '1px solid #303641',
        }}
      >
        <div
          style={{
            color: '#9ca6b3',
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Mini Map
        </div>

        <Maximize2
          size={13}
          color="#39ff14"
        />
      </div>

      <svg
        ref={mapRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          display: 'block',
          background: '#101319',
          cursor: draggingRef.current
            ? 'grabbing'
            : 'crosshair',
          touchAction: 'none',
        }}
      >
        <rect
          x={0}
          y={0}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          fill="#101319"
        />

        <line
          x1={worldToMapX(0)}
          y1={0}
          x2={worldToMapX(0)}
          y2={MAP_HEIGHT}
          stroke="#262c35"
          strokeWidth={1}
        />

        <line
          x1={0}
          y1={worldToMapY(0)}
          x2={MAP_WIDTH}
          y2={worldToMapY(0)}
          stroke="#262c35"
          strokeWidth={1}
        />

        {walls.map((wall) => (
          <line
            key={wall.id}
            x1={worldToMapX(wall.start.x)}
            y1={worldToMapY(wall.start.y)}
            x2={worldToMapX(wall.end.x)}
            y2={worldToMapY(wall.end.y)}
            stroke={
              wall.selected
                ? '#ffd54f'
                : '#8b96a4'
            }
            strokeWidth={
              wall.selected ? 2 : 1.2
            }
            strokeLinecap="round"
          />
        ))}

        {cameras.map((camera) => (
          <circle
            key={camera.id}
            cx={worldToMapX(
              camera.position.x,
            )}
            cy={worldToMapY(
              camera.position.y,
            )}
            r={camera.selected ? 3.5 : 2.4}
            fill={
              camera.selected
                ? '#ffd54f'
                : '#39ff14'
            }
            stroke="#101319"
            strokeWidth={1}
          />
        ))}

        <rect
          x={clamp(
            viewportMapX,
            0,
            MAP_WIDTH,
          )}
          y={clamp(
            viewportMapY,
            0,
            MAP_HEIGHT,
          )}
          width={clamp(
            viewportMapWidth,
            4,
            MAP_WIDTH,
          )}
          height={clamp(
            viewportMapHeight,
            4,
            MAP_HEIGHT,
          )}
          fill="rgba(57,255,20,.08)"
          stroke="#39ff14"
          strokeWidth={1.5}
          rx={2}
          pointerEvents="none"
        />
      </svg>

      <div
        style={{
          padding: '5px 8px',
          background: '#111419',
          borderTop: '1px solid #292f38',
          color: '#68717d',
          fontSize: 8,
          textAlign: 'center',
        }}
      >
        Click or drag to navigate
      </div>
    </div>
  )
}
