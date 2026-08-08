import type {
  JSX,
  ReactNode,
} from 'react'

import {
  Cable,
  Camera,
  Clock3,
  HardDrive,
  Network,
} from 'lucide-react'

import {
  useDesignerStore,
} from '../../store/designerStore'

import {
  calculateLiveBom,
} from '../../services/liveBomEngine'

import {
  calculateProjectSummary,
} from '../../services/projectEngine'

interface RowProps {
  label: string
  value: string | number
  accent?: string
}

function Row({
  label,
  value,
  accent,
}: RowProps): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        padding: '7px 0',
        borderBottom: '1px solid #262c34',
      }}
    >
      <span
        style={{
          color: '#97a2af',
          fontSize: 11,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: accent ?? '#ffffff',
          fontSize: 12,
          textAlign: 'right',
        }}
      >
        {value}
      </strong>
    </div>
  )
}

interface CardProps {
  title: string
  icon: ReactNode
  accent: string
  children: ReactNode
}

function Card({
  title,
  icon,
  accent,
  children,
}: CardProps): JSX.Element {
  return (
    <div
      style={{
        background: '#15191f',
        border: '1px solid #303641',
        borderRadius: 8,
        padding: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
          color: accent,
          fontWeight: 700,
          fontSize: 12,
        }}
      >
        {icon}
        {title}
      </div>

      {children}
    </div>
  )
}

export default function ProjectSummary(): JSX.Element {
  const walls =
    useDesignerStore(
      (state) => state.walls,
    )

  const cameras =
    useDesignerStore(
      (state) => state.cameras,
    )

  const equipmentHubs =
    useDesignerStore(
      (state) =>
        state.equipmentHubs,
    )

  const summary =
    calculateProjectSummary({
      walls,
      cameras,
    })

  const bom =
    calculateLiveBom(
      cameras,
      equipmentHubs,
    )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <Card
        title="Cameras"
        icon={<Camera size={15} />}
        accent="#39ff14"
      >
        <Row
          label="Installed"
          value={summary.cameraCount}
        />

        <Row
          label="Assigned to Hub"
          value={bom.assignedCameraCount}
          accent="#39ff14"
        />

        <Row
          label="Unassigned"
          value={bom.unassignedCameraCount}
          accent={
            bom.unassignedCameraCount > 0
              ? '#ffd54f'
              : '#ffffff'
          }
        />

        <Row
          label="Average Resolution"
          value={`${summary.averageResolutionMP.toFixed(
            1,
          )} MP`}
        />

        <Row
          label="Total Camera Power"
          value={`${summary.totalCameraPower.toFixed(
            1,
          )} W`}
        />
      </Card>

      <Card
        title="Cabling"
        icon={<Cable size={15} />}
        accent="#4fc3f7"
      >
        <Row
          label="CAT6 Required"
          value={`${bom.totalCableMetres} m`}
          accent="#39ff14"
        />

        <Row
          label="305 m Cable Drums"
          value={bom.cableDrums}
        />

        <Row
          label="RJ45 Connectors"
          value={bom.rj45Connectors}
        />
      </Card>

      <Card
        title="Infrastructure"
        icon={<Network size={15} />}
        accent="#ffd54f"
      >
        <Row
          label="Switch Ports"
          value={bom.switchPorts}
        />

        <Row
          label="24-Port Patch Panels"
          value={bom.patchPanels24}
        />

        <Row
          label="Faceplates"
          value={bom.faceplates}
        />

        <Row
          label="Equipment Hubs"
          value={equipmentHubs.length}
        />
      </Card>

      <Card
        title="Recording"
        icon={<HardDrive size={15} />}
        accent="#b388ff"
      >
        <Row
          label="Estimated Storage"
          value={`${summary.estimatedStorageTB.toFixed(
            1,
          )} TB`}
        />
      </Card>

      <Card
        title="Labour"
        icon={<Clock3 size={15} />}
        accent="#39ff14"
      >
        <Row
          label="Estimated Hours"
          value={bom.labourHours}
          accent="#39ff14"
        />
      </Card>
    </div>
  )
}
