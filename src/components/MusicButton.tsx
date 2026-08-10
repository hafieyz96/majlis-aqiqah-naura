import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

interface MusicButtonProps {
  audioUrl: string
}

export interface MusicButtonHandle {
  start: () => Promise<void>
}

const TARGET_VOLUME = 0.25
const FADE_MS = 3000
const PAUSED_KEY = 'muzik-dihentikan'

function MusicNoteIcon({ muted = false }: { muted?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 17V6l10-2v11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={muted ? 0.55 : 1}
      />
      <circle
        cx="6.5"
        cy="17.5"
        r="2.6"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity={muted ? 0.55 : 1}
      />
      <circle
        cx="16.5"
        cy="15.5"
        r="2.6"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity={muted ? 0.55 : 1}
      />
      {muted && (
        <path d="M4 20 L20 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      )}
    </svg>
  )
}

export const MusicButton = forwardRef<MusicButtonHandle, MusicButtonProps>(function MusicButton(
  { audioUrl },
  ref,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<number | null>(null)
  const [playing, setPlaying] = useState(false)

  const clearFade = useCallback(() => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current)
      fadeRef.current = null
    }
  }, [])

  const fadeTo = useCallback(
    (target: number, durationMs: number) => {
      clearFade()
      const audio = audioRef.current
      if (!audio) return
      const from = audio.volume
      const started = performance.now()
      fadeRef.current = window.setInterval(() => {
        const el = audioRef.current
        if (!el) {
          clearFade()
          return
        }
        const t = Math.min((performance.now() - started) / durationMs, 1)
        el.volume = Math.min(Math.max(from + (target - from) * t, 0), 1)
        if (t >= 1) clearFade()
      }, 50)
    },
    [clearFade],
  )

  const start = useCallback(async () => {
    try {
      if (window.sessionStorage.getItem(PAUSED_KEY) === '1') return
    } catch {
      /* ignore */
    }
    const audio = audioRef.current
    if (!audio) return
    try {
      audio.volume = 0
      await audio.play()
      setPlaying(true)
      fadeTo(TARGET_VOLUME, FADE_MS)
    } catch {
      setPlaying(false)
    }
  }, [fadeTo])

  useImperativeHandle(ref, () => ({ start }), [start])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = TARGET_VOLUME
  }, [audioUrl])

  useEffect(() => clearFade, [clearFade])

  if (!audioUrl) return null

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      clearFade()
      audio.pause()
      setPlaying(false)
      try {
        window.sessionStorage.setItem(PAUSED_KEY, '1')
      } catch {
        /* ignore */
      }
      return
    }
    try {
      await audio.play()
      setPlaying(true)
      try {
        window.sessionStorage.removeItem(PAUSED_KEY)
      } catch {
        /* ignore */
      }
      if (audio.volume < TARGET_VOLUME) fadeTo(TARGET_VOLUME, 800)
    } catch {
      setPlaying(false)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        className={`music-btn ${playing ? 'music-btn--playing' : ''}`}
        aria-label={playing ? 'Hentikan muzik' : 'Mainkan muzik'}
        aria-pressed={playing}
        onClick={() => void toggle()}
      >
        <span className="music-btn__ring" aria-hidden="true" />
        <span className="music-btn__icon">
          <MusicNoteIcon muted={!playing} />
        </span>
      </button>
    </>
  )
})
