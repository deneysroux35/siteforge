import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type JSX,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { useDesignerStore } from '../../store/designerStore'

const WORLD_MIN_X = -5000
const WORLD_MAX_X = 5000
const MIN_THUMB_WIDTH = 54
const PAN_STEP = 150

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}

export default function HorizontalViewportScrollbar(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const draggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const dragStartThumbLeftRef = useRef(0)

  const [trackWidth, setTrackWidth] = useState(1)

  const zoom = useDesignerStore((state) => state.zoom)
  const offsetX = useDesignerStore((state) => state.offsetX)
  const offsetY = useDesignerStore((state) => state.offsetY)
  const setOffset = useDesignerStore((state) => state.setOffset)

  useEffect((): (() => void) | void => {
    const track = trackRef.current

    if (!track) {
      return
    }

    function updateSize(): void {
      setTrackWidth(Math.max(1, track.clientWidth))
    }

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(track)

    return (): void => {
      observer.disconnect()
    }
  }, [])

  const worldWidth = WORLD_MAX_X - WORLD_MIN_X

  const viewportWidth = containerRef.current?.clientWidth ?? 1
  const viewportWorldWidth = viewportWidth / zoom

  const maximumViewLeft = Math.max(
    WORLD_MIN_X,
    WORLD_MAX_X - viewportWorldWidth,
  )

  const availableWorldTravel = maximumViewLeft - WORLD_MIN_X

  const visibleRatio = clamp(viewportWorldWidth / worldWidth, 0, 1)

  const thumbWidth = clamp(
    trackWidth * visibleRatio,
    MIN_THUMB_WIDTH,
    trackWidth,
  )

  const availableThumbTravel = Math.max(0, trackWidth - thumbWidth)

  const currentViewLeft = -offsetX / zoom

  const progress =
    availableWorldTravel > 0
      ? clamp(
          (currentViewLeft - WORLD_MIN_X) / availableWorldTravel,
          0,
          1,
        )
      : 0

  const thumbLeft = progress * availableThumbTravel

  const updateViewportFromThumb = useCallback(
    (requestedLeft: number): void => {
      const safeLeft = clamp(requestedLeft, 0, availableThumbTravel)

      const thumbProgress =
        availableThumbTravel > 0 ? safeLeft / availableThumbTravel : 0

      const newViewLeft =
        WORLD_MIN_X + thumbProgress * availableWorldTravel

      setOffset(-newViewLeft * zoom, offsetY)
    },
    [
      availableThumbTravel,
      availableWorldTravel,
      offsetY,
      setOffset,
      zoom,
    ],
  )

  useEffect((): (() => void) => {
    function handleMouseMove(event: globalThis.MouseEvent): void {
      if (!draggingRef.current) {
        return
      }

      const movement = event.clientX - dragStartXRef.current

      updateViewportFromThumb(
        dragStartThumbLeftRef.current + movement,
      )
    }

    function handleMouseUp(): void {
      draggingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return (): void => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [updateViewportFromThumb])

  function startDrag(event: ReactMouseEvent<HTMLDivElement>): void {
    event.preventDefault()
    event.stopPropagation()

    draggingRef.current = true
    dragStartXRef.current = event.clientX
    dragStartThumbLeftRef.current = thumbLeft

    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
  }

  function handleTrackClick(event: ReactMouseEvent<HTMLDivElement>): void {
    if (event.target !== event.currentTarget) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()

    updateViewportFromThumb(
      event.clientX - bounds.left - thumbWidth / 2,
    )
  }

  function moveLeft(): void {
    setOffset(offsetX + PAN_STEP, offsetY)
  }

  function moveRight(): void {
    setOffset(offsetX - PAN_STEP, offsetY)
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: 30,
        display: 'flex',
        alignItems: 'center',
        background: '#111419',
        borderTop: '1px solid #343b47',
        userSelect: 'none',
      }}
    >
      <button
        type="button"
        title="Pan left"
        onClick={moveLeft}
        style={{
          width: 30,
          height: '100%',
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          background: '#1a1f26',
          color: '#9ca6b3',
          border: 'none',
          borderRight: '1px solid #303641',
          cursor: 'pointer',
        }}
      >
        <ChevronLeft size={16} />
      </button>

      <div
        ref={trackRef}
        onMouseDown={handleTrackClick}
        style={{
          position: 'relative',
          flex: 1,
          height: 18,
          margin: '0 5px',
          background: '#0c0f13',
          border: '1px solid #292f38',
          borderRadius: 5,
          cursor: 'pointer',
        }}
      >
        <div
          onMouseDown={startDrag}
          style={{
            position: 'absolute',
            left: thumbLeft,
            top: 2,
            width: thumbWidth,
            height: 12,
            borderRadius: 4,
            background: 'linear-gradient(180deg, #46505d, #2d343e)',
            border: '1px solid #687483',
            cursor: 'grab',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 3,
              top: 2,
              bottom: 2,
              width: 3,
              borderRadius: 3,
              background: '#39ff14',
              boxShadow: '0 0 7px rgba(57,255,20,.65)',
            }}
          />
        </div>
      </div>

      <button
        type="button"
        title="Pan right"
        onClick={moveRight}
        style={{
          width: 30,
          height: '100%',
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          background: '#1a1f26',
          color: '#9ca6b3',
          border: 'none',
          borderLeft: '1px solid #303641',
          cursor: 'pointer',
        }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
