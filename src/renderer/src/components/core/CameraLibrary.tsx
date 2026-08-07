import {
  useMemo,
  useState,
  type CSSProperties,
  type JSX,
} from 'react'

import {
  Camera,
  Check,
  Search,
  X,
} from 'lucide-react'

import {
  useDesignerStore,
} from '../../store/designerStore'

interface CameraLibraryProps {
  onClose: () => void
}

interface CameraLibraryItem {
  id: string

  manufacturer: string

  model: string

  resolution: string

  lens: string

  fieldOfView: number

  range: number

  irRange: number

  unitPrice: number

  unitPower: number
}

const cameraLibrary:
  CameraLibraryItem[] = [
    {
      id: 'hikvision-2cd2087g2-lu',

      manufacturer:
        'Hikvision',

      model:
        'DS-2CD2087G2-LU',

      resolution:
        '8 MP',

      lens:
        '2.8 mm',

      fieldOfView:
        108,

      range:
        30,

      irRange:
        30,

      unitPrice:
        2850,

      unitPower:
        7.5,
    },

    {
      id: 'hikvision-2cd2387g2-lu',

      manufacturer:
        'Hikvision',

      model:
        'DS-2CD2387G2-LU',

      resolution:
        '8 MP',

      lens:
        '2.8 mm',

      fieldOfView:
        108,

      range:
        30,

      irRange:
        30,

      unitPrice:
        3150,

      unitPower:
        7.8,
    },

    {
      id: 'hikvision-2cd2047g2-lu',

      manufacturer:
        'Hikvision',

      model:
        'DS-2CD2047G2-LU',

      resolution:
        '4 MP',

      lens:
        '2.8 mm',

      fieldOfView:
        102,

      range:
        30,

      irRange:
        30,

      unitPrice:
        2250,

      unitPower:
        6.8,
    },

    {
      id: 'hikvision-2cd2347g2-lu',

      manufacturer:
        'Hikvision',

      model:
        'DS-2CD2347G2-LU',

      resolution:
        '4 MP',

      lens:
        '2.8 mm',

      fieldOfView:
        102,

      range:
        30,

      irRange:
        30,

      unitPrice:
        2450,

      unitPower:
        7.0,
    },

    {
      id: 'dahua-hdw3849h-as-pv',

      manufacturer:
        'Dahua',

      model:
        'IPC-HDW3849H-AS-PV',

      resolution:
        '8 MP',

      lens:
        '2.8 mm',

      fieldOfView:
        107,

      range:
        30,

      irRange:
        30,

      unitPrice:
        2950,

      unitPower:
        8.0,
    },

    {
      id: 'dahua-hdw3449h-as-pv',

      manufacturer:
        'Dahua',

      model:
        'IPC-HDW3449H-AS-PV',

      resolution:
        '4 MP',

      lens:
        '2.8 mm',

      fieldOfView:
        104,

      range:
        30,

      irRange:
        30,

      unitPrice:
        2350,

      unitPower:
        7.2,
    },
  ]

const cardStyle:
  CSSProperties = {
    background:
      '#15191f',

    border:
      '1px solid #303641',

    borderRadius:
      8,
  }

export default function CameraLibrary({
  onClose,
}: CameraLibraryProps): JSX.Element {
  const [
    search,
    setSearch,
  ] = useState('')

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

  const filtered =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase()

        if (!query) {
          return cameraLibrary
        }

        return cameraLibrary.filter(
          (camera) => {
            const text = [
              camera.manufacturer,
              camera.model,
              camera.resolution,
              camera.lens,
            ]
              .join(' ')
              .toLowerCase()

            return text.includes(
              query,
            )
          },
        )
      },
      [search],
    )

  function applyCamera(
    item: CameraLibraryItem,
  ): void {
    if (!selectedCamera) {
      return
    }

    beginCameraEdit()

    updateCameraProperties(
      selectedCamera.id,
      {
        name:
          `${item.manufacturer} ${item.model}`,

        fieldOfView:
          item.fieldOfView,

        range:
          item.range,
      },
    )

    finishCameraEdit()

    onClose()
  }

  return (
    <div
      style={{
        position:
          'fixed',

        inset:
          0,

        zIndex:
          9999,

        display:
          'flex',

        alignItems:
          'center',

        justifyContent:
          'center',

        padding:
          24,

        background:
          'rgba(0, 0, 0, 0.72)',

        backdropFilter:
          'blur(4px)',
      }}
      onMouseDown={(
        event,
      ): void => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <div
        style={{
          width:
            'min(900px, 92vw)',

          maxHeight:
            '82vh',

          display:
            'flex',

          flexDirection:
            'column',

          overflow:
            'hidden',

          background:
            '#101318',

          border:
            '1px solid #343b47',

          borderRadius:
            12,

          boxShadow:
            '0 24px 80px rgba(0,0,0,.55)',

          color:
            '#ffffff',
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display:
              'flex',

            alignItems:
              'center',

            justifyContent:
              'space-between',

            gap:
              16,

            padding:
              '16px 18px',

            background:
              '#171b21',

            borderBottom:
              '1px solid #303641',
          }}
        >
          <div>
            <div
              style={{
                display:
                  'flex',

                alignItems:
                  'center',

                gap:
                  8,

                fontSize:
                  15,

                fontWeight:
                  900,
              }}
            >
              <Camera
                size={18}
                color="#39ff14"
              />

              Camera Library
            </div>

            <div
              style={{
                marginTop:
                  4,

                color:
                  '#747f8d',

                fontSize:
                  9,
              }}
            >
              Select a product to
              assign it to the
              currently selected
              camera.
            </div>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            style={{
              width:
                34,

              height:
                34,

              display:
                'grid',

              placeItems:
                'center',

              background:
                '#20242b',

              color:
                '#b9c0c9',

              border:
                '1px solid #343b47',

              borderRadius:
                7,

              cursor:
                'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* SEARCH */}

        <div
          style={{
            padding:
              14,

            borderBottom:
              '1px solid #292f38',
          }}
        >
          <div
            style={{
              position:
                'relative',
            }}
          >
            <Search
              size={15}
              style={{
                position:
                  'absolute',

                left:
                  11,

                top:
                  '50%',

                transform:
                  'translateY(-50%)',

                color:
                  '#68717d',
              }}
            />

            <input
              type="text"
              value={
                search
              }
              placeholder="Search manufacturer, model, resolution or lens..."
              onChange={(
                event,
              ): void => {
                setSearch(
                  event.target.value,
                )
              }}
              autoFocus
              style={{
                width:
                  '100%',

                boxSizing:
                  'border-box',

                padding:
                  '10px 12px 10px 36px',

                background:
                  '#111419',

                color:
                  '#ffffff',

                border:
                  '1px solid #343b47',

                borderRadius:
                  7,

                outline:
                  'none',

                fontSize:
                  11,
              }}
            />
          </div>
        </div>

        {/* CAMERA LIST */}

        <div
          style={{
            flex:
              1,

            overflowY:
              'auto',

            padding:
              14,
          }}
        >
          {!selectedCamera && (
            <div
              style={{
                marginBottom:
                  12,

                padding:
                  10,

                background:
                  '#33230f',

                border:
                  '1px solid #6f4918',

                borderRadius:
                  7,

                color:
                  '#ffbd66',

                fontSize:
                  9,
              }}
            >
              No camera is currently
              selected. Close the
              library, select a
              camera on the drawing,
              and open the library
              again.
            </div>
          )}

          <div
            style={{
              display:
                'grid',

              gridTemplateColumns:
                'repeat(2, minmax(0, 1fr))',

              gap:
                10,
            }}
          >
            {filtered.map(
              (item) => (
                <button
                  key={
                    item.id
                  }
                  type="button"
                  disabled={
                    !selectedCamera
                  }
                  onClick={(): void => {
                    applyCamera(
                      item,
                    )
                  }}
                  style={{
                    ...cardStyle,

                    display:
                      'block',

                    width:
                      '100%',

                    padding:
                      13,

                    textAlign:
                      'left',

                    cursor:
                      selectedCamera
                        ? 'pointer'
                        : 'not-allowed',

                    opacity:
                      selectedCamera
                        ? 1
                        : 0.5,

                    color:
                      '#ffffff',
                  }}
                >
                  <div
                    style={{
                      display:
                        'flex',

                      alignItems:
                        'flex-start',

                      justifyContent:
                        'space-between',

                      gap:
                        10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color:
                            '#39ff14',

                          fontSize:
                            8,

                          fontWeight:
                            900,

                          letterSpacing:
                            0.8,

                          textTransform:
                            'uppercase',
                        }}
                      >
                        {
                          item.manufacturer
                        }
                      </div>

                      <div
                        style={{
                          marginTop:
                            4,

                          color:
                            '#ffffff',

                          fontSize:
                            12,

                          fontWeight:
                            900,
                        }}
                      >
                        {
                          item.model
                        }
                      </div>
                    </div>

                    <Camera
                      size={18}
                      color="#4fc3f7"
                    />
                  </div>

                  <div
                    style={{
                      display:
                        'grid',

                      gridTemplateColumns:
                        '1fr 1fr',

                      gap:
                        8,

                      marginTop:
                        12,

                      paddingTop:
                        10,

                      borderTop:
                        '1px solid #292f38',
                    }}
                  >
                    <Spec
                      label="Resolution"
                      value={
                        item.resolution
                      }
                    />

                    <Spec
                      label="Lens"
                      value={
                        item.lens
                      }
                    />

                    <Spec
                      label="Field of View"
                      value={`${item.fieldOfView}°`}
                    />

                    <Spec
                      label="Range"
                      value={`${item.range} m`}
                    />

                    <Spec
                      label="Night Range"
                      value={`${item.irRange} m`}
                    />

                    <Spec
                      label="Power"
                      value={`${item.unitPower.toFixed(
                        1,
                      )} W`}
                    />
                  </div>

                  <div
                    style={{
                      display:
                        'flex',

                      alignItems:
                        'center',

                      justifyContent:
                        'space-between',

                      marginTop:
                        12,

                      paddingTop:
                        10,

                      borderTop:
                        '1px solid #292f38',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color:
                            '#68717d',

                          fontSize:
                            7,

                          fontWeight:
                            900,

                          textTransform:
                            'uppercase',
                        }}
                      >
                        Selling Price
                      </div>

                      <div
                        style={{
                          marginTop:
                            3,

                          color:
                            '#ffd54f',

                          fontSize:
                            13,

                          fontWeight:
                            900,
                        }}
                      >
                        R{' '}
                        {item.unitPrice.toLocaleString(
                          'en-ZA',
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        display:
                          'flex',

                        alignItems:
                          'center',

                        gap:
                          5,

                        color:
                          '#39ff14',

                        fontSize:
                          9,

                        fontWeight:
                          900,
                      }}
                    >
                      <Check
                        size={13}
                      />

                      Select
                    </div>
                  </div>
                </button>
              ),
            )}
          </div>

          {filtered.length ===
            0 && (
            <div
              style={{
                padding:
                  40,

                textAlign:
                  'center',

                color:
                  '#68717d',

                fontSize:
                  10,
              }}
            >
              No cameras match your
              search.
            </div>
          )}
        </div>

        {/* FOOTER */}

        <div
          style={{
            display:
              'flex',

            alignItems:
              'center',

            justifyContent:
              'space-between',

            padding:
              '10px 14px',

            background:
              '#111419',

            borderTop:
              '1px solid #292f38',

            color:
              '#68717d',

            fontSize:
              8,
          }}
        >
          <span>
            {filtered.length}{' '}
            cameras
          </span>

          <span>
            SiteForge Product Library
          </span>
        </div>
      </div>
    </div>
  )
}

interface SpecProps {
  label: string

  value: string
}

function Spec({
  label,
  value,
}: SpecProps): JSX.Element {
  return (
    <div>
      <div
        style={{
          color:
            '#68717d',

          fontSize:
            7,

          fontWeight:
            900,

          textTransform:
            'uppercase',
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop:
            2,

          color:
            '#c5ccd5',

          fontSize:
            9,

          fontWeight:
            700,
        }}
      >
        {value}
      </div>
    </div>
  )
}
