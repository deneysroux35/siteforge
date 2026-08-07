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
  Package,
  PanelsTopLeft,
  Video,
  WalletCards,
} from 'lucide-react'

import CameraLibrary from '../core/CameraLibrary'

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
  color: '#a7a7a7',
  fontSize: 11,
  fontWeight: 700,
}

const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '9px 10px',
  background: '#20242b',
  color: '#ffffff',
  border: '1px solid #3a414d',
  borderRadius: 6,
  outline: 'none',
  fontSize: 12,
}

const fieldStyle: CSSProperties = {
  marginBottom: 14,
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

  const deleteSelectedObject =
    useDesignerStore(
      (state) =>
        state.deleteSelectedObject,
    )

  function handleInputFocus(): void {
    beginCameraEdit()
  }

  function handleInputBlur(
    event: FocusEvent<HTMLInputElement>,
  ): void {
    event.currentTarget.style.borderColor =
      '#3a414d'

    finishCameraEdit()
  }

  function handleFocusHighlight(
    event: FocusEvent<HTMLInputElement>,
  ): void {
    event.currentTarget.style.borderColor =
      '#39ff14'
  }

  const selectionTitle =
    selectedCamera
      ? selectedCamera.name
      : selectedWall
        ? 'Wall'
        : 'No object selected'

  return (
    <>
      <aside
        style={{
          width: 320,
          flexShrink: 0,
          background: '#13161c',
          borderLeft:
            '1px solid #343b47',
          color: '#dddddd',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 5,
            padding:
              '15px 16px 13px',
            background:
              'rgba(19, 22, 28, 0.97)',
            borderBottom:
              '1px solid #2d333d',
            backdropFilter:
              'blur(10px)',
          }}
        >
          <div
            style={{
              color: '#68717d',
              fontSize: 9,
              fontWeight: 900,
              letterSpacing: 1.3,
              textTransform:
                'uppercase',
            }}
          >
            SiteForge Inspector
          </div>

          <div
            style={{
              marginTop: 5,
              overflow: 'hidden',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 800,
              textOverflow:
                'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {selectionTitle}
          </div>
        </div>

        <div
          style={{
            padding: 12,
          }}
        >
          <InspectorSection
            title="Selected Object"
            subtitle="Object properties and controls"
            icon={
              selectedCamera ? (
                <Camera size={15} />
              ) : (
                <PanelsTopLeft
                  size={15}
                />
              )
            }
            accentColor={
              selectedCamera
                ? '#39ff14'
                : selectedWall
                  ? '#ffd54f'
                  : '#68717d'
            }
            defaultOpen
          >
            {!selectedWall &&
              !selectedCamera && (
                <div
                  style={
                    placeholderStyle
                  }
                >
                  Select a wall or
                  camera on the canvas
                  to inspect and edit
                  it.
                </div>
              )}

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
                      inputStyle
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
                      inputStyle
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
                      inputStyle
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
                      inputStyle
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
                  style={{
                    width: '100%',
                    padding:
                      '10px 12px',
                    background:
                      '#3a1919',
                    color:
                      '#ff8a8a',
                    border:
                      '1px solid #6b2929',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontWeight: 800,
                  }}
                >
                  Delete Wall
                </button>
              </>
            )}

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
                    Camera Name /
                    Model
                  </label>

                  <input
                    type="text"
                    value={
                      selectedCamera.name
                    }
                    style={
                      inputStyle
                    }
                    onFocus={(
                      event,
                    ): void => {
                      handleInputFocus()

                      handleFocusHighlight(
                        event,
                      )
                    }}
                    onBlur={
                      handleInputBlur
                    }
                    onChange={(
                      event,
                    ): void => {
                      updateCameraProperties(
                        selectedCamera.id,
                        {
                          name:
                            event
                              .target
                              .value,
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
                        selectedCamera
                          .position.x
                      }
                      step={
                        GRID_SIZE
                      }
                      style={
                        inputStyle
                      }
                      onFocus={(
                        event,
                      ): void => {
                        handleInputFocus()

                        handleFocusHighlight(
                          event,
                        )
                      }}
                      onBlur={
                        handleInputBlur
                      }
                      onChange={(
                        event,
                      ): void => {
                        const value =
                          Number(
                            event
                              .target
                              .value,
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
                            position:
                              {
                                x: snapToGrid(
                                  value,
                                ),
                                y:
                                  selectedCamera
                                    .position
                                    .y,
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
                        selectedCamera
                          .position.y
                      }
                      step={
                        GRID_SIZE
                      }
                      style={
                        inputStyle
                      }
                      onFocus={(
                        event,
                      ): void => {
                        handleInputFocus()

                        handleFocusHighlight(
                          event,
                        )
                      }}
                      onBlur={
                        handleInputBlur
                      }
                      onChange={(
                        event,
                      ): void => {
                        const value =
                          Number(
                            event
                              .target
                              .value,
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
                            position:
                              {
                                x:
                                  selectedCamera
                                    .position
                                    .x,
                                y: snapToGrid(
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
                    Rotation
                  </label>

                  <input
                    type="number"
                    min={0}
                    max={359}
                    value={Math.round(
                      selectedCamera.rotation,
                    )}
                    style={
                      inputStyle
                    }
                    onFocus={(
                      event,
                    ): void => {
                      handleInputFocus()

                      handleFocusHighlight(
                        event,
                      )
                    }}
                    onBlur={
                      handleInputBlur
                    }
                    onChange={(
                      event,
                    ): void => {
                      const value =
                        Number(
                          event
                            .target
                            .value,
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
                            ((value %
                              360) +
                              360) %
                            360,
                        },
                      )
                    }}
                  />
                </div>
              </>
            )}
          </InspectorSection>

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
                  onFocus={
                    handleInputFocus
                  }
                  onBlur={
                    finishCameraEdit
                  }
                  onChange={(
                    event,
                  ): void => {
                    updateCameraProperties(
                      selectedCamera.id,
                      {
                        fieldOfView:
                          clamp(
                            Number(
                              event
                                .target
                                .value,
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
                  onFocus={
                    handleInputFocus
                  }
                  onBlur={
                    finishCameraEdit
                  }
                  onChange={(
                    event,
                  ): void => {
                    updateCameraProperties(
                      selectedCamera.id,
                      {
                        range:
                          clamp(
                            Number(
                              event
                                .target
                                .value,
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
                style={{
                  width: '100%',
                  padding:
                    '10px 12px',
                  background:
                    '#3a1919',
                  color:
                    '#ff8a8a',
                  border:
                    '1px solid #6b2929',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
              >
                Delete Camera
              </button>
            </InspectorSection>
          )}

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

          <InspectorSection
            title="AI Assistant"
            subtitle="Design review and recommendations"
            icon={
              <Bot
                size={15}
              />
            }
            accentColor="#4fc3f7"
            defaultOpen={false}
          >
            <div
              style={
                placeholderStyle
              }
            >
              Automated coverage
              reviews, equipment
              recommendations and
              design warnings will
              appear here.
            </div>
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
