import { useDesignerStore } from '../store/designerStore'
import { useProjectStore } from '../store/projectStore'

import {
  createProjectFile,
  downloadProjectFile,
  readProjectFile,
  saveProjectLocally,
  type SiteForgeProjectFile,
} from './projectStorage'

export function buildCurrentProjectFile(): SiteForgeProjectFile {
  const designerState =
    useDesignerStore.getState()

  const projectState =
    useProjectStore.getState()

  return createProjectFile({
    project:
      projectState.project,

    walls:
      designerState.walls,

    cameras:
      designerState.cameras,

    zoom:
      designerState.zoom,

    offsetX:
      designerState.offsetX,

    offsetY:
      designerState.offsetY,
  })
}

export function saveCurrentProject(
  downloadFile = true,
): SiteForgeProjectFile {
  const projectFile =
    buildCurrentProjectFile()

  saveProjectLocally(
    projectFile,
  )

  useProjectStore
    .getState()
    .loadProjectMetadata(
      projectFile.project,
    )

  if (downloadFile) {
    downloadProjectFile(
      projectFile,
    )
  }

  return projectFile
}

export function applyProjectFile(
  projectFile: SiteForgeProjectFile,
): void {
  const designerStore =
    useDesignerStore.getState()

  designerStore.loadProjectScene({
    walls:
      projectFile.drawing.walls,

    cameras:
      projectFile.drawing.cameras,

    zoom:
      projectFile.drawing.viewport.zoom,

    offsetX:
      projectFile.drawing.viewport.offsetX,

    offsetY:
      projectFile.drawing.viewport.offsetY,
  })

  useProjectStore
    .getState()
    .loadProjectMetadata(
      projectFile.project,
    )

  saveProjectLocally(
    projectFile,
  )
}

export async function openProjectFromFile(
  file: File,
): Promise<SiteForgeProjectFile> {
  const projectFile =
    await readProjectFile(file)

  applyProjectFile(
    projectFile,
  )

  return projectFile
}

export function openProjectPicker(): void {
  const input =
    document.createElement('input')

  input.type = 'file'

  input.accept =
    '.siteforge,application/json'

  input.style.display =
    'none'

  input.addEventListener(
    'change',
    (): void => {
      const file =
        input.files?.[0]

      if (!file) {
        input.remove()
        return
      }

      void openProjectFromFile(file)
        .catch((error: unknown) => {
          console.error(
            'Unable to open SentryCAD project.',
            error,
          )

          const message =
            error instanceof Error
              ? error.message
              : 'Unknown project file error.'

          window.alert(
            `SentryCAD could not open the project.\n\n${message}`,
          )
        })
        .finally((): void => {
          input.remove()
        })
    },
  )

  document.body.appendChild(
    input,
  )

  input.click()
}
