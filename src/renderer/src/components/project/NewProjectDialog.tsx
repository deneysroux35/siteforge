import {
  useEffect,
  useState,
  type FormEvent,
  type JSX,
} from 'react'

import {
  Building2,
  MapPin,
  UserRound,
  X,
} from 'lucide-react'

import { useProjectStore } from '../../store/projectStore'

interface NewProjectDialogProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export default function NewProjectDialog({
  open,
  onClose,
  onCreated,
}: NewProjectDialogProps): JSX.Element | null {
  const createNewProject = useProjectStore(
    (state) => state.createNewProject,
  )

  const [projectName, setProjectName] =
    useState('')

  const [customerName, setCustomerName] =
    useState('')

  const [siteAddress, setSiteAddress] =
    useState('')

  const [designerName, setDesignerName] =
    useState('')

  const [revision, setRevision] =
    useState('Rev 1')

  useEffect((): void => {
    if (!open) {
      return
    }

    setProjectName('')
    setCustomerName('')
    setSiteAddress('')
    setDesignerName('')
    setRevision('Rev 1')
  }, [open])

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault()

    createNewProject({
      name:
        projectName.trim() ||
        'Untitled Site',

      customerName:
        customerName.trim(),

      siteAddress:
        siteAddress.trim(),

      designerName:
        designerName.trim(),

      revision:
        revision.trim() ||
        'Rev 1',
    })

    onCreated()
    onClose()
  }

  if (!open) {
    return null
  }

  return (
    <div
      role="presentation"
      onMouseDown={(event): void => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 7000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background:
          'rgba(5, 7, 10, 0.72)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 'min(560px, 94vw)',
          overflow: 'hidden',
          background: '#15191f',
          border:
            '1px solid #3a424f',
          borderRadius: 14,
          boxShadow:
            '0 30px 90px rgba(0,0,0,.62)',
          color: '#ffffff',
          fontFamily:
            'Segoe UI, sans-serif',
        }}
      >
        <header
          style={{
            minHeight: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            gap: 14,
            padding: '0 18px',
            background: '#1b2027',
            borderBottom:
              '1px solid #303641',
          }}
        >
          <div>
            <div
              style={{
                color: '#39ff14',
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: 1.2,
                textTransform:
                  'uppercase',
              }}
            >
              SentryCAD Project
            </div>

            <h2
              style={{
                margin: '4px 0 0',
                fontSize: 19,
              }}
            >
              New Project
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Close"
            style={{
              width: 34,
              height: 34,
              display: 'grid',
              placeItems: 'center',
              background: '#232831',
              color: '#9ca6b3',
              border:
                '1px solid #343b47',
              borderRadius: 7,
              cursor: 'pointer',
            }}
          >
            <X size={17} />
          </button>
        </header>

        <div
          style={{
            padding: 18,
          }}
        >
          <Field
            label="Project Name"
            icon={<Building2 size={15} />}
          >
            <input
              autoFocus
              type="text"
              value={projectName}
              placeholder="Warehouse CCTV Upgrade"
              onChange={(event): void => {
                setProjectName(
                  event.target.value,
                )
              }}
              style={inputStyle}
            />
          </Field>

          <Field
            label="Customer"
            icon={<UserRound size={15} />}
          >
            <input
              type="text"
              value={customerName}
              placeholder="ABC Logistics"
              onChange={(event): void => {
                setCustomerName(
                  event.target.value,
                )
              }}
              style={inputStyle}
            />
          </Field>

          <Field
            label="Site Address"
            icon={<MapPin size={15} />}
          >
            <input
              type="text"
              value={siteAddress}
              placeholder="Cape Town"
              onChange={(event): void => {
                setSiteAddress(
                  event.target.value,
                )
              }}
              style={inputStyle}
            />
          </Field>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 150px',
              gap: 12,
            }}
          >
            <Field
              label="Designer"
              icon={<UserRound size={15} />}
            >
              <input
                type="text"
                value={designerName}
                placeholder="Designer name"
                onChange={(event): void => {
                  setDesignerName(
                    event.target.value,
                  )
                }}
                style={inputStyle}
              />
            </Field>

            <Field label="Revision">
              <input
                type="text"
                value={revision}
                onChange={(event): void => {
                  setRevision(
                    event.target.value,
                  )
                }}
                style={inputStyle}
              />
            </Field>
          </div>

          <div
            style={{
              marginTop: 6,
              padding: 11,
              background: '#111419',
              border:
                '1px solid #292f38',
              borderRadius: 8,
              color: '#747f8d',
              fontSize: 10,
              lineHeight: 1.5,
            }}
          >
            Customer and site details will later
            flow automatically into quotations,
            proposals and reports.
          </div>
        </div>

        <footer
          style={{
            minHeight: 58,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 9,
            padding: '0 18px',
            background: '#111419',
            borderTop:
              '1px solid #303641',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '9px 14px',
              background: '#232831',
              color: '#b7bec8',
              border:
                '1px solid #343b47',
              borderRadius: 7,
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            style={{
              padding: '9px 16px',
              background:
                'linear-gradient(180deg, #39ff14, #24d80c)',
              color: '#071007',
              border:
                '1px solid #6dff55',
              borderRadius: 7,
              cursor: 'pointer',
              fontWeight: 900,
              boxShadow:
                '0 0 18px rgba(57,255,20,.18)',
            }}
          >
            Create Project
          </button>
        </footer>
      </form>
    </div>
  )
}

interface FieldProps {
  label: string
  icon?: JSX.Element
  children: JSX.Element
}

function Field({
  label,
  icon,
  children,
}: FieldProps): JSX.Element {
  return (
    <div
      style={{
        marginBottom: 14,
      }}
    >
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          marginBottom: 6,
          color: '#9ca6b3',
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        {icon}

        {label}
      </label>

      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  padding: '10px 11px',
  background: '#20242b',
  color: '#ffffff',
  border: '1px solid #3a414d',
  borderRadius: 7,
  outline: 'none',
  fontSize: 12,
}
