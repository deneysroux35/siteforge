import Sidebar from './components/layout/Sidebar'

import Commercial from './pages/Commercial'
import Dashboard from './pages/Dashboard'
import Designer from './pages/Designer'

import {
  useWorkspaceStore,
} from './store/workspaceStore'

function Placeholder({
  title,
}: {
  title: string
}) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#101317',
        color: '#888',
        fontSize: 32,
        fontWeight: 700,
      }}
    >
      {title}
    </div>
  )
}

export default function App() {
  const workspace =
    useWorkspaceStore(
      (state) => state.activeWorkspace,
    )

  function renderWorkspace() {
    switch (workspace) {
      case 'dashboard':
        return <Dashboard />

      case 'designer':
        return <Designer />

      case 'commercial':
        return <Commercial />

      case 'projects':
        return (
          <Placeholder title="Projects" />
        )

      case 'customers':
        return (
          <Placeholder title="Customers" />
        )

      case 'finance':
        return (
          <Placeholder title="Finance" />
        )

      case 'proposals':
        return (
          <Placeholder title="Proposals" />
        )

      case 'reports':
        return (
          <Placeholder title="Reports" />
        )

      case 'settings':
        return (
          <Placeholder title="Settings" />
        )

      default:
        return <Dashboard />
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#111',
        color: '#fff',
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {renderWorkspace()}
      </div>
    </div>
  )
}
