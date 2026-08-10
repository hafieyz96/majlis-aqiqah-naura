import { useEffect } from 'react'
import type { ContactPerson, SiteConfig } from '../types'
import { getDisplayNames } from '../data/defaultConfig'
import { whatsappUrl } from '../utils/images'

interface ContactSheetProps {
  open: boolean
  onClose: () => void
  contacts: ContactPerson[]
  config: SiteConfig
}

export function ContactSheet({ open, onClose, contacts, config }: ContactSheetProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const names = getDisplayNames(config)

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div
        className="sheet__backdrop"
        aria-hidden="true"
        onClick={onClose}
        style={{ position: 'absolute', inset: 0 }}
      />
      <div className="sheet__panel" style={{ position: 'relative', zIndex: 1 }}>
        <span className="sheet__grip" aria-hidden="true" />
        <button type="button" className="sheet__close" aria-label="Tutup" onClick={onClose}>
          ✕
        </button>
        <h3 id="sheet-title" className="sheet__title">
          Hubungi Tuan Rumah
        </h3>
        <p className="sheet__text">Sahkan kehadiran melalui WhatsApp</p>
        <div className="sheet__options">
          {contacts.flatMap((c) => [
            <a
              key={`${c.phone}-hadir`}
              className="sheet__option"
              href={whatsappUrl(
                c.phone,
                `Assalamualaikum, saya ingin mengesahkan kehadiran ke majlis ${names}. Insya-Allah saya / kami HADIR.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sheet__option-icon" aria-hidden="true">
                ✅
              </span>
              <span className="sheet__option-label">
                Hadir — {c.name}
              </span>
              <span className="sheet__option-arrow" aria-hidden="true">
                ›
              </span>
            </a>,
            <a
              key={`${c.phone}-tidak`}
              className="sheet__option"
              href={whatsappUrl(
                c.phone,
                `Assalamualaikum, maaf saya / kami TIDAK HADIR ke majlis ${names}. Semoga majlis berjalan lancar.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sheet__option-icon" aria-hidden="true">
                💌
              </span>
              <span className="sheet__option-label">
                Tidak hadir — {c.name}
              </span>
              <span className="sheet__option-arrow" aria-hidden="true">
                ›
              </span>
            </a>,
          ])}
        </div>
        <button type="button" className="sheet__dismiss" onClick={onClose}>
          Tutup
        </button>
      </div>
    </div>
  )
}
