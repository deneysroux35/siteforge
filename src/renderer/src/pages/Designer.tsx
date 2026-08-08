import {
  useEffect,
  useState,
  type JSX,
} from 'react'

import Properties from '../components/designer/Properties'
import Toolbar from '../components/designer/Toolbar'
import ViewportFrame from '../components/designer/ViewportFrame'

import CommandPalette from '../components/layout/CommandPalette'
import StatusBar from '../components/layout/StatusBar'
import TopBar from '../components/layout/TopBar'

import NewProjectDialog from '../components/project/NewProjectDialog'

import { useDesignerStore } from '../store/designerStore'
import { useProjectStore } from '../store/projectStore'

export default function Designer(): JSX.Element {
  const [
    commandPaletteOpen,
    setCommandPaletteOpen,
  ] = useState(false)

  const [
    newProjectOpen,
    setNewProjectOpen,
  ] = useState(false)

  const project =
    useProjectStore(
      (state) =>
        state.project,
    )

  const isDirty =
    useProjectStore(
      (state) =>
        state.isDirty,
    )

  const clearSelection =
    useDesignerStore(
      (state) =>
        state.clearSelection,
    )

  useEffect(
    (): (() => void) => {
      function handleKeyDown(
        event: KeyboardEvent,
      ): void {
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

        const commandShortcut =
          (event.ctrlKey ||
            event.metaKey) &&
          event.key.toLowerCase() ===
            'k'

        const alternateShortcut =
          (event.ctrlKey ||
            event.metaKey) &&
          event.shiftKey &&
          event.key.toLowerCase() ===
            'p'

        const newProjectShortcut =
          (event.ctrlKey ||
            event.metaKey) &&
          event.key.toLowerCase() ===
            'n'

        if (
          commandShortcut ||
          alternateShortcut
        ) {
          event.preventDefault()

          setCommandPaletteOpen(
            (current) =>
              !current,
          )

          return
        }

        if (
          newProjectShortcut &&
          !isTyping
        ) {
          event.preventDefault()

          setNewProjectOpen(true)

          return
        }

        if (
          event.key === 'Escape' &&
          !isTyping
        ) {
          setCommandPaletteOpen(false)
          setNewProjectOpen(false)
        }
      }

      window.addEventListener(
        'keydown',
        handleKeyDown,
      )

      return (): void => {
        window.removeEventListener(
          'keydown',
          handleKeyDown,
        )
      }
    },
    [],
  )

  useEffect((): void => {
    document.title = `${project.name}${
      isDirty ? ' *' : ''
    } - SentryCAD`
  }, [
    project.name,
    isDirty,
  ])

  function handleProjectCreated(): void {
    clearSelection()
  }

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#0f1115',
        color: '#ffffff',
      }}
    >
      <TopBar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Toolbar />

        <main
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <ViewportFrame />
        </main>

        <Properties />
      </div>

      <StatusBar />

      <CommandPalette
        open={commandPaletteOpen}
        onClose={(): void => {
          setCommandPaletteOpen(false)
        }}
      />

      <NewProjectDialog
        open={newProjectOpen}
        onClose={(): void => {
          setNewProjectOpen(false)
        }}
        onCreated={handleProjectCreated}
      />
    </div>
  )
}
