import { useEffect, useRef, useState } from 'react'

interface MusicButtonProps {
  audioUrl: string
  unlocked: boolean
}

export function MusicButton({ audioUrl, unlocked }: MusicButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!audioUrl) return
    const audio = new Audio(audioUrl)
    audio.loop = true
    audio.preload = 'metadata'
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [audioUrl])

  useEffect(() => {
    if (!unlocked || !audioUrl || !audioRef.current) return
    const audio = audioRef.current
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }, [unlocked, audioUrl])

  if (!audioUrl) return null

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }
  }

  return (
    <button
      type="button"
      className={`music-btn ${playing ? 'music-btn--playing' : ''}`}
      aria-label={playing ? 'Hentikan muzik' : 'Mainkan muzik'}
      aria-pressed={playing}
      onClick={toggle}
    >
      <span className="music-btn__ring" aria-hidden="true" />
      <span className="music-btn__icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 17V6l10-2v11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6.5" cy="17.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="16.5" cy="15.5" r="2.6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
    </button>
  )
}
