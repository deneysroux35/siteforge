import {
  useEffect,
  useRef,
  useState,
  type JSX,
  type PointerEvent as ReactPointerEvent,
} from 'react'

import { useDesignerStore } from '../../store/designerStore'

interface PointerPosition {
  x: number
  y: number
}

export default function SpacePanOverlay(): JSX.Element {
  const [spaceHeld, setSpaceHeld] = useState(false)
  const [dragging, setDragging] = useState(false)

  const lastPointerRef = useRef<PointerPosition | null>(null)

  const offsetX = useDesignerStore((state) => state.offsetX)
  const offsetY = useDesignerStore((state) => state.offsetY)

  const setOffset = useDesignerStore((state) => state.setOffset)

  const offsetRef = useRef({
    x: offsetX,
    y: offsetY,
  })

  useEffect((): void => {
    offsetRef.current = {
      x: offsetX,
      y: offsetY,
    }
  }, [offsetX, offsetY])

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

      if (event.code !== 'Space') {
        return
      }

      event.preventDefault()

      if (!event.repeat) {
        setSpaceHeld(true)
      }
    }

    function handleKeyUp(event: KeyboardEvent): void {
      if (event.code !== 'Space') {
        return
      }

      event.preventDefault()

      setSpaceHeld(false)
      setDragging(false)
      lastPointerRef.current = null
    }

    function handleWindowBlur(): void {
      setSpaceHeld(false)
      setDragging(false)
      lastPointerRef.current = null
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

  function handlePointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
  ): void {
    if (!spaceHeld || event.button !== 0) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    event.currentTarget.setPointerCapture(event.pointerId)

    lastPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    }

    setDragging(true)
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ): void {
    if (
      !spaceHeld ||
      !dragging ||
      !lastPointerRef.current
    ) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const movementX =
      event.clientX - lastPointerRef.current.x

    const movementY =
      event.clientY - lastPointerRef.current.y

    const newOffsetX =
      offsetRef.current.x + movementX

    const newOffsetY =
      offsetRef.current.y + movementY

    setOffset(newOffsetX, newOffsetY)

    offsetRef.current = {
      x: newOffsetX,
      y: newOffsetY,
    }

    lastPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    }
  }

  function stopDragging(
    event: ReactPointerEvent<HTMLDivElement>,
  ): void {
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
    lastPointerRef.current = null
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,

        pointerEvents: spaceHeld
          ? 'auto'
          : 'none',

        cursor: spaceHeld
          ? dragging
            ? 'grabbing'
            : 'grab'
          : 'default',

        background: 'transparent',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {spaceHeld && (
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 14,

            padding: '6px 10px',

            background:
              'rgba(15, 18, 23, 0.92)',

            border:
              '1px solid #343b47',

            borderRadius: 7,

            color: '#39ff14',

            fontSize: 10,
            fontWeight: 800,

            letterSpacing: 0.5,

            boxShadow:
              '0 6px 18px rgba(0,0,0,.35)',

            pointerEvents: 'none',
          }}
        >
          {dragging
            ? 'PANNING'
            : 'HAND TOOL'}
        </div>
      )}
    </div>
  )
}
