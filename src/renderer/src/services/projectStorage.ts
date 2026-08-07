import type {
  Camera,
  Wall,
} from '../components/designer/types'

import type {
  ProjectMetadata,
} from '../store/projectStore'

export const SITEFORGE_PROJECT_VERSION =
  '0.8.0'

export const SITEFORGE_STORAGE_KEY =
  'siteforge.currentProject'

export interface SiteForgeViewport {
  zoom: number
  offsetX: number
  offsetY: number
}

export interface SiteForgeProjectFile {
  format: 'siteforge-project'
  version: string

  project: ProjectMetadata

  drawing: {
    walls: Wall[]
    cameras: Camera[]
    viewport: SiteForgeViewport
  }
}

interface CreateProjectFileInput {
  project: ProjectMetadata

  walls: Wall[]
  cameras: Camera[]

  zoom: number
  offsetX: number
  offsetY: number
}

function cloneWalls(
  walls: Wall[],
): Wall[] {
  return walls.map((wall) => ({
    ...wall,

    start: {
      ...wall.start,
    },

    end: {
      ...wall.end,
    },

    selected: false,
  }))
}

function cloneCameras(
  cameras: Camera[],
): Camera[] {
  return cameras.map((camera) => ({
    ...camera,

    position: {
      ...camera.position,
    },

    selected: false,
  }))
}

function cloneProjectMetadata(
  project: ProjectMetadata,
): ProjectMetadata {
  return {
    ...project,
  }
}

export function createProjectFile({
  project,
  walls,
  cameras,
  zoom,
  offsetX,
  offsetY,
}: CreateProjectFileInput): SiteForgeProjectFile {
  const savedAt =
    new Date().toISOString()

  return {
    format: 'siteforge-project',

    version:
      SITEFORGE_PROJECT_VERSION,

    project: {
      ...cloneProjectMetadata(project),
      updatedAt: savedAt,
    },

    drawing: {
      walls:
        cloneWalls(walls),

      cameras:
        cloneCameras(cameras),

      viewport: {
        zoom,
        offsetX,
        offsetY,
      },
    },
  }
}

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null
  )
}

function isFiniteNumber(
  value: unknown,
): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value)
  )
}

function isProjectMetadata(
  value: unknown,
): value is ProjectMetadata {
  if (!isObject(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.customerName ===
      'string' &&
    typeof value.siteAddress ===
      'string' &&
    typeof value.designerName ===
      'string' &&
    typeof value.revision ===
      'string' &&
    typeof value.createdAt ===
      'string' &&
    typeof value.updatedAt ===
      'string'
  )
}

function isViewport(
  value: unknown,
): value is SiteForgeViewport {
  if (!isObject(value)) {
    return false
  }

  return (
    isFiniteNumber(value.zoom) &&
    isFiniteNumber(value.offsetX) &&
    isFiniteNumber(value.offsetY)
  )
}

export function validateProjectFile(
  value: unknown,
): value is SiteForgeProjectFile {
  if (!isObject(value)) {
    return false
  }

  if (
    value.format !==
    'siteforge-project'
  ) {
    return false
  }

  if (
    typeof value.version !==
    'string'
  ) {
    return false
  }

  if (
    !isProjectMetadata(
      value.project,
    )
  ) {
    return false
  }

  if (
    !isObject(value.drawing)
  ) {
    return false
  }

  if (
    !Array.isArray(
      value.drawing.walls,
    )
  ) {
    return false
  }

  if (
    !Array.isArray(
      value.drawing.cameras,
    )
  ) {
    return false
  }

  if (
    !isViewport(
      value.drawing.viewport,
    )
  ) {
    return false
  }

  return true
}

export function serializeProjectFile(
  projectFile: SiteForgeProjectFile,
): string {
  return JSON.stringify(
    projectFile,
    null,
    2,
  )
}

export function parseProjectFile(
  json: string,
): SiteForgeProjectFile {
  let parsed: unknown

  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error(
      'The selected file does not contain valid SiteForge project data.',
    )
  }

  if (
    !validateProjectFile(parsed)
  ) {
    throw new Error(
      'The selected file is not a valid SiteForge project.',
    )
  }

  return parsed
}

export function saveProjectLocally(
  projectFile: SiteForgeProjectFile,
): void {
  const serialized =
    serializeProjectFile(
      projectFile,
    )

  localStorage.setItem(
    SITEFORGE_STORAGE_KEY,
    serialized,
  )
}

export function loadProjectLocally():
  | SiteForgeProjectFile
  | null {
  const serialized =
    localStorage.getItem(
      SITEFORGE_STORAGE_KEY,
    )

  if (!serialized) {
    return null
  }

  try {
    return parseProjectFile(
      serialized,
    )
  } catch (error) {
    console.error(
      'Unable to load the saved SiteForge project.',
      error,
    )

    return null
  }
}

export function hasSavedProject(): boolean {
  return (
    localStorage.getItem(
      SITEFORGE_STORAGE_KEY,
    ) !== null
  )
}

export function removeSavedProject(): void {
  localStorage.removeItem(
    SITEFORGE_STORAGE_KEY,
  )
}

export function createSafeProjectFilename(
  projectName: string,
): string {
  const safeName =
    projectName
      .trim()
      .replace(
        /[<>:"/\\|?*\u0000-\u001f]/g,
        '',
      )
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()

  return `${
    safeName ||
    'siteforge-project'
  }.siteforge`
}

export function downloadProjectFile(
  projectFile: SiteForgeProjectFile,
): void {
  const serialized =
    serializeProjectFile(
      projectFile,
    )

  const blob =
    new Blob(
      [serialized],
      {
        type:
          'application/json;charset=utf-8',
      },
    )

  const objectUrl =
    URL.createObjectURL(blob)

  const link =
    document.createElement('a')

  link.href =
    objectUrl

  link.download =
    createSafeProjectFilename(
      projectFile.project.name,
    )

  document.body.appendChild(link)

  link.click()

  document.body.removeChild(link)

  URL.revokeObjectURL(
    objectUrl,
  )
}

export async function readProjectFile(
  file: File,
): Promise<SiteForgeProjectFile> {
  const text =
    await file.text()

  return parseProjectFile(
    text,
  )
}
