import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type JSX,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { useDesignerStore } from '../../store/designerStore'

const WORLD_MIN_Y = -5000
const WORLD_MAX_Y = 5000
const MIN_THUMB_HEIGHT = 54
const PAN_STEP = 150

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}

export default function VerticalViewportScrollbar(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const draggingRef = useRef(false)
  const dragStartYRef = useRef(0)
  const dragStartThumbTopRef = useRef(0)

  const [trackHeight, setTrackHeight] = useState(1)

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
      setTrackHeight(Math.max(1, track.clientHeight))
    }

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(track)

    return (): void => {
      observer.disconnect()
    }
  }, [])

  const worldHeight = WORLD_MAX_Y - WORLD_MIN_Y

  const viewportHeight = containerRef.current?.clientHeight ?? 1
  const viewportWorldHeight = viewportHeight / zoom

  const maximumViewTop = Math.max(
    WORLD_MIN_Y,
    WORLD_MAX_Y - viewportWorldHeight,
  )

  const availableWorldTravel = maximumViewTop - WORLD_MIN_Y

  const visibleRatio = clamp(viewportWorldHeight / worldHeight, 0, 1)

  const thumbHeight = clamp(
    trackHeight * visibleRatio,
    MIN_THUMB_HEIGHT,
    trackHeight,
  )

  const availableThumbTravel = Math.max(0, trackHeight - thumbHeight)

  const currentViewTop = -offsetY / zoom

  const progress =
    availableWorldTravel > 0
      ? clamp(
          (currentViewTop - WORLD_MIN_Y) / availableWorldTravel,
          0,
          1,
        )
      : 0

  const thumbTop = progress * availableThumbTravel

  const updateViewportFromThumb = useCallback(
    (requestedTop: number): void => {
      const safeTop = clamp(requestedTop, 0, availableThumbTravel)

      const thumbProgress =
        availableThumbTravel > 0 ? safeTop / availableThumbTravel : 0

      const newViewTop =
        WORLD_MIN_Y + thumbProgress * availableWorldTravel

      setOffset(offsetX, -newViewTop * zoom)
    },
    [
      availableThumbTravel,
      availableWorldTravel,
      offsetX,
      setOffset,
      zoom,
    ],
  )

  useEffect((): (() => void) => {
    function handleMouseMove(event: globalThis.MouseEvent): void {
      if (!draggingRef.current) {
        return
      }

      const movement = event.clientY - dragStartYRef.current

      updateViewportFromThumb(
        dragStartThumbTopRef.current + movement,
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
    dragStartYRef.current = event.clientY
    dragStartThumbTopRef.current = thumbTop

    document.body.style.cursor = 'grabbing'
    document.body.style.userSelect = 'none'
  }

  function handleTrackClick(event: ReactMouseEvent<HTMLDivElement>): void {
    if (event.target !== event.currentTarget) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()

    updateViewportFromThumb(
      event.clientY - bounds.top - thumbHeight / 2,
    )
  }

  function moveUp(): void {
    setOffset(offsetX, offsetY + PAN_STEP)
  }

  function moveDown(): void {
    setOffset(offsetX, offsetY - PAN_STEP)
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: 30,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#111419',
        borderLeft: '1px solid #343b47',
        userSelect: 'none',
      }}
    >
      <button
        type="button"
        title="Pan up"
        onClick={moveUp}
        style={{
          width: '100%',
          height: 30,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          background: '#1a1f26',
          color: '#9ca6b3',
          border: 'none',
          borderBottom: '1px solid #303641',
          cursor: 'pointer',
        }}
      >
        <ChevronUp size={16} />
      </button>

      <div
        ref={trackRef}
        onMouseDown={handleTrackClick}
        style={{
          position: 'relative',
          flex: 1,
          width: 18,
          margin: '5px 0',
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
            top: thumbTop,
            left: 2,
            width: 12,
            height: thumbHeight,
            borderRadius: 4,
            background: 'linear-gradient(90deg, #46505d, #2d343e)',
            border: '1px solid #687483',
            cursor: 'grab',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 3,
              left: 2,
              right: 2,
              height: 3,
              borderRadius: 3,
              background: '#39ff14',
              boxShadow: '0 0 7px rgba(57,255,20,.65)',
            }}
          />
        </div>
      </div>

      <button
        type="button"
        title="Pan down"
        onClick={moveDown}
        style={{
          width: '100%',
          height: 30,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          background: '#1a1f26',
          color: '#9ca6b3',
          border: 'none',
          borderTop: '1px solid #303641',
          cursor: 'pointer',
        }}
      >
        <ChevronDown size={16} />
      </button>
    </div>
  )
}
