import { create } from 'zustand'

export type SiteForgeWorkspace =
  | 'dashboard'
  | 'projects'
  | 'customers'
  | 'designer'
  | 'commercial'
  | 'finance'
  | 'proposals'
  | 'reports'
  | 'settings'

export interface WorkspaceDefinition {
  id: SiteForgeWorkspace
  label: string
  description: string
}

interface WorkspaceState {
  activeWorkspace: SiteForgeWorkspace

  previousWorkspace:
    | SiteForgeWorkspace
    | null

  setWorkspace: (
    workspace: SiteForgeWorkspace,
  ) => void

  restoreWorkspace: () => void

  resetWorkspace: () => void
}

const STORAGE_KEY =
  'siteforge.activeWorkspace'

export const SITEFORGE_WORKSPACES:
  WorkspaceDefinition[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description:
        'Projects, activity and business overview',
    },

    {
      id: 'projects',
      label: 'Projects',
      description:
        'Manage SiteForge projects',
    },

    {
      id: 'customers',
      label: 'Customers',
      description:
        'Customer database and project history',
    },

    {
      id: 'designer',
      label: 'Designer',
      description:
        'CAD and security system design',
    },

    {
      id: 'commercial',
      label: 'Commercial',
      description:
        'BOM, costing, labour and margin',
    },

    {
      id: 'finance',
      label: 'Finance',
      description:
        'Rental and finance calculations',
    },

    {
      id: 'proposals',
      label: 'Proposals',
      description:
        'Client quotations and proposals',
    },

    {
      id: 'reports',
      label: 'Reports',
      description:
        'Engineering and commercial reports',
    },

    {
      id: 'settings',
      label: 'Settings',
      description:
        'Application and company settings',
    },
  ]

function isWorkspace(
  value: string,
): value is SiteForgeWorkspace {
  return SITEFORGE_WORKSPACES.some(
    (workspace) =>
      workspace.id === value,
  )
}

function readSavedWorkspace():
  SiteForgeWorkspace {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY,
      )

    if (
      saved &&
      isWorkspace(saved)
    ) {
      return saved
    }
  } catch (error) {
    console.warn(
      'Unable to restore SiteForge workspace.',
      error,
    )
  }

  return 'designer'
}

function saveWorkspace(
  workspace: SiteForgeWorkspace,
): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      workspace,
    )
  } catch (error) {
    console.warn(
      'Unable to save SiteForge workspace.',
      error,
    )
  }
}

export const useWorkspaceStore =
  create<WorkspaceState>((set) => ({
    activeWorkspace:
      readSavedWorkspace(),

    previousWorkspace:
      null,

    setWorkspace: (
      workspace,
    ): void =>
      set((state) => {
        if (
          workspace ===
          state.activeWorkspace
        ) {
          return state
        }

        saveWorkspace(
          workspace,
        )

        return {
          previousWorkspace:
            state.activeWorkspace,

          activeWorkspace:
            workspace,
        }
      }),

    restoreWorkspace:
      (): void =>
        set({
          activeWorkspace:
            readSavedWorkspace(),
        }),

    resetWorkspace:
      (): void => {
        saveWorkspace(
          'designer',
        )

        set({
          activeWorkspace:
            'designer',

          previousWorkspace:
            null,
        })
      },
  }))
  