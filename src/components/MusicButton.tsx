import { useEffect, useRef, useState } from 'react'

interface MusicButtonProps {
  audioUrl: string
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId: string
          playerVars?: Record<string, number | string>
          events?: {
            onReady?: (e: { target: YtPlayer }) => void
            onStateChange?: (e: { data: number; target: YtPlayer }) => void
            onError?: () => void
          }
        },
      ) => YtPlayer
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number }
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

interface YtPlayer {
  playVideo: () => void
  pauseVideo: () => void
  unMute: () => void
  mute: () => void
  destroy: () => void
  getPlayerState: () => number
}

function parseYoutubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.replace(/^\//, '').split('/')[0] || null
    }
    const fromQuery = u.searchParams.get('v')
    if (fromQuery) return fromQuery
    const embed = u.pathname.match(/\/(?:embed|shorts)\/([^/?#]+)/)
    return embed?.[1] ?? null
  } catch {
    return null
  }
}

function loadYoutubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve()
  return new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      resolve()
    }
    if (!document.querySelector('script[data-yt-api]')) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      script.dataset.ytApi = '1'
      document.head.appendChild(script)
    }
  })
}

export function MusicButton({ audioUrl }: MusicButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ytPlayerRef = useRef<YtPlayer | null>(null)
  const ytHostRef = useRef<HTMLDivElement | null>(null)
  const userPausedRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  const youtubeId = audioUrl ? parseYoutubeId(audioUrl) : null

  const tryPlay = () => {
    if (userPausedRef.current) return
    if (youtubeId) {
      const player = ytPlayerRef.current
      if (!player) return
      try {
        player.unMute()
        player.playVideo()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
      return
    }
    const audio = audioRef.current
    if (!audio) return
    void audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }

  useEffect(() => {
    if (!audioUrl) return

    let cancelled = false

    if (youtubeId) {
      setReady(false)
      void loadYoutubeApi().then(() => {
        if (cancelled || !ytHostRef.current || !window.YT) return
        ytPlayerRef.current?.destroy()
        ytPlayerRef.current = new window.YT.Player(ytHostRef.current, {
          videoId: youtubeId,
          playerVars: {
            autoplay: 1,
            mute: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            loop: 1,
            playlist: youtubeId,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              if (cancelled) return
              setReady(true)
              try {
                e.target.unMute()
                e.target.playVideo()
                setPlaying(true)
              } catch {
                setPlaying(false)
              }
            },
            onStateChange: (e) => {
              const playingState = window.YT?.PlayerState.PLAYING ?? 1
              const pausedState = window.YT?.PlayerState.PAUSED ?? 2
              const endedState = window.YT?.PlayerState.ENDED ?? 0
              if (e.data === playingState) setPlaying(true)
              if (e.data === pausedState) setPlaying(false)
              if (e.data === endedState && !userPausedRef.current) {
                e.target.playVideo()
              }
            },
          },
        })
      })

      return () => {
        cancelled = true
        ytPlayerRef.current?.destroy()
        ytPlayerRef.current = null
      }
    }

    const audio = new Audio(audioUrl)
    audio.loop = true
    audio.preload = 'auto'
    audio.autoplay = true
    audioRef.current = audio
    setReady(true)
    void audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))

    return () => {
      cancelled = true
      audio.pause()
      audioRef.current = null
    }
  }, [audioUrl, youtubeId])

  // Retry autoplay on first user gesture (browser policy)
  useEffect(() => {
    if (!audioUrl || !ready) return

    const resume = () => {
      if (userPausedRef.current || playing) return
      tryPlay()
    }

    const opts: AddEventListenerOptions = { capture: true, passive: true }
    document.addEventListener('pointerdown', resume, opts)
    document.addEventListener('touchstart', resume, opts)
    document.addEventListener('keydown', resume, opts)
    document.addEventListener('click', resume, opts)

    // Also retry shortly after load
    const t1 = window.setTimeout(tryPlay, 300)
    const t2 = window.setTimeout(tryPlay, 1000)

    return () => {
      document.removeEventListener('pointerdown', resume, opts)
      document.removeEventListener('touchstart', resume, opts)
      document.removeEventListener('keydown', resume, opts)
      document.removeEventListener('click', resume, opts)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tryPlay reads latest refs
  }, [audioUrl, ready, playing])

  if (!audioUrl) return null

  const toggle = async () => {
    if (youtubeId) {
      const player = ytPlayerRef.current
      if (!player) return
      if (playing) {
        userPausedRef.current = true
        player.pauseVideo()
        setPlaying(false)
      } else {
        userPausedRef.current = false
        player.unMute()
        player.playVideo()
        setPlaying(true)
      }
      return
    }

    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      userPausedRef.current = true
      audio.pause()
      setPlaying(false)
    } else {
      userPausedRef.current = false
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }
  }

  return (
    <>
      {youtubeId && (
        <div className="music-yt" aria-hidden="true">
          <div ref={ytHostRef} />
        </div>
      )}
      <button
        type="button"
        className={`music-btn ${playing ? 'music-btn--playing' : ''}`}
        aria-label={playing ? 'Hentikan muzik' : 'Mainkan muzik'}
        aria-pressed={playing}
        onClick={() => void toggle()}
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
    </>
  )
}
