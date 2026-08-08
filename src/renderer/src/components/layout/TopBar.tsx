import {
  BarChart3,
  Camera,
  DoorOpen,
  FileText,
  FolderOpen,
  Redo2,
  Ruler,
  Save,
  Settings,
  Square,
  Undo2,
} from 'lucide-react'

import type {
  CSSProperties,
  JSX,
  MouseEvent,
  ReactNode,
} from 'react'

import {
  openProjectPicker,
  saveCurrentProject,
} from '../../services/projectCommands'

import { useDesignerStore } from '../../store/designerStore'
import { useProjectStore } from '../../store/projectStore'

interface RibbonButtonProps {
  label: string
  shortcut?: string
  icon: typeof Save
  active?: boolean
  disabled?: boolean
  onClick: () => void
}

const ribbonButtonBase: CSSProperties = {
  minWidth: 66,
  height: 54,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  padding: '5px 10px',
  borderRadius: 7,
  border: '1px solid transparent',
  fontFamily: 'Segoe UI, sans-serif',
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
  transition:
    'background 140ms ease, border-color 140ms ease, color 140ms ease, box-shadow 140ms ease, transform 140ms ease',
}

function RibbonButton({
  label,
  shortcut,
  icon: Icon,
  active = false,
  disabled = false,
  onClick,
}: RibbonButtonProps): JSX.Element {
  function handleMouseEnter(
    event: MouseEvent<HTMLButtonElement>,
  ): void {
    if (disabled || active) {
      return
    }

    event.currentTarget.style.background = '#272d37'
    event.currentTarget.style.borderColor = '#46505f'
    event.currentTarget.style.transform = 'translateY(-1px)'
  }

  function handleMouseLeave(
    event: MouseEvent<HTMLButtonElement>,
  ): void {
    if (disabled || active) {
      return
    }

    event.currentTarget.style.background = 'transparent'
    event.currentTarget.style.borderColor = 'transparent'
    event.currentTarget.style.transform = 'translateY(0)'
  }

  return (
    <button
      type="button"
      title={
        shortcut
          ? `${label} (${shortcut})`
          : label
      }
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...ribbonButtonBase,

        background: active
          ? 'linear-gradient(180deg, #39ff14, #23d80c)'
          : 'transparent',

        color: disabled
          ? '#555d68'
          : active
            ? '#071007'
            : '#b7bec8',

        borderColor: active
          ? '#6dff55'
          : 'transparent',

        boxShadow: active
          ? '0 0 18px rgba(57,255,20,.25)'
          : 'none',

        cursor: disabled
          ? 'not-allowed'
          : 'pointer',

        opacity: disabled
          ? 0.55
          : 1,
      }}
    >
      <Icon
        size={20}
        strokeWidth={2}
      />

      <span
        style={{
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </button>
  )
}

function RibbonDivider(): JSX.Element {
  return (
    <div
      style={{
        width: 1,
        height: 48,
        margin: '0 5px',
        background:
          'linear-gradient(180deg, transparent, #343b47, transparent)',
      }}
    />
  )
}

interface RibbonGroupProps {
  title: string
  children: ReactNode
}

function RibbonGroup({
  title,
  children,
}: RibbonGroupProps): JSX.Element {
  return (
    <section
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '5px 4px 3px',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {children}
      </div>

      <div
        style={{
          height: 14,
          color: '#68717d',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 0.7,
          textAlign: 'center',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
    </section>
  )
}

export default function TopBar(): JSX.Element {
  const tool =
    useDesignerStore(
      (state) => state.tool,
    )

  const setTool =
    useDesignerStore(
      (state) => state.setTool,
    )

  const undo =
    useDesignerStore(
      (state) => state.undo,
    )

  const redo =
    useDesignerStore(
      (state) => state.redo,
    )

  const pastCount =
    useDesignerStore(
      (state) => state.past.length,
    )

  const futureCount =
    useDesignerStore(
      (state) => state.future.length,
    )

  const walls =
    useDesignerStore(
      (state) => state.walls,
    )

  const cameras =
    useDesignerStore(
      (state) => state.cameras,
    )

  const project =
    useProjectStore(
      (state) => state.project,
    )

  const isDirty =
    useProjectStore(
      (state) => state.isDirty,
    )

  function handleSave(): void {
    try {
      saveCurrentProject(true)
    } catch (error) {
      console.error(
        'Unable to save SentryCAD project.',
        error,
      )

      window.alert(
        'SentryCAD could not save the project.',
      )
    }
  }

  function handleOpen(): void {
    try {
      openProjectPicker()
    } catch (error) {
      console.error(
        'Unable to open SentryCAD project.',
        error,
      )

      window.alert(
        'SentryCAD could not open the project.',
      )
    }
  }

  function handleNotReady(
    feature: string,
  ): void {
    window.alert(
      `${feature} will be connected next.`,
    )
  }

  return (
    <header
      style={{
        flexShrink: 0,
        background: '#171a21',
        borderBottom: '1px solid #343b47',
        color: '#ffffff',
        fontFamily: 'Segoe UI, sans-serif',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          height: 42,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 15px',
          background: '#111419',
          borderBottom: '1px solid #282e38',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 7,
              background:
                'linear-gradient(135deg, #39ff14, #11a500)',
              color: '#071007',
              fontSize: 14,
              fontWeight: 900,
              boxShadow:
                '0 0 18px rgba(57,255,20,.22)',
            }}
          >
            SC
          </div>

          <div>
            <div
              style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
            >
              SENTRYCAD
            </div>

            <div
              style={{
                marginTop: 1,
                color: '#68717d',
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              Security Engineering Platform
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 14,
              color: '#8c96a3',
              fontSize: 11,
            }}
          >
            <span>
              Walls{' '}
              <strong
                style={{
                  color: '#ffd54f',
                }}
              >
                {walls.length}
              </strong>
            </span>

            <span>
              Cameras{' '}
              <strong
                style={{
                  color: '#39ff14',
                }}
              >
                {cameras.length}
              </strong>
            </span>
          </div>

          <div
            style={{
              padding: '6px 10px',
              border: '1px solid #343b47',
              borderRadius: 6,
              background: '#1b1f26',
              color: '#b7bec8',
              fontSize: 11,
            }}
          >
            Project:{' '}

            <strong
              style={{
                color: '#ffffff',
              }}
            >
              {project.name}
              {isDirty ? ' *' : ''}
            </strong>
          </div>
        </div>
      </div>

      <div
        style={{
          height: 82,
          display: 'flex',
          alignItems: 'stretch',
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '0 8px',
          background:
            'linear-gradient(180deg, #1b1f26, #171a21)',
        }}
      >
        <RibbonGroup title="Project">
          <RibbonButton
            label="Save"
            shortcut="Ctrl+S"
            icon={Save}
            onClick={handleSave}
          />

          <RibbonButton
            label="Open"
            shortcut="Ctrl+O"
            icon={FolderOpen}
            onClick={handleOpen}
          />
        </RibbonGroup>

        <RibbonDivider />

        <RibbonGroup title="History">
          <RibbonButton
            label="Undo"
            shortcut="Ctrl+Z"
            icon={Undo2}
            disabled={pastCount === 0}
            onClick={undo}
          />

          <RibbonButton
            label="Redo"
            shortcut="Ctrl+Y"
            icon={Redo2}
            disabled={futureCount === 0}
            onClick={redo}
          />
        </RibbonGroup>

        <RibbonDivider />

        <RibbonGroup title="Drawing">
          <RibbonButton
            label="Wall"
            shortcut="W"
            icon={Square}
            active={tool === 'wall'}
            onClick={(): void => {
              setTool('wall')
            }}
          />

          <RibbonButton
            label="Door"
            shortcut="D"
            icon={DoorOpen}
            active={tool === 'door'}
            onClick={(): void => {
              setTool('door')
            }}
          />

          <RibbonButton
            label="Measure"
            shortcut="M"
            icon={Ruler}
            onClick={(): void => {
              handleNotReady(
                'Measurement tools',
              )
            }}
          />
        </RibbonGroup>

        <RibbonDivider />

        <RibbonGroup title="CCTV">
          <RibbonButton
            label="Camera"
            shortcut="C"
            icon={Camera}
            active={tool === 'camera'}
            onClick={(): void => {
              setTool('camera')
            }}
          />
        </RibbonGroup>

        <RibbonDivider />

        <RibbonGroup title="Commercial">
          <RibbonButton
            label="Quote"
            icon={FileText}
            onClick={(): void => {
              handleNotReady(
                'Quote generation',
              )
            }}
          />

          <RibbonButton
            label="Reports"
            icon={BarChart3}
            onClick={(): void => {
              handleNotReady(
                'Reporting',
              )
            }}
          />
        </RibbonGroup>

        <RibbonDivider />

        <RibbonGroup title="System">
          <RibbonButton
            label="Settings"
            icon={Settings}
            onClick={(): void => {
              handleNotReady(
                'Application settings',
              )
            }}
          />
        </RibbonGroup>
      </div>
    </header>
  )
}
