import { create } from 'zustand'

export interface ProjectMetadata {
  id: string
  name: string
  customerName: string
  siteAddress: string
  designerName: string
  revision: string
  createdAt: string
  updatedAt: string
}

interface ProjectState {
  project: ProjectMetadata

  isDirty: boolean
  lastSavedAt: string | null

  setProjectName: (name: string) => void
  setCustomerName: (customerName: string) => void
  setSiteAddress: (siteAddress: string) => void
  setDesignerName: (designerName: string) => void
  setRevision: (revision: string) => void

  updateProject: (
    changes: Partial<ProjectMetadata>,
  ) => void

  createNewProject: (
    details?: Partial<ProjectMetadata>,
  ) => void

  loadProjectMetadata: (
    project: ProjectMetadata,
  ) => void

  markDirty: () => void
  markSaved: () => void
}

function createProjectId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `project-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`
}

function createDefaultProject(
  details: Partial<ProjectMetadata> = {},
): ProjectMetadata {
  const now = new Date().toISOString()

  return {
    id: details.id ?? createProjectId(),

    name:
      details.name?.trim() ||
      'Untitled Site',

    customerName:
      details.customerName?.trim() ?? '',

    siteAddress:
      details.siteAddress?.trim() ?? '',

    designerName:
      details.designerName?.trim() ?? '',

    revision:
      details.revision?.trim() || 'Rev 1',

    createdAt:
      details.createdAt ?? now,

    updatedAt:
      details.updatedAt ?? now,
  }
}

export const useProjectStore =
  create<ProjectState>((set) => ({
    project: createDefaultProject(),

    isDirty: false,

    lastSavedAt: null,

    setProjectName: (name): void =>
      set((state) => ({
        project: {
          ...state.project,

          name:
            name.trim() ||
            'Untitled Site',

          updatedAt:
            new Date().toISOString(),
        },

        isDirty: true,
      })),

    setCustomerName: (
      customerName,
    ): void =>
      set((state) => ({
        project: {
          ...state.project,

          customerName:
            customerName.trim(),

          updatedAt:
            new Date().toISOString(),
        },

        isDirty: true,
      })),

    setSiteAddress: (
      siteAddress,
    ): void =>
      set((state) => ({
        project: {
          ...state.project,

          siteAddress:
            siteAddress.trim(),

          updatedAt:
            new Date().toISOString(),
        },

        isDirty: true,
      })),

    setDesignerName: (
      designerName,
    ): void =>
      set((state) => ({
        project: {
          ...state.project,

          designerName:
            designerName.trim(),

          updatedAt:
            new Date().toISOString(),
        },

        isDirty: true,
      })),

    setRevision: (
      revision,
    ): void =>
      set((state) => ({
        project: {
          ...state.project,

          revision:
            revision.trim() ||
            'Rev 1',

          updatedAt:
            new Date().toISOString(),
        },

        isDirty: true,
      })),

    updateProject: (
      changes,
    ): void =>
      set((state) => ({
        project: {
          ...state.project,
          ...changes,

          updatedAt:
            new Date().toISOString(),
        },

        isDirty: true,
      })),

    createNewProject: (
      details = {},
    ): void =>
      set({
        project:
          createDefaultProject(
            details,
          ),

        isDirty: false,

        lastSavedAt: null,
      }),

    loadProjectMetadata: (
      project,
    ): void =>
      set({
        project: {
          ...project,
        },

        isDirty: false,

        lastSavedAt:
          project.updatedAt,
      }),

    markDirty: (): void =>
      set({
        isDirty: true,
      }),

    markSaved: (): void =>
      set((state) => {
        const savedAt =
          new Date().toISOString()

        return {
          project: {
            ...state.project,

            updatedAt:
              savedAt,
          },

          isDirty: false,

          lastSavedAt:
            savedAt,
        }
      }),
  }))
  