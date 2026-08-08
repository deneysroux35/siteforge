export interface CablePoint {
  x: number
  y: number
}

export interface CableCamera {
  id: string

  name: string

  position: CablePoint
}

export interface CableEstimateSettings {
  pixelsPerMeter: number

  slackPercentage: number

  cameraServiceLoopMeters: number

  rackServiceLoopMeters: number

  minimumCableMeters: number
}

export interface CameraCableEstimate {
  cameraId: string

  cameraName: string

  straightLineMeters: number

  slackMeters: number

  serviceLoopMeters: number

  estimatedCableMeters: number
}

export interface ProjectCableEstimate {
  cameras: CameraCableEstimate[]

  cameraCount: number

  straightLineMeters: number

  slackMeters: number

  serviceLoopMeters: number

  totalCableMeters: number

  roundedCableMeters: number
}

export const DEFAULT_CABLE_SETTINGS:
  CableEstimateSettings = {
    /*
     * SiteForge's drawing grid is
     * currently 25 px.
     *
     * For the first cable engine
     * version we treat 25 px as
     * one metre.
     *
     * Later this will become a
     * project calibration setting.
     */
    pixelsPerMeter: 25,

    /*
     * Additional cable allowance
     * for real-world routing,
     * bends and installation.
     */
    slackPercentage: 10,

    /*
     * Spare cable left at each
     * camera.
     */
    cameraServiceLoopMeters: 1,

    /*
     * Spare cable left at the
     * NVR / PoE switch / rack.
     */
    rackServiceLoopMeters: 2,

    /*
     * Prevent unrealistically
     * short cable estimates.
     */
    minimumCableMeters: 3,
  }

function clamp(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  )
}

function roundTo(
  value: number,
  decimals: number,
): number {
  const multiplier =
    10 ** decimals

  return (
    Math.round(
      value * multiplier,
    ) / multiplier
  )
}

export function calculatePixelDistance(
  start: CablePoint,
  end: CablePoint,
): number {
  const deltaX =
    end.x - start.x

  const deltaY =
    end.y - start.y

  return Math.sqrt(
    deltaX ** 2 +
    deltaY ** 2,
  )
}

export function convertPixelsToMeters(
  pixels: number,
  pixelsPerMeter: number,
): number {
  const safeScale =
    Math.max(
      0.0001,
      pixelsPerMeter,
    )

  return pixels / safeScale
}

export function calculateStraightLineMeters(
  start: CablePoint,
  end: CablePoint,
  pixelsPerMeter: number,
): number {
  const pixels =
    calculatePixelDistance(
      start,
      end,
    )

  return roundTo(
    convertPixelsToMeters(
      pixels,
      pixelsPerMeter,
    ),
    2,
  )
}

export function calculateCameraCableEstimate(
  camera: CableCamera,
  hubPosition: CablePoint,
  settings:
    CableEstimateSettings =
      DEFAULT_CABLE_SETTINGS,
): CameraCableEstimate {
  const pixelsPerMeter =
    Math.max(
      0.0001,
      settings.pixelsPerMeter,
    )

  const slackPercentage =
    clamp(
      settings.slackPercentage,
      0,
      100,
    )

  const cameraServiceLoopMeters =
    Math.max(
      0,
      settings.cameraServiceLoopMeters,
    )

  const rackServiceLoopMeters =
    Math.max(
      0,
      settings.rackServiceLoopMeters,
    )

  const minimumCableMeters =
    Math.max(
      0,
      settings.minimumCableMeters,
    )

  const straightLineMeters =
    calculateStraightLineMeters(
      hubPosition,
      camera.position,
      pixelsPerMeter,
    )

  const slackMeters =
    straightLineMeters *
    (
      slackPercentage /
      100
    )

  const serviceLoopMeters =
    cameraServiceLoopMeters +
    rackServiceLoopMeters

  const calculatedMeters =
    straightLineMeters +
    slackMeters +
    serviceLoopMeters

  const estimatedCableMeters =
    Math.max(
      minimumCableMeters,
      calculatedMeters,
    )

  return {
    cameraId:
      camera.id,

    cameraName:
      camera.name,

    straightLineMeters:
      roundTo(
        straightLineMeters,
        2,
      ),

    slackMeters:
      roundTo(
        slackMeters,
        2,
      ),

    serviceLoopMeters:
      roundTo(
        serviceLoopMeters,
        2,
      ),

    estimatedCableMeters:
      roundTo(
        estimatedCableMeters,
        2,
      ),
  }
}

export function calculateProjectCableEstimate(
  cameras: CableCamera[],
  hubPosition: CablePoint,
  settings:
    CableEstimateSettings =
      DEFAULT_CABLE_SETTINGS,
): ProjectCableEstimate {
  const estimates =
    cameras.map(
      (camera) =>
        calculateCameraCableEstimate(
          camera,
          hubPosition,
          settings,
        ),
    )

  const straightLineMeters =
    estimates.reduce(
      (
        total,
        camera,
      ) =>
        total +
        camera.straightLineMeters,
      0,
    )

  const slackMeters =
    estimates.reduce(
      (
        total,
        camera,
      ) =>
        total +
        camera.slackMeters,
      0,
    )

  const serviceLoopMeters =
    estimates.reduce(
      (
        total,
        camera,
      ) =>
        total +
        camera.serviceLoopMeters,
      0,
    )

  const totalCableMeters =
    estimates.reduce(
      (
        total,
        camera,
      ) =>
        total +
        camera.estimatedCableMeters,
      0,
    )

  /*
   * Round project cable upward
   * to the next whole metre for
   * purchasing purposes.
   */
  const roundedCableMeters =
    Math.ceil(
      totalCableMeters,
    )

  return {
    cameras:
      estimates,

    cameraCount:
      estimates.length,

    straightLineMeters:
      roundTo(
        straightLineMeters,
        2,
      ),

    slackMeters:
      roundTo(
        slackMeters,
        2,
      ),

    serviceLoopMeters:
      roundTo(
        serviceLoopMeters,
        2,
      ),

    totalCableMeters:
      roundTo(
        totalCableMeters,
        2,
      ),

    roundedCableMeters,
  }
}

export function calculateCableDrumsRequired(
  cableMeters: number,
  drumSizeMeters = 305,
): number {
  if (
    cableMeters <= 0
  ) {
    return 0
  }

  const safeDrumSize =
    Math.max(
      1,
      drumSizeMeters,
    )

  return Math.ceil(
    cableMeters /
    safeDrumSize,
  )
}

export function calculateCableCost(
  cableMeters: number,
  costPerMeter: number,
): number {
  const safeMeters =
    Math.max(
      0,
      cableMeters,
    )

  const safeCost =
    Math.max(
      0,
      costPerMeter,
    )

  return roundTo(
    safeMeters *
    safeCost,
    2,
  )
}
