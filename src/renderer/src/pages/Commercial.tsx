import type {
  JSX,
} from 'react'

import {
  Calculator,
  ShoppingCart,
} from 'lucide-react'

import QuoteBuilder from '../components/commercial/QuoteBuilder'

import {
  useProjectStore,
} from '../store/projectStore'

export default function Commercial(): JSX.Element {
  const project =
    useProjectStore(
      (state) =>
        state.project,
    )

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        background: '#0f1115',
        color: '#ffffff',
        fontFamily:
          'Segoe UI, sans-serif',
      }}
    >
      <header
        style={{
          padding:
            '18px 22px',

          background:
            '#13171d',

          borderBottom:
            '1px solid #303641',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#39ff14',
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: 1.2,
                textTransform:
                  'uppercase',
              }}
            >
              <ShoppingCart
                size={14}
              />

              SiteForge Commercial
            </div>

            <h1
              style={{
                margin:
                  '6px 0 0',
                fontSize: 22,
              }}
            >
              Quote Builder
            </h1>

            <div
              style={{
                marginTop: 4,
                color: '#747f8d',
                fontSize: 9,
              }}
            >
              Project:{' '}
              <strong
                style={{
                  color: '#b9c0c9',
                }}
              >
                {project.name}
              </strong>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding:
                '7px 10px',
              background:
                '#173619',
              border:
                '1px solid #2f7a34',
              borderRadius: 7,
              color: '#39ff14',
              fontSize: 9,
              fontWeight: 900,
            }}
          >
            <Calculator
              size={14}
            />

            LIVE QUOTE
          </div>
        </div>
      </header>

      <main
        style={{
          padding: 18,
        }}
      >
        <QuoteBuilder />
      </main>
    </div>
  )
}
