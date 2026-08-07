import {
  useEffect,
  useRef,
  useState,
  type JSX,
  type PointerEvent as ReactPointerEvent,
} from 'react'

import { useDesignerStore } from '../../store/designerStore'

interface ScreenPoint {
  x: number
  y: number
}

export default function BoxSelectionOverlay(): JSX.Element {
  const [shiftHeld, setShiftHeld] = useState(false)
  const [dragging, setDragging] = useState(false)

  const [startPoint, setStartPoint] =
    useState<ScreenPoint | null>(null)

  const [currentPoint, setCurrentPoint] =
    useState<ScreenPoint | null>(null)

  const additiveSelectionRef = useRef(false)

  const tool = useDesignerStore((state) => state.tool)
  const zoom = useDesignerStore((state) => state.zoom)
  const offsetX = useDesignerStore((state) => state.offsetX)
  const offsetY = useDesignerStore((state) => state.offsetY)

  const selectObjectsInRect = useDesignerStore(
    (state) => state.selectObjectsInRect,
  )

  useEffect((): (() => void) => {
    function isTypingTarget(target: EventTarget | null): boolean {
      const element = target as HTMLElement | null

      return (
        element?.tagName === 'INPUT' ||
        element?.tagName === 'TEXTAREA' ||
        element?.tagName === 'SELECT' ||
        element?.isContentEditable === true
      )
    }

    function handleKeyDown(event: KeyboardEvent): void {
      if (isTypingTarget(event.target)) {
        return
      }

      if (event.key === 'Shift') {
        setShiftHeld(true)
      }
    }

    function handleKeyUp(event: KeyboardEvent): void {
      if (event.key !== 'Shift') {
        return
      }

      setShiftHeld(false)
      setDragging(false)
      setStartPoint(null)
      setCurrentPoint(null)
    }

    function handleWindowBlur(): void {
      setShiftHeld(false)
      setDragging(false)
      setStartPoint(null)
      setCurrentPoint(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', handleWindowBlur)

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [])

  function getLocalPointer(
    event: ReactPointerEvent<HTMLDivElement>,
  ): ScreenPoint {
    const bounds = event.currentTarget.getBoundingClientRect()

    return {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    }
  }

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
  ): void {
    if (
      tool !== 'select' ||
      !shiftHeld ||
      event.button !== 0
    ) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const point = getLocalPointer(event)

    additiveSelectionRef.current =
      event.ctrlKey || event.metaKey

    setStartPoint(point)
    setCurrentPoint(point)
    setDragging(true)

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ): void {
    if (!dragging || !startPoint) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    setCurrentPoint(getLocalPointer(event))
  }

  function finishSelection(
    event: ReactPointerEvent<HTMLDivElement>,
  ): void {
    if (
      !dragging ||
      !startPoint ||
      !currentPoint
    ) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const left = Math.min(startPoint.x, currentPoint.x)
    const right = Math.max(startPoint.x, currentPoint.x)

    const top = Math.min(startPoint.y, currentPoint.y)
    const bottom = Math.max(startPoint.y, currentPoint.y)

    const width = right - left
    const height = bottom - top

    if (width >= 4 && height >= 4) {
      selectObjectsInRect(
        {
          minX: (left - offsetX) / zoom,
          minY: (top - offsetY) / zoom,
          maxX: (right - offsetX) / zoom,
          maxY: (bottom - offsetY) / zoom,
        },
        additiveSelectionRef.current,
      )
    }

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      )
    }

    setDragging(false)
    setStartPoint(null)
    setCurrentPoint(null)
  }

  const active =
    shiftHeld && tool === 'select'

  const rectangle =
    startPoint && currentPoint
      ? {
          left: Math.min(
            startPoint.x,
            currentPoint.x,
          ),
          top: Math.min(
            startPoint.y,
            currentPoint.y,
          ),
          width: Math.abs(
            currentPoint.x - startPoint.x,
          ),
          height: Math.abs(
            currentPoint.y - startPoint.y,
          ),
        }
      : null

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishSelection}
      onPointerCancel={finishSelection}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 25,
        pointerEvents: active ? 'auto' : 'none',
        cursor: active ? 'crosshair' : 'default',
        background: 'transparent',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {active && !dragging && (
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 14,
            padding: '6px 9px',
            background: 'rgba(15,18,23,.92)',
            border: '1px solid #343b47',
            borderRadius: 6,
            color: '#39ff14',
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: 0.6,
            pointerEvents: 'none',
          }}
        >
          BOX SELECT
        </div>
      )}

      {dragging && rectangle && (
        <div
          style={{
            position: 'absolute',
            left: rectangle.left,
            top: rectangle.top,
            width: rectangle.width,
            height: rectangle.height,
            background: 'rgba(57,255,20,.08)',
            border: '1px solid #39ff14',
            boxShadow:
              '0 0 12px rgba(57,255,20,.16)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}
