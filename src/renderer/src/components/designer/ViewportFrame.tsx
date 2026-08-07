import {
  useEffect,
  useRef,
  useState,
  type JSX,
  type WheelEvent as ReactWheelEvent,
} from 'react'

import { MoveDiagonal2 } from 'lucide-react'

import BoxSelectionOverlay from './BoxSelectionOverlay'
import Canvas from './Canvas'
import HorizontalViewportScrollbar from './HorizontalViewportScrollbar'
import MiniMap from './MiniMap'
import SpacePanOverlay from './SpacePanOverlay'
import VerticalViewportScrollbar from './VerticalViewportScrollbar'

import { useDesignerStore } from '../../store/designerStore'

const MIN_ZOOM = 0.25
const MAX_ZOOM = 5
const ZOOM_FACTOR = 1.1

interface ViewportSize {
  width: number
  height: number
}

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(maximum, Math.max(minimum, value))
}

export default function ViewportFrame(): JSX.Element {
  const canvasContainerRef =
    useRef<HTMLDivElement | null>(null)

  const [viewportSize, setViewportSize] =
    useState<ViewportSize>({
      width: 1,
      height: 1,
    })

  const zoom = useDesignerStore(
    (state) => state.zoom,
  )

  const offsetX = useDesignerStore(
    (state) => state.offsetX,
  )

  const offsetY = useDesignerStore(
    (state) => state.offsetY,
  )

  const setZoom = useDesignerStore(
    (state) => state.setZoom,
  )

  const setOffset = useDesignerStore(
    (state) => state.setOffset,
  )

  useEffect(() => {
    const container =
      canvasContainerRef.current

    if (!container) {
      return
    }

    const updateSize = (): void => {
      setViewportSize({
        width: Math.max(
          1,
          container.clientWidth,
        ),
        height: Math.max(
          1,
          container.clientHeight,
        ),
      })
    }

    updateSize()

    const observer =
      new ResizeObserver(updateSize)

    observer.observe(container)

    return (): void => {
      observer.disconnect()
    }
  }, [])

  function handleWheelCapture(
    event: ReactWheelEvent<HTMLDivElement>,
  ): void {
    event.preventDefault()
    event.stopPropagation()

    const container =
      canvasContainerRef.current

    if (!container) {
      return
    }

    const bounds =
      container.getBoundingClientRect()

    const pointerX =
      event.clientX - bounds.left

    const pointerY =
      event.clientY - bounds.top

    const safeZoom =
      Math.max(0.01, zoom)

    const worldX =
      (pointerX - offsetX) /
      safeZoom

    const worldY =
      (pointerY - offsetY) /
      safeZoom

    const requestedZoom =
      event.deltaY < 0
        ? zoom * ZOOM_FACTOR
        : zoom / ZOOM_FACTOR

    const newZoom =
      clamp(
        requestedZoom,
        MIN_ZOOM,
        MAX_ZOOM,
      )

    if (newZoom === zoom) {
      return
    }

    const newOffsetX =
      pointerX -
      worldX * newZoom

    const newOffsetY =
      pointerY -
      worldY * newZoom

    setZoom(newZoom)

    setOffset(
      newOffsetX,
      newOffsetY,
    )
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minWidth: 0,
        minHeight: 0,

        display: 'grid',

        gridTemplateColumns:
          'minmax(0, 1fr) 30px',

        gridTemplateRows:
          'minmax(0, 1fr) 30px',

        background: '#202225',

        overflow: 'hidden',
      }}
    >
      <div
        ref={canvasContainerRef}
        onWheelCapture={
          handleWheelCapture
        }
        style={{
          gridColumn: 1,
          gridRow: 1,

          minWidth: 0,
          minHeight: 0,

          position: 'relative',

          overflow: 'hidden',
        }}
      >
        <Canvas />

        <BoxSelectionOverlay />

        <SpacePanOverlay />

        <MiniMap
          viewportWidth={
            viewportSize.width
          }
          viewportHeight={
            viewportSize.height
          }
        />
      </div>

      <div
        style={{
          gridColumn: 2,
          gridRow: 1,
          minHeight: 0,
        }}
      >
        <VerticalViewportScrollbar />
      </div>

      <div
        style={{
          gridColumn: 1,
          gridRow: 2,
          minWidth: 0,
        }}
      >
        <HorizontalViewportScrollbar />
      </div>

      <div
        title="Viewport navigation"
        style={{
          gridColumn: 2,
          gridRow: 2,

          display: 'grid',

          placeItems: 'center',

          background: '#171b21',

          borderTop:
            '1px solid #343b47',

          borderLeft:
            '1px solid #343b47',

          color: '#39ff14',
        }}
      >
        <MoveDiagonal2 size={14} />
      </div>
    </div>
  )
}
