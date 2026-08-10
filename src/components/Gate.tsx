import { useEffect, useState } from 'react'
import { FloralCorner, JawiTitle } from './Decor'

type GatePhase = 'tertutup' | 'terbuka'

interface GateProps {
  eventTitle: string
  names: string
  jawiTitle: string
  onOpened: () => void
}

export function Gate({ eventTitle, names, jawiTitle, onOpened }: GateProps) {
  const [phase, setPhase] = useState<GatePhase>('tertutup')
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    document.body.classList.add('gerbang-aktif')
    return () => {
      document.body.classList.remove('gerbang-aktif', 'gerbang-dedah')
    }
  }, [])

  const open = () => {
    if (phase !== 'tertutup') return
    setUnlocked(true)
    window.setTimeout(() => {
      setPhase('terbuka')
      document.body.classList.remove('gerbang-aktif')
      document.body.classList.add('gerbang-dedah')
      window.scrollTo(0, 0)
      window.setTimeout(() => onOpened(), 850)
    }, 320)
  }

  return (
    <div className="gate" data-phase={phase} aria-hidden={phase === 'terbuka'}>
      <div className="gate__panel gate__panel--left">
        <div className="gate__seam" />
        <FloralCorner
          filterId="wash-gate-tl"
          className="gate__floral gate__floral--tl"
          variant="full"
        />
        <FloralCorner
          filterId="wash-gate-bl"
          className="gate__floral gate__floral--bl"
          variant="full"
        />
      </div>
      <div className="gate__panel gate__panel--right">
        <div className="gate__seam" />
        <FloralCorner
          filterId="wash-gate-tr"
          className="gate__floral gate__floral--tr"
          variant="full"
        />
        <FloralCorner
          filterId="wash-gate-br"
          className="gate__floral gate__floral--br"
          variant="full"
        />
      </div>

      <div className="gate__center">
        <div className="gate__text">
          <p className="opening__bismillah-arabic" lang="ar" dir="rtl">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p className="opening__bismillah">Bismillahirrahmanirrahim</p>
          <div className="opening__jawi">
            <JawiTitle text={jawiTitle} />
          </div>
          <h1 className="opening__title">{eventTitle}</h1>
          <p className="opening__names">{names}</p>
        </div>

        <div className="gate__text gate__text--butang">
          <div className={`seal ${unlocked ? 'seal--unlocked' : ''}`} aria-hidden="true">
            <span className="seal__ring" />
            <span className="seal__glow" />
            <span className="seal__icon">
              <svg viewBox="0 0 24 24" fill="none">
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M8 10 V8 a4 4 0 0 1 8 0 v2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="15" r="1.4" fill="currentColor" />
              </svg>
            </span>
          </div>
          <span className="seal__thread" aria-hidden="true" />
          <button type="button" className="opening__button" onClick={open}>
            Buka Jemputan
          </button>
        </div>
      </div>
    </div>
  )
}
