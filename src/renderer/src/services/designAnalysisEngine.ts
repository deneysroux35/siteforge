import type {
  Camera,
  EquipmentHub,
} from '../components/designer/types'

export type DesignSeverity =
  | 'info'
  | 'warning'
  | 'critical'

export interface DesignFinding {
  id: string

  severity: DesignSeverity

  category:
    | 'camera'
    | 'cable'
    | 'hub'
    | 'coverage'
    | 'power'
    | 'general'

  title: string

  message: string

  objectId?: string

  recommendation?: string
}

export interface CameraDesignAnalysis {
  cameraId: string

  cameraName: string

  assignedHubId:
    | string
    | null

  cableDistanceMetres:
    | number
    | null

  coverageRangeMetres: number

  score: number

  findings: DesignFinding[]
}

export interface DesignAnalysisResult {
  score: number

  cameraCount: number

  assignedCameraCount: number

  unassignedCameraCount: number

  hubCount: number

  totalCableMetres: number

  warningCount: number

  criticalCount: number

  findings: DesignFinding[]

  cameras:
    CameraDesignAnalysis[]
}

const PIXELS_PER_METRE = 25

const RECOMMENDED_MAX_ETHERNET_RUN =
  90

const ABSOLUTE_MAX_ETHERNET_RUN =
  100

function roundTo(
  value: number,
  decimals: number,
): number {
  const multiplier =
    10 ** decimals

  return (
    Math.round(
      value *
      multiplier,
    ) /
    multiplier
  )
}

function calculateDistanceMetres(
  camera: Camera,
  hub: EquipmentHub,
): number {
  const deltaX =
    hub.position.x -
    camera.position.x

  const deltaY =
    hub.position.y -
    camera.position.y

  const pixels =
    Math.sqrt(
      deltaX ** 2 +
      deltaY ** 2,
    )

  return roundTo(
    pixels /
    PIXELS_PER_METRE,
    1,
  )
}

function analyseCamera(
  camera: Camera,
  hubs: EquipmentHub[],
): CameraDesignAnalysis {
  const findings:
    DesignFinding[] = []

  let score = 100

  let assignedHub:
    | EquipmentHub
    | undefined

  if (
    camera.assignedHubId
  ) {
    assignedHub =
      hubs.find(
        (hub) =>
          hub.id ===
          camera.assignedHubId,
      )
  }

  let cableDistanceMetres:
    | number
    | null = null

  if (
    !camera.assignedHubId
  ) {
    findings.push({
      id:
        `${camera.id}-no-hub`,

      severity:
        'warning',

      category:
        'hub',

      title:
        'Camera not assigned to hub',

      message:
        `${camera.name} is not assigned to an equipment hub.`,

      objectId:
        camera.id,

      recommendation:
        'Assign this camera to the rack, cabinet or NVR that will serve it.',
    })

    score -= 15
  } else if (
    !assignedHub
  ) {
    findings.push({
      id:
        `${camera.id}-missing-hub`,

      severity:
        'critical',

      category:
        'hub',

      title:
        'Assigned hub missing',

      message:
        `${camera.name} references an equipment hub that no longer exists.`,

      objectId:
        camera.id,

      recommendation:
        'Assign this camera to a valid equipment hub.',
    })

    score -= 25
  }

  if (
    assignedHub
  ) {
    cableDistanceMetres =
      calculateDistanceMetres(
        camera,
        assignedHub,
      )

    if (
      cableDistanceMetres >
      ABSOLUTE_MAX_ETHERNET_RUN
    ) {
      findings.push({
        id:
          `${camera.id}-cable-critical`,

        severity:
          'critical',

        category:
          'cable',

        title:
          'Ethernet run exceeds 100 m',

        message:
          `${camera.name} is approximately ${cableDistanceMetres} m from ${assignedHub.name}.`,

        objectId:
          camera.id,

        recommendation:
          'Move the equipment hub closer, add an intermediate network cabinet, or use fibre with a remote PoE switch.',
      })

      score -= 30
    } else if (
      cableDistanceMetres >
      RECOMMENDED_MAX_ETHERNET_RUN
    ) {
      findings.push({
        id:
          `${camera.id}-cable-warning`,

        severity:
          'warning',

        category:
          'cable',

        title:
          'Ethernet run is near limit',

        message:
          `${camera.name} is approximately ${cableDistanceMetres} m from ${assignedHub.name}.`,

        objectId:
          camera.id,

        recommendation:
          'Review the final installed cable path and consider moving the hub closer.',
      })

      score -= 12
    }
  }

  if (
    camera.range > 50
  ) {
    findings.push({
      id:
        `${camera.id}-range-high`,

      severity:
        'warning',

      category:
        'coverage',

      title:
        'Long design range',

      message:
        `${camera.name} is configured for a ${camera.range} m coverage range.`,

      objectId:
        camera.id,

      recommendation:
        'Review lens choice, resolution and identification requirements for this distance.',
    })

    score -= 10
  }

  if (
    camera.fieldOfView >
    140
  ) {
    findings.push({
      id:
        `${camera.id}-fov-wide`,

      severity:
        'warning',

      category:
        'coverage',

      title:
        'Very wide field of view',

      message:
        `${camera.name} is configured with a ${camera.fieldOfView}° field of view.`,

      objectId:
        camera.id,

      recommendation:
        'Verify that the scene still provides enough detail for recognition or identification.',
    })

    score -= 8
  }

  if (
    camera.range <= 0
  ) {
    findings.push({
      id:
        `${camera.id}-invalid-range`,

      severity:
        'critical',

      category:
        'camera',

      title:
        'Invalid camera range',

      message:
        `${camera.name} has an invalid coverage range.`,

      objectId:
        camera.id,

      recommendation:
        'Set a valid design range greater than zero.',
    })

    score -= 25
  }

  return {
    cameraId:
      camera.id,

    cameraName:
      camera.name,

    assignedHubId:
      camera.assignedHubId,

    cableDistanceMetres,

    coverageRangeMetres:
      camera.range,

    score:
      Math.max(
        0,
        Math.min(
          100,
          score,
        ),
      ),

    findings,
  }
}

function getOverallScore(
  cameraAnalyses:
    CameraDesignAnalysis[],
  hubCount: number,
): number {
  if (
    cameraAnalyses.length ===
    0
  ) {
    return 0
  }

  const averageCameraScore =
    cameraAnalyses.reduce(
      (
        total,
        camera,
      ) =>
        total +
        camera.score,
      0,
    ) /
    cameraAnalyses.length

  let score =
    averageCameraScore

  if (
    hubCount === 0
  ) {
    score -= 15
  }

  return Math.round(
    Math.max(
      0,
      Math.min(
        100,
        score,
      ),
    ),
  )
}

export function analyseDesign(
  cameras: Camera[],
  equipmentHubs:
    EquipmentHub[],
): DesignAnalysisResult {
  const cameraAnalyses =
    cameras.map(
      (camera) =>
        analyseCamera(
          camera,
          equipmentHubs,
        ),
    )

  const findings =
    cameraAnalyses.flatMap(
      (camera) =>
        camera.findings,
    )

  if (
    cameras.length > 0 &&
    equipmentHubs.length ===
      0
  ) {
    findings.push({
      id:
        'project-no-hub',

      severity:
        'critical',

      category:
        'hub',

      title:
        'No equipment hub placed',

      message:
        'The design contains cameras but no equipment hub.',

      recommendation:
        'Place at least one rack, cabinet or NVR hub and assign cameras to it.',
    })
  }

  const assignedCameraCount =
    cameras.filter(
      (camera) =>
        Boolean(
          camera.assignedHubId &&
          equipmentHubs.some(
            (hub) =>
              hub.id ===
              camera.assignedHubId,
          ),
        ),
    ).length

  const totalCableMetres =
    cameraAnalyses.reduce(
      (
        total,
        camera,
      ) =>
        total +
        (
          camera.cableDistanceMetres ??
          0
        ),
      0,
    )

  const warningCount =
    findings.filter(
      (finding) =>
        finding.severity ===
        'warning',
    ).length

  const criticalCount =
    findings.filter(
      (finding) =>
        finding.severity ===
        'critical',
    ).length

  return {
    score:
      getOverallScore(
        cameraAnalyses,
        equipmentHubs.length,
      ),

    cameraCount:
      cameras.length,

    assignedCameraCount,

    unassignedCameraCount:
      cameras.length -
      assignedCameraCount,

    hubCount:
      equipmentHubs.length,

    totalCableMetres:
      roundTo(
        totalCableMetres,
        1,
      ),

    warningCount,

    criticalCount,

    findings,

    cameras:
      cameraAnalyses,
  }
}
