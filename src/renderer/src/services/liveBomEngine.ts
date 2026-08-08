import type {
  Camera,
  EquipmentHub,
} from '../components/designer/types'

export interface LiveBomSummary {
  totalCableMetres: number

  cableDrums: number

  rj45Connectors: number

  patchPanels24: number

  faceplates: number

  switchPorts: number

  labourHours: number

  assignedCameraCount: number

  unassignedCameraCount: number
}

const PIXELS_PER_METRE = 25
const CABLE_DRUM_METRES = 305

function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const deltaX =
    x2 - x1

  const deltaY =
    y2 - y1

  return Math.sqrt(
    deltaX ** 2 +
    deltaY ** 2,
  )
}

export function calculateLiveBom(
  cameras: Camera[],
  equipmentHubs: EquipmentHub[],
): LiveBomSummary {
  let totalCableMetres = 0
  let assignedCameraCount = 0

  cameras.forEach(
    (camera) => {
      if (
        !camera.assignedHubId
      ) {
        return
      }

      const hub =
        equipmentHubs.find(
          (item) =>
            item.id ===
            camera.assignedHubId,
        )

      if (!hub) {
        return
      }

      const pixelDistance =
        calculateDistance(
          camera.position.x,
          camera.position.y,
          hub.position.x,
          hub.position.y,
        )

      totalCableMetres +=
        pixelDistance /
        PIXELS_PER_METRE

      assignedCameraCount += 1
    },
  )

  const roundedCableMetres =
    Math.ceil(
      totalCableMetres,
    )

  const cameraCount =
    cameras.length

  return {
    totalCableMetres:
      roundedCableMetres,

    cableDrums:
      roundedCableMetres > 0
        ? Math.ceil(
            roundedCableMetres /
              CABLE_DRUM_METRES,
          )
        : 0,

    rj45Connectors:
      assignedCameraCount * 2,

    patchPanels24:
      assignedCameraCount > 0
        ? Math.ceil(
            assignedCameraCount /
              24,
          )
        : 0,

    faceplates:
      assignedCameraCount,

    switchPorts:
      assignedCameraCount,

    labourHours:
      Number(
        (
          assignedCameraCount *
            1.75 +
          roundedCableMetres /
            50
        ).toFixed(1),
      ),

    assignedCameraCount,

    unassignedCameraCount:
      cameraCount -
      assignedCameraCount,
  }
}
