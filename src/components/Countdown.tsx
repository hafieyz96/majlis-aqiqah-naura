import { useEffect, useState } from 'react'

interface CountdownProps {
  targetISO: string
}

interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

function calc(targetISO: string): Remaining {
  const diff = new Date(targetISO).getTime() - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  }
  const seconds = Math.floor(diff / 1000)
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return { days, hours, minutes, seconds: secs, done: false }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function Countdown({ targetISO }: CountdownProps) {
  const [remaining, setRemaining] = useState(() => calc(targetISO))

  useEffect(() => {
    setRemaining(calc(targetISO))
    const id = window.setInterval(() => setRemaining(calc(targetISO)), 1000)
    return () => window.clearInterval(id)
  }, [targetISO])

  if (remaining.done) {
    return (
      <p className="countdown--message card">Alhamdulillah, majlis sedang / telah berlangsung.</p>
    )
  }

  return (
    <div className="countdown" role="timer" aria-label="Kiraan detik ke majlis">
      <p className="countdown__caption">Menghitung hari bahagia</p>
      <div className="countdown__grid">
        <div className="countdown__unit">
          <span className="countdown__value">{remaining.days}</span>
          <span className="countdown__label">Hari</span>
        </div>
        <div className="countdown__unit">
          <span className="countdown__value">{pad(remaining.hours)}</span>
          <span className="countdown__label">Jam</span>
        </div>
        <div className="countdown__unit">
          <span className="countdown__value">{pad(remaining.minutes)}</span>
          <span className="countdown__label">Minit</span>
        </div>
        <div className="countdown__unit">
          <span className="countdown__value">{pad(remaining.seconds)}</span>
          <span className="countdown__label">Saat</span>
        </div>
      </div>
    </div>
  )
}
