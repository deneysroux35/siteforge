import {
  useState,
  type CSSProperties,
  type FocusEvent,
  type JSX,
} from 'react'

import {
  Bot,
  Camera,
  ChartNoAxesCombined,
  HardDrive,
  Landmark,
  Network,
  Package,
  PanelsTopLeft,
  Video,
  WalletCards,
} from 'lucide-react'

import CameraLibrary from '../core/CameraLibrary'

import CameraRecommendationPanel from './CameraRecommendationPanel'
import DesignAnalysisPanel from './DesignAnalysisPanel'
import FinancePanel from './FinancePanel'
import InspectorSection from './InspectorSection'
import ProjectSummary from './ProjectSummary'
import SmartEquipmentPanel from './SmartEquipmentPanel'

import {
  useDesignerStore,
} from '../../store/designerStore'

const GRID_SIZE = 25

function snapToGrid(
  value: number,
): number {
  return (
    Math.round(
      value / GRID_SIZE,
    ) * GRID_SIZE
  )
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

const labelStyle: CSSProperties = {
  display: 'block',
  marginBottom: 6,
  color: '#8f9aa7',
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: 0.25,
  textTransform: 'uppercase',
}

const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '9px 10px',
  background: '#11151b',
  color: '#ffffff',
  border: '1px solid #343b47',
  borderRadius: 7,
  outline: 'none',
  fontSize: 12,
  fontWeight: 600,
  transition:
    'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease',
}

const fieldStyle: CSSProperties = {
  marginBottom: 12,
}

const placeholderStyle: CSSProperties = {
  padding: 11,
  background: '#111419',
  border: '1px solid #292f38',
  borderRadius: 7,
  color: '#747f8d',
  fontSize: 10,
  lineHeight: 1.5,
}

const infoBoxStyle: CSSProperties = {
  padding: '9px 10px',
  background: '#101318',
  border: '1px solid #292f38',
  borderRadius: 7,
  color: '#d5dbe3',
  fontSize: 11,
  fontWeight: 700,
}

const deleteButtonStyle: CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: '#281416',
  color: '#ff8a8a',
  border: '1px solid #5d282d',
  borderRadius: 7,
  cursor: 'pointer',
  fontWeight: 900,
  letterSpacing: 0.2,
}

export default function Properties(): JSX.Element {
  const [
    cameraLibraryOpen,
    setCameraLibraryOpen,
  ] = useState(false)

  const selectedWall =
    useDesignerStore(
      (state) =>
        state.walls.find(
          (wall) =>
            wall.selected,
        ),
    )

  const selectedCamera =
    useDesignerStore(
      (state) =>
        state.cameras.find(
          (camera) =>
            camera.selected,
        ),
    )

  const selectedEquipmentHub =
    useDesignerStore(
      (state) =>
        state.equipmentHubs.find(
          (hub) =>
            hub.selected,
        ),
    )

  const equipmentHubs =
    useDesignerStore(
      (state) =>
        state.equipmentHubs,
    )

  const beginCameraEdit =
    useDesignerStore(
      (state) =>
        state.beginCameraEdit,
    )

  const updateCameraProperties =
    useDesignerStore(
      (state) =>
        state.updateCameraProperties,
    )

  const finishCameraEdit =
    useDesignerStore(
      (state) =>
        state.finishCameraEdit,
    )

  const beginEquipmentHubEdit =
    useDesignerStore(
      (state) =>
        state.beginEquipmentHubEdit,
    )

  const updateEquipmentHubProperties =
    useDesignerStore(
      (state) =>
        state.updateEquipmentHubProperties,
    )

  const finishEquipmentHubEdit =
    useDesignerStore(
      (state) =>
        state.finishEquipmentHubEdit,
    )

  const deleteSelectedObject =
    useDesignerStore(
      (state) =>
        state.deleteSelectedObject,
    )

  function highlightInput(
    event:
      | FocusEvent<HTMLInputElement>
      | FocusEvent<HTMLSelectElement>,
  ): void {
    event.currentTarget.style.borderColor =
      '#39ff14'
  }

  function handleCameraFocus(
    event:
      | FocusEvent<HTMLInputElement>
      | FocusEvent<HTMLSelectElement>,
  ): void {
    beginCameraEdit()
    highlightInput(event)
  }

  function handleCameraInputBlur(
    event: FocusEvent<HTMLInputElement>,
  ): void {
    event.currentTarget.style.borderColor =
      '#3a414d'

    finishCameraEdit()
  }

  function handleCameraSelectBlur(
    event: FocusEvent<HTMLSelectElement>,
  ): void {
    event.currentTarget.style.borderColor =
      '#3a414d'

    finishCameraEdit()
  }

  function handleHubFocus(
    event:
      | FocusEvent<HTMLInputElement>
      | FocusEvent<HTMLSelectElement>,
  ): void {
    beginEquipmentHubEdit()
    highlightInput(event)
  }

  function handleHubInputBlur(
    event: FocusEvent<HTMLInputElement>,
  ): void {
    event.currentTarget.style.borderColor =
      '#3a414d'

    finishEquipmentHubEdit()
  }

  function handleHubSelectBlur(
    event: FocusEvent<HTMLSelectElement>,
  ): void {
    event.currentTarget.style.borderColor =
      '#3a414d'

    finishEquipmentHubEdit()
  }

  function assignCameraToHub(
    cameraId: string,
    hubId: string | null,
  ): void {
    beginCameraEdit()

    useDesignerStore.setState(
      (state) => ({
        cameras:
          state.cameras.map(
            (camera) => {
              if (
                camera.id !==
                cameraId
              ) {
                return camera
              }

              return {
                ...camera,
                assignedHubId:
                  hubId,
              }
            },
          ),
      }),
    )

    finishCameraEdit()
  }

  const selectionTitle =
    selectedCamera
      ? selectedCamera.name
      : selectedEquipmentHub
        ? selectedEquipmentHub.name
        : selectedWall
          ? 'Wall'
          : 'No object selected'

  const hasSelectedObject =
    Boolean(
      selectedWall ||
      selectedCamera ||
      selectedEquipmentHub,
    )

  const selectionType =
    selectedCamera
      ? 'CAMERA'
      : selectedEquipmentHub
        ? 'EQUIPMENT HUB'
        : selectedWall
          ? 'WALL'
          : 'NO SELECTION'

  const selectionAccent =
    selectedCamera
      ? '#39ff14'
      : selectedEquipmentHub
        ? '#4fc3f7'
        : selectedWall
          ? '#ffd54f'
          : '#68717d'

  return (
    <>
      <aside
        style={{
          width: 336,
          flexShrink: 0,
          background:
            'linear-gradient(180deg, #12161b 0%, #0f1217 100%)',
          borderLeft:
            '1px solid #303744',
          color: '#dddddd',
          overflowY: 'auto',
          overflowX: 'hidden',
          boxShadow:
            '-10px 0 30px rgba(0, 0, 0, 0.18)',
        }}
      >
        {/* HEADER */}

        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 5,
            padding:
              '14px 15px 13px',
            background:
              'rgba(15, 18, 23, 0.97)',
            borderBottom:
              '1px solid #2d333d',
            backdropFilter:
              'blur(12px)',
            boxShadow:
              '0 8px 24px rgba(0, 0, 0, 0.18)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
              gap: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#39ff14',
                  boxShadow:
                    '0 0 10px rgba(57,255,20,.75)',
                }}
              />

              <div
                style={{
                  color: '#8b95a2',
                  fontSize: 9,
                  fontWeight: 900,
                  letterSpacing: 1.35,
                  textTransform:
                    'uppercase',
                }}
              >
                SentryCAD Inspector
              </div>
            </div>

            <div
              style={{
                padding: '3px 6px',
                border:
                  `1px solid ${selectionAccent}44`,
                borderRadius: 5,
                background:
                  `${selectionAccent}12`,
                color:
                  selectionAccent,
                fontSize: 7,
                fontWeight: 900,
                letterSpacing: 0.7,
              }}
            >
              {selectionType}
            </div>
          </div>

          <div
            style={{
              marginTop: 7,
              overflow: 'hidden',
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: -0.15,
              textOverflow:
                'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {selectionTitle}
          </div>

          <div
            style={{
              marginTop: 7,
              height: 2,
              overflow: 'hidden',
              borderRadius: 4,
              background: '#232932',
            }}
          >
            <div
              style={{
                width: hasSelectedObject
                  ? '100%'
                  : '22%',
                height: '100%',
                borderRadius: 4,
                background:
                  selectionAccent,
                boxShadow:
                  `0 0 9px ${selectionAccent}66`,
                transition:
                  'width 180ms ease, background 180ms ease',
              }}
            />
          </div>
        </div>

        <div
          style={{
            padding: '12px 11px 18px',
          }}
        >
          {/* SELECTED OBJECT */}

          <InspectorSection
            title="Selected Object"
            subtitle="Object properties and controls"
            icon={
              selectedCamera ? (
                <Camera
                  size={15}
                />
              ) : selectedEquipmentHub ? (
                <Network
                  size={15}
                />
              ) : (
                <PanelsTopLeft
                  size={15}
                />
              )
            }
            accentColor={
              selectedCamera
                ? '#39ff14'
                : selectedEquipmentHub
                  ? '#4fc3f7'
                  : selectedWall
                    ? '#ffd54f'
                    : '#68717d'
            }
            defaultOpen
          >
            {!hasSelectedObject && (
              <div
                style={
                  placeholderStyle
                }
              >
                Select a wall,
                camera or equipment
                hub on the canvas to
                inspect and edit it.
              </div>
            )}

            {/* WALL */}

            {selectedWall && (
              <>
                <div
                  style={
                    fieldStyle
                  }
                >
                  <span
                    style={
                      labelStyle
                    }
                  >
                    Object Type
                  </span>

                  <div
                    style={
                      infoBoxStyle
                    }
                  >
                    Wall
                  </div>
                </div>

                <div
                  style={
                    fieldStyle
                  }
                >
                  <span
                    style={
                      labelStyle
                    }
                  >
                    Material
                  </span>

                  <div
                    style={
                      infoBoxStyle
                    }
                  >
                    {
                      selectedWall.material
                    }
                  </div>
                </div>

                <div
                  style={
                    fieldStyle
                  }
                >
                  <span
                    style={
                      labelStyle
                    }
                  >
                    Height
                  </span>

                  <div
                    style={
                      infoBoxStyle
                    }
                  >
                    {
                      selectedWall.height
                    }{' '}
                    mm
                  </div>
                </div>

                <div
                  style={
                    fieldStyle
                  }
                >
                  <span
                    style={
                      labelStyle
                    }
                  >
                    Thickness
                  </span>

                  <div
                    style={
                      infoBoxStyle
                    }
                  >
                    {
                      selectedWall.thickness
                    }
                    px
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    deleteSelectedObject
                  }
                  style={
                    deleteButtonStyle
                  }
                >
                  Delete Wall
                </button>
              </>
            )}

            {/* EQUIPMENT HUB */}

            {selectedEquipmentHub && (
              <>
                <div
                  style={
                    fieldStyle
                  }
                >
                  <span
                    style={
                      labelStyle
                    }
                  >
                    Object Type
                  </span>

                  <div
                    style={
                      infoBoxStyle
                    }
                  >
                    Equipment Hub
                  </div>
                </div>

                <div
                  style={
                    fieldStyle
                  }
                >
                  <label
                    style={
                      labelStyle
                    }
                  >
                    Hub Name
                  </label>

                  <input
                    type="text"
                    value={
                      selectedEquipmentHub.name
                    }
                    style={
                      inputStyle
                    }
                    onFocus={
                      handleHubFocus
                    }
                    onBlur={
                      handleHubInputBlur
                    }
                    onChange={(
                      event,
                    ): void => {
                      updateEquipmentHubProperties(
                        selectedEquipmentHub.id,
                        {
                          name:
                            event.target.value,
                        },
                      )
                    }}
                  />
                </div>

                <div
                  style={
                    fieldStyle
                  }
                >
                  <label
                    style={
                      labelStyle
                    }
                  >
                    Hub Type
                  </label>

                  <select
                    value={
                      selectedEquipmentHub.type
                    }
                    style={
                      inputStyle
                    }
                    onFocus={
                      handleHubFocus
                    }
                    onBlur={
                      handleHubSelectBlur
                    }
                    onChange={(
                      event,
                    ): void => {
                      updateEquipmentHubProperties(
                        selectedEquipmentHub.id,
                        {
                          type:
                            event.target.value as
                              | 'rack'
                              | 'cabinet'
                              | 'nvr',
                        },
                      )
                    }}
                  >
                    <option value="rack">
                      Rack
                    </option>

                    <option value="cabinet">
                      Cabinet
                    </option>

                    <option value="nvr">
                      NVR
                    </option>
                  </select>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap: 9,
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <label
                      style={
                        labelStyle
                      }
                    >
                      X Position
                    </label>

                    <input
                      type="number"
                      value={
                        selectedEquipmentHub.position.x
                      }
                      step={
                        GRID_SIZE
                      }
                      style={
                        inputStyle
                      }
                      onFocus={
                        handleHubFocus
                      }
                      onBlur={
                        handleHubInputBlur
                      }
                      onChange={(
                        event,
                      ): void => {
                        const value =
                          Number(
                            event.target.value,
                          )

                        if (
                          Number.isNaN(
                            value,
                          )
                        ) {
                          return
                        }

                        updateEquipmentHubProperties(
                          selectedEquipmentHub.id,
                          {
                            position: {
                              x:
                                snapToGrid(
                                  value,
                                ),

                              y:
                                selectedEquipmentHub.position.y,
                            },
                          },
                        )
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={
                        labelStyle
                      }
                    >
                      Y Position
                    </label>

                    <input
                      type="number"
                      value={
                        selectedEquipmentHub.position.y
                      }
                      step={
                        GRID_SIZE
                      }
                      style={
                        inputStyle
                      }
                      onFocus={
                        handleHubFocus
                      }
                      onBlur={
                        handleHubInputBlur
                      }
                      onChange={(
                        event,
                      ): void => {
                        const value =
                          Number(
                            event.target.value,
                          )

                        if (
                          Number.isNaN(
                            value,
                          )
                        ) {
                          return
                        }

                        updateEquipmentHubProperties(
                          selectedEquipmentHub.id,
                          {
                            position: {
                              x:
                                selectedEquipmentHub.position.x,

                              y:
                                snapToGrid(
                                  value,
                                ),
                            },
                          },
                        )
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    ...placeholderStyle,
                    marginBottom: 14,
                    border:
                      '1px solid #234b5a',
                    background:
                      '#10232a',
                    color:
                      '#82d9f7',
                  }}
                >
                  Cameras assigned to
                  this hub are used for
                  cable lengths, PoE
                  utilisation and rack
                  calculations.
                </div>

                <button
                  type="button"
                  onClick={
                    deleteSelectedObject
                  }
                  style={
                    deleteButtonStyle
                  }
                >
                  Delete Equipment Hub
                </button>
              </>
            )}

            {/* CAMERA */}

            {selectedCamera && (
              <>
                <button
                  type="button"
                  onClick={(): void => {
                    setCameraLibraryOpen(
                      true,
                    )
                  }}
                  style={{
                    width: '100%',
                    marginBottom: 16,
                    padding:
                      '10px 12px',
                    background:
                      '#173619',
                    color:
                      '#39ff14',
                    border:
                      '1px solid #2f7a34',
                    borderRadius: 7,
                    cursor: 'pointer',
                    fontWeight: 800,
                  }}
                >
                  Browse Camera Library
                </button>

                <div
                  style={
                    fieldStyle
                  }
                >
                  <label
                    style={
                      labelStyle
                    }
                  >
                    Camera Name
                  </label>

                  <input
                    type="text"
                    value={
                      selectedCamera.name
                    }
                    style={
                      inputStyle
                    }
                    onFocus={
                      handleCameraFocus
                    }
                    onBlur={
                      handleCameraInputBlur
                    }
                    onChange={(
                      event,
                    ): void => {
                      updateCameraProperties(
                        selectedCamera.id,
                        {
                          name:
                            event.target.value,
                        },
                      )
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap: 9,
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <span
                      style={
                        labelStyle
                      }
                    >
                      Manufacturer
                    </span>

                    <div
                      style={
                        infoBoxStyle
                      }
                    >
                      {
                        selectedCamera.manufacturer ??
                        'Unassigned'
                      }
                    </div>
                  </div>

                  <div>
                    <span
                      style={
                        labelStyle
                      }
                    >
                      Model
                    </span>

                    <div
                      style={
                        infoBoxStyle
                      }
                    >
                      {
                        selectedCamera.model ??
                        'Unassigned'
                      }
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap: 9,
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <label
                      style={
                        labelStyle
                      }
                    >
                      X Position
                    </label>

                    <input
                      type="number"
                      value={
                        selectedCamera.position.x
                      }
                      step={
                        GRID_SIZE
                      }
                      style={
                        inputStyle
                      }
                      onFocus={
                        handleCameraFocus
                      }
                      onBlur={
                        handleCameraInputBlur
                      }
                      onChange={(
                        event,
                      ): void => {
                        const value =
                          Number(
                            event.target.value,
                          )

                        if (
                          Number.isNaN(
                            value,
                          )
                        ) {
                          return
                        }

                        updateCameraProperties(
                          selectedCamera.id,
                          {
                            position: {
                              x:
                                snapToGrid(
                                  value,
                                ),

                              y:
                                selectedCamera.position.y,
                            },
                          },
                        )
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={
                        labelStyle
                      }
                    >
                      Y Position
                    </label>

                    <input
                      type="number"
                      value={
                        selectedCamera.position.y
                      }
                      step={
                        GRID_SIZE
                      }
                      style={
                        inputStyle
                      }
                      onFocus={
                        handleCameraFocus
                      }
                      onBlur={
                        handleCameraInputBlur
                      }
                      onChange={(
                        event,
                      ): void => {
                        const value =
                          Number(
                            event.target.value,
                          )

                        if (
                          Number.isNaN(
                            value,
                          )
                        ) {
                          return
                        }

                        updateCameraProperties(
                          selectedCamera.id,
                          {
                            position: {
                              x:
                                selectedCamera.position.x,

                              y:
                                snapToGrid(
                                  value,
                                ),
                            },
                          },
                        )
                      }}
                    />
                  </div>
                </div>

                <div
                  style={
                    fieldStyle
                  }
                >
                  <label
                    style={
                      labelStyle
                    }
                  >
                    Assigned Equipment Hub
                  </label>

                  <select
                    value={
                      selectedCamera.assignedHubId ??
                      ''
                    }
                    style={{
                      ...inputStyle,

                      borderColor:
                        selectedCamera.assignedHubId
                          ? '#2f7a34'
                          : '#66501f',

                      color:
                        selectedCamera.assignedHubId
                          ? '#bfffb2'
                          : '#ffd878',
                    }}
                    onFocus={
                      highlightInput
                    }
                    onBlur={
                      handleCameraSelectBlur
                    }
                    onChange={(
                      event,
                    ): void => {
                      const hubId =
                        event.target.value

                      assignCameraToHub(
                        selectedCamera.id,

                        hubId === ''
                          ? null
                          : hubId,
                      )
                    }}
                  >
                    <option value="">
                      Unassigned
                    </option>

                    {equipmentHubs.map(
                      (hub) => (
                        <option
                          key={
                            hub.id
                          }
                          value={
                            hub.id
                          }
                        >
                          {hub.name}
                          {' — '}
                          {hub.type}
                        </option>
                      ),
                    )}
                  </select>

                  <div
                    style={{
                      marginTop: 6,
                      color:
                        selectedCamera.assignedHubId
                          ? '#5f9d5f'
                          : '#8b7442',
                      fontSize: 9,
                      lineHeight: 1.4,
                    }}
                  >
                    {selectedCamera.assignedHubId
                      ? 'Camera is linked to an equipment hub and ready for cable calculations.'
                      : equipmentHubs.length === 0
                        ? 'Place an Equipment Hub before assigning this camera.'
                        : 'Select the rack, cabinet or NVR serving this camera.'}
                  </div>
                </div>

                <div
                  style={
                    fieldStyle
                  }
                >
                  <label
                    style={
                      labelStyle
                    }
                  >
                    Rotation
                  </label>

                  <input
                    type="number"
                    min={0}
                    max={359}
                    value={
                      Math.round(
                        selectedCamera.rotation,
                      )
                    }
                    style={
                      inputStyle
                    }
                    onFocus={
                      handleCameraFocus
                    }
                    onBlur={
                      handleCameraInputBlur
                    }
                    onChange={(
                      event,
                    ): void => {
                      const value =
                        Number(
                          event.target.value,
                        )

                      if (
                        Number.isNaN(
                          value,
                        )
                      ) {
                        return
                      }

                      updateCameraProperties(
                        selectedCamera.id,
                        {
                          rotation:
                            (
                              (
                                value %
                                360
                              ) +
                              360
                            ) %
                            360,
                        },
                      )
                    }}
                  />
                </div>
              </>
            )}
          </InspectorSection>

          {/* CAMERA COVERAGE */}

          {selectedCamera && (
            <InspectorSection
              title="Camera Coverage"
              subtitle="Field of view and range"
              icon={
                <Video
                  size={15}
                />
              }
              accentColor="#4fc3f7"
              defaultOpen
            >
              <div
                style={
                  fieldStyle
                }
              >
                <label
                  style={
                    labelStyle
                  }
                >
                  Field of View
                </label>

                <input
                  type="range"
                  min={10}
                  max={170}
                  value={
                    selectedCamera.fieldOfView
                  }
                  style={{
                    width: '100%',
                    accentColor:
                      '#39ff14',
                  }}
                  onFocus={(): void => {
                    beginCameraEdit()
                  }}
                  onBlur={(): void => {
                    finishCameraEdit()
                  }}
                  onChange={(
                    event,
                  ): void => {
                    updateCameraProperties(
                      selectedCamera.id,
                      {
                        fieldOfView:
                          clamp(
                            Number(
                              event.target.value,
                            ),
                            10,
                            170,
                          ),
                      },
                    )
                  }}
                />

                <div
                  style={{
                    color:
                      '#39ff14',
                    textAlign:
                      'right',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {
                    selectedCamera.fieldOfView
                  }
                  °
                </div>
              </div>

              <div
                style={
                  fieldStyle
                }
              >
                <label
                  style={
                    labelStyle
                  }
                >
                  Coverage Range
                </label>

                <input
                  type="range"
                  min={1}
                  max={100}
                  value={
                    selectedCamera.range
                  }
                  style={{
                    width: '100%',
                    accentColor:
                      '#39ff14',
                  }}
                  onFocus={(): void => {
                    beginCameraEdit()
                  }}
                  onBlur={(): void => {
                    finishCameraEdit()
                  }}
                  onChange={(
                    event,
                  ): void => {
                    updateCameraProperties(
                      selectedCamera.id,
                      {
                        range:
                          clamp(
                            Number(
                              event.target.value,
                            ),
                            1,
                            100,
                          ),
                      },
                    )
                  }}
                />

                <div
                  style={{
                    color:
                      '#39ff14',
                    textAlign:
                      'right',
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {
                    selectedCamera.range
                  }{' '}
                  m
                </div>
              </div>

              <button
                type="button"
                onClick={
                  deleteSelectedObject
                }
                style={
                  deleteButtonStyle
                }
              >
                Delete Camera
              </button>
            </InspectorSection>
          )}

          {/* SMART CAMERA RECOMMENDATION */}

          {selectedCamera && (
            <InspectorSection
              title="Smart Camera Recommendation"
              subtitle="AI-powered camera selection"
              icon={
                <Bot
                  size={15}
                />
              }
              accentColor="#39ff14"
              badge="SMART"
              defaultOpen
            >
              <CameraRecommendationPanel
                camera={
                  selectedCamera
                }
              />
            </InspectorSection>
          )}

          {/* PROJECT SUMMARY */}

          <InspectorSection
            title="Project Summary"
            subtitle="Live design intelligence"
            icon={
              <ChartNoAxesCombined
                size={15}
              />
            }
            accentColor="#39ff14"
            badge="LIVE"
            defaultOpen
          >
            <ProjectSummary />
          </InspectorSection>

          {/* SMART EQUIPMENT */}

          <InspectorSection
            title="Equipment"
            subtitle="Smart equipment sizing"
            icon={
              <Package
                size={15}
              />
            }
            accentColor="#ffd54f"
            badge="SMART"
            defaultOpen={false}
          >
            <SmartEquipmentPanel />
          </InspectorSection>

          {/* FINANCE */}

          <InspectorSection
            title="Finance"
            subtitle="Cash and rental options"
            icon={
              <Landmark
                size={15}
              />
            }
            accentColor="#4fc3f7"
            badge="LIVE"
            defaultOpen={false}
          >
            <FinancePanel />
          </InspectorSection>

          {/* STORAGE */}

          <InspectorSection
            title="Storage"
            subtitle="Recording and disk planning"
            icon={
              <HardDrive
                size={15}
              />
            }
            accentColor="#b388ff"
            defaultOpen={false}
          >
            <div
              style={
                placeholderStyle
              }
            >
              Advanced recording
              days, frame rate,
              compression and
              storage controls will
              appear here.
            </div>
          </InspectorSection>

          {/* COMMERCIAL */}

          <InspectorSection
            title="Commercial"
            subtitle="Costs, pricing and margins"
            icon={
              <WalletCards
                size={15}
              />
            }
            accentColor="#ffd54f"
            defaultOpen={false}
          >
            <div
              style={
                placeholderStyle
              }
            >
              Equipment cost,
              labour, markup,
              selling price and
              margin are managed in
              the Commercial
              workspace.
            </div>
          </InspectorSection>

          {/* AI ASSISTANT */}

          <InspectorSection
            title="AI Assistant"
            subtitle="Live design review and recommendations"
            icon={
              <Bot
                size={15}
              />
            }
            accentColor="#4fc3f7"
            badge="LIVE"
            defaultOpen
          >
            <DesignAnalysisPanel />
          </InspectorSection>
        </div>
      </aside>

      {cameraLibraryOpen && (
        <CameraLibrary
          onClose={(): void => {
            setCameraLibraryOpen(
              false,
            )
          }}
        />
      )}
    </>
  )
}
