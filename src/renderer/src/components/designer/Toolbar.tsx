import {
  useEffect,
  type CSSProperties,
  type MouseEvent,
} from 'react'

import {
  Camera,
  DoorOpen,
  MousePointer2,
  Network,
  Square,
} from 'lucide-react'

import {
  useDesignerStore,
} from '../../store/designerStore'

import type {
  Tool,
} from './types'

interface ToolDefinition {
  id: Tool
  label: string
  shortcut: string
  icon: typeof MousePointer2
}

const tools: ToolDefinition[] = [
  {
    id: 'select',
    label: 'Select',
    shortcut: 'V',
    icon: MousePointer2,
  },
  {
    id: 'wall',
    label: 'Wall',
    shortcut: 'W',
    icon: Square,
  },
  {
    id: 'door',
    label: 'Door',
    shortcut: 'D',
    icon: DoorOpen,
  },
  {
    id: 'camera',
    label: 'Camera',
    shortcut: 'C',
    icon: Camera,
  },
  {
    id: 'equipmentHub',
    label: 'Hub',
    shortcut: 'H',
    icon: Network,
  },
]

const dockButtonStyle: CSSProperties = {
  width: 58,
  height: 60,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 5,
  borderRadius: 9,
  cursor: 'pointer',
  outline: 'none',

  transition:
    'background 140ms ease, border-color 140ms ease, color 140ms ease, box-shadow 140ms ease, transform 140ms ease',
}

export default function Toolbar() {
  const tool =
    useDesignerStore(
      (state) => state.tool,
    )

  const setTool =
    useDesignerStore(
      (state) => state.setTool,
    )

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const target =
        event.target as
          | HTMLElement
          | null

      const isTyping =
        target?.tagName ===
          'INPUT' ||
        target?.tagName ===
          'TEXTAREA' ||
        target?.isContentEditable

      if (
        isTyping ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return
      }

      const pressedKey =
        event.key.toLowerCase()

      if (
        pressedKey === 'v'
      ) {
        setTool('select')
        return
      }

      if (
        pressedKey === 'w'
      ) {
        setTool('wall')
        return
      }

      if (
        pressedKey === 'd'
      ) {
        setTool('door')
        return
      }

      if (
        pressedKey === 'c'
      ) {
        setTool('camera')
        return
      }

      if (
        pressedKey === 'h'
      ) {
        setTool(
          'equipmentHub',
        )
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [setTool])

  function handleMouseEnter(
    event:
      MouseEvent<HTMLButtonElement>,
    active: boolean,
  ): void {
    if (active) {
      return
    }

    event.currentTarget.style.background =
      '#20262e'

    event.currentTarget.style.borderColor =
      '#414b58'

    event.currentTarget.style.color =
      '#ffffff'

    event.currentTarget.style.transform =
      'translateY(-1px)'
  }

  function handleMouseLeave(
    event:
      MouseEvent<HTMLButtonElement>,
    active: boolean,
  ): void {
    if (active) {
      return
    }

    event.currentTarget.style.background =
      'transparent'

    event.currentTarget.style.borderColor =
      'transparent'

    event.currentTarget.style.color =
      '#aeb7c2'

    event.currentTarget.style.transform =
      'translateY(0)'
  }

  return (
    <aside
      style={{
        width: 76,
        flexShrink: 0,

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

        gap: 7,

        padding:
          '11px 8px 10px',

        background:
          'linear-gradient(180deg, #12161b 0%, #0f1216 100%)',

        borderRight:
          '1px solid #303744',

        boxShadow:
          '6px 0 22px rgba(0,0,0,0.12)',

        overflowY: 'auto',

        userSelect: 'none',
      }}
    >
      {/* BRAND ACCENT */}

      <div
        style={{
          width: 42,
          height: 3,

          marginBottom: 4,

          borderRadius: 999,

          background:
            'linear-gradient(90deg, transparent, #39ff14, transparent)',

          boxShadow:
            '0 0 14px rgba(57,255,20,0.55)',
        }}
      />

      {/* DESIGN TOOLS */}

      {tools.map((item) => {
        const Icon =
          item.icon

        const active =
          tool === item.id

        return (
          <button
            key={item.id}
            type="button"

            title={`${item.label} (${item.shortcut})`}

            aria-label={`${item.label} tool`}

            aria-pressed={
              active
            }

            onClick={() =>
              setTool(item.id)
            }

            onMouseEnter={(
              event,
            ) =>
              handleMouseEnter(
                event,
                active,
              )
            }

            onMouseLeave={(
              event,
            ) =>
              handleMouseLeave(
                event,
                active,
              )
            }

            style={{
              ...dockButtonStyle,

              background:
                active
                  ? 'linear-gradient(180deg, #39ff14 0%, #24dc0d 100%)'
                  : 'transparent',

              color:
                active
                  ? '#071007'
                  : '#aeb7c2',

              border:
                active
                  ? '1px solid #6dff55'
                  : '1px solid transparent',

              boxShadow:
                active
                  ? '0 0 20px rgba(57,255,20,0.34), inset 0 0 0 1px rgba(255,255,255,0.06)'
                  : 'none',
            }}
          >
            {active && (
              <div
                style={{
                  position:
                    'absolute',

                  left: -8,
                  top: '50%',

                  width: 3,
                  height: 28,

                  transform:
                    'translateY(-50%)',

                  borderRadius:
                    '0 3px 3px 0',

                  background:
                    '#39ff14',

                  boxShadow:
                    '0 0 12px rgba(57,255,20,.8)',
                }}
              />
            )}

            <div
              style={{
                position:
                  'absolute',

                top: 5,
                right: 6,

                minWidth: 14,
                height: 14,

                display: 'grid',
                placeItems: 'center',

                padding:
                  '0 3px',

                borderRadius: 4,

                background:
                  active
                    ? 'rgba(7,16,7,.16)'
                    : '#0c0f13',

                border:
                  active
                    ? '1px solid rgba(7,16,7,.2)'
                    : '1px solid #29303a',

                color:
                  active
                    ? '#071007'
                    : '#606b78',

                fontSize: 7,
                fontWeight: 900,
              }}
            >
              {item.shortcut}
            </div>

            <Icon
              size={22}
              strokeWidth={2}
            />

            <span
              style={{
                fontSize: 10,

                fontWeight:
                  active
                    ? 900
                    : 700,

                lineHeight: 1,

                letterSpacing:
                  0.1,
              }}
            >
              {item.label}
            </span>
          </button>
        )
      })}

      {/* DIVIDER */}

      <div
        style={{
          width: 44,
          height: 1,

          margin:
            '7px 0 4px',

          background:
            'linear-gradient(90deg, transparent, #343b47, transparent)',
        }}
      />

      {/* SHORTCUT GUIDE */}

      <div
        style={{
          width: 54,

          padding:
            '7px 4px',

          borderRadius: 7,

          background:
            '#11151a',

          border:
            '1px solid #29303a',

          color:
            '#66717e',

          fontSize: 8,

          lineHeight: 1.65,

          textAlign:
            'center',
        }}
      >
        <div>
          V SELECT
        </div>

        <div>
          W WALL
        </div>

        <div>
          D DOOR
        </div>

        <div>
          C CAMERA
        </div>

        <div>
          H HUB
        </div>
      </div>

      <div
        style={{
          flex: 1,
        }}
      />

      {/* CURRENT MODE */}

      <div
        style={{
          width: 54,

          padding:
            '7px 3px',

          borderRadius: 7,

          background:
            '#0d1115',

          border:
            '1px solid #29313b',

          textAlign:
            'center',
        }}
      >
        <div
          style={{
            marginBottom: 3,

            color:
              '#596471',

            fontSize: 6,

            fontWeight: 900,

            letterSpacing:
              0.8,

            textTransform:
              'uppercase',
          }}
        >
          Active
        </div>

        <div
          style={{
            overflow:
              'hidden',

            color:
              '#39ff14',

            fontSize: 8,

            fontWeight: 900,

            textOverflow:
              'ellipsis',

            textTransform:
              'uppercase',

            whiteSpace:
              'nowrap',
          }}
        >
          {tool ===
          'equipmentHub'
            ? 'HUB'
            : tool}
        </div>
      </div>
    </aside>
  )
}
