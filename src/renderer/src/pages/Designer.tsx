import { useEffect, useState, type JSX } from 'react'

import Properties from '../components/designer/Properties'
import Toolbar from '../components/designer/Toolbar'
import ViewportFrame from '../components/designer/ViewportFrame'

import CommandPalette from '../components/layout/CommandPalette'
import StatusBar from '../components/layout/StatusBar'
import TopBar from '../components/layout/TopBar'

export default function Designer(): JSX.Element {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useEffect((): (() => void) => {
    function handleKeyDown(event: KeyboardEvent): void {
      const target = event.target as HTMLElement | null

      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable

      const commandShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k'

      const alternateShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === 'p'

      if (commandShortcut || alternateShortcut) {
        event.preventDefault()
        setCommandPaletteOpen((current) => !current)
        return
      }

      if (event.key === 'Escape' && !isTyping) {
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return (): void => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

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
    </div>
  )
}
