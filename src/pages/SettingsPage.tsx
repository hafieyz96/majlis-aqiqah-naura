import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { FolderImagesPanel } from '../components/FolderImagesPanel'
import { defaultConfig } from '../data/defaultConfig'
import { useSiteConfig } from '../hooks/useSiteConfig'
import type { Child, ProgrammeBlock, SiteConfig } from '../types'

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="field">
      <span className="field__label">{label}</span>
      {children}
    </div>
  )
}

export function SettingsPage() {
  const { config, saveConfig, resetConfig } = useSiteConfig()
  const [draft, setDraft] = useState<SiteConfig>(structuredClone(config))
  const [status, setStatus] = useState('')

  useEffect(() => {
    setDraft(structuredClone(config))
  }, [config])

  const update = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
  }

  const updateChild = (index: number, patch: Partial<Child>) => {
    setDraft((d) => {
      const children = d.children.map((c, i) => (i === index ? { ...c, ...patch } : c))
      return { ...d, children }
    })
  }

  const updateProgramme = (index: number, patch: Partial<ProgrammeBlock>) => {
    setDraft((d) => {
      const programme = d.programme.map((p, i) => (i === index ? { ...p, ...patch } : p))
      return { ...d, programme }
    })
  }

  const onSave = (e: FormEvent) => {
    e.preventDefault()
    try {
      saveConfig(draft)
      setStatus('Tetapan disimpan ke peranti ini.')
    } catch {
      setStatus(
        'Gagal menyimpan — storan penuh. Kurangkan saiz/galeri/stiker dan cuba lagi.',
      )
    }
  }

  const onReset = () => {
    if (!confirm('Set semula semua tetapan kepada lalai?')) return
    const fresh = resetConfig()
    setDraft(structuredClone(fresh))
    setStatus('Tetapan dikembalikan kepada lalai.')
  }

  return (
    <div className="settings">
      <header className="settings__header">
        <div>
          <p className="settings__eyebrow">Pengurusan</p>
          <h1 className="settings__title">Tetapan Jemputan</h1>
        </div>
        <Link to="/" className="btn btn--outline">
          ← Kembali
        </Link>
      </header>

      <form className="settings__form" onSubmit={onSave}>
        <section className="card settings__card">
          <h2>Maklumat Majlis</h2>
          <Field label="Tajuk majlis">
            <input
              className="field__input"
              value={draft.eventTitle}
              onChange={(e) => update('eventTitle', e.target.value)}
            />
          </Field>
          <Field label="Tajuk Jawi">
            <input
              className="field__input"
              value={draft.jawiTitle}
              onChange={(e) => update('jawiTitle', e.target.value)}
              dir="rtl"
            />
          </Field>
          <div className="settings__row">
            <Field label="Hari">
              <input
                className="field__input"
                value={draft.eventDayName}
                onChange={(e) => update('eventDayName', e.target.value)}
              />
            </Field>
            <Field label="Tarikh paparan">
              <input
                className="field__input"
                value={draft.eventDateDisplay}
                onChange={(e) => update('eventDateDisplay', e.target.value)}
              />
            </Field>
          </div>
          <Field label="Masa paparan">
            <input
              className="field__input"
              value={draft.eventTimeDisplay}
              onChange={(e) => update('eventTimeDisplay', e.target.value)}
            />
          </Field>
          <div className="settings__row">
            <Field label="Mula (ISO)">
              <input
                className="field__input"
                value={draft.eventDateTimeISO}
                onChange={(e) => update('eventDateTimeISO', e.target.value)}
                placeholder="2026-08-29T11:00:00+08:00"
              />
            </Field>
            <Field label="Tamat (ISO)">
              <input
                className="field__input"
                value={draft.eventEndDateTimeISO}
                onChange={(e) => update('eventEndDateTimeISO', e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section className="card settings__card">
          <h2>Alamat &amp; Navigasi</h2>
          <Field label="Alamat baris 1">
            <input
              className="field__input"
              value={draft.addressLine1}
              onChange={(e) => update('addressLine1', e.target.value)}
            />
          </Field>
          <Field label="Alamat baris 2">
            <input
              className="field__input"
              value={draft.addressLine2}
              onChange={(e) => update('addressLine2', e.target.value)}
            />
          </Field>
          <Field label="Query Google Maps">
            <input
              className="field__input"
              value={draft.mapsQuery}
              onChange={(e) => update('mapsQuery', e.target.value)}
            />
          </Field>
          <Field label="Query Waze">
            <input
              className="field__input"
              value={draft.wazeQuery}
              onChange={(e) => update('wazeQuery', e.target.value)}
            />
          </Field>
        </section>

        <section className="card settings__card">
          <h2>Tuan Rumah</h2>
          <Field label="Pengenalan">
            <input
              className="field__input"
              value={draft.hosts.intro}
              onChange={(e) =>
                update('hosts', { ...draft.hosts, intro: e.target.value })
              }
            />
          </Field>
          <Field label="Nama 1">
            <input
              className="field__input"
              value={draft.hosts.host1}
              onChange={(e) =>
                update('hosts', { ...draft.hosts, host1: e.target.value })
              }
            />
          </Field>
          <Field label="Nama 2">
            <input
              className="field__input"
              value={draft.hosts.host2}
              onChange={(e) =>
                update('hosts', { ...draft.hosts, host2: e.target.value })
              }
            />
          </Field>
          <Field label="Penutup">
            <input
              className="field__input"
              value={draft.hosts.suffix}
              onChange={(e) =>
                update('hosts', { ...draft.hosts, suffix: e.target.value })
              }
            />
          </Field>
        </section>

        <section className="card settings__card">
          <h2>Teks Jemputan</h2>
          <Field label="Teks jemputan">
            <textarea
              className="field__input field__textarea"
              rows={4}
              value={draft.invitationText}
              onChange={(e) => update('invitationText', e.target.value)}
            />
          </Field>
          <Field label="Nota">
            <input
              className="field__input"
              value={draft.invitationNote}
              onChange={(e) => update('invitationNote', e.target.value)}
            />
          </Field>
          <Field label="Pengenalan ucapan">
            <input
              className="field__input"
              value={draft.wishesIntro}
              onChange={(e) => update('wishesIntro', e.target.value)}
            />
          </Field>
          <Field label="Doa">
            <textarea
              className="field__input field__textarea"
              rows={3}
              value={draft.doaText}
              onChange={(e) => update('doaText', e.target.value)}
            />
          </Field>
          <Field label="Penutup">
            <textarea
              className="field__input field__textarea"
              rows={2}
              value={draft.closingThanks}
              onChange={(e) => update('closingThanks', e.target.value)}
            />
          </Field>
          <Field label="URL audio (pilihan)">
            <input
              className="field__input"
              value={draft.audioUrl}
              onChange={(e) => update('audioUrl', e.target.value)}
              placeholder="https://.../lagu.mp3"
            />
          </Field>
        </section>

        {draft.children.map((child, index) => (
          <section key={child.id} className="card settings__card">
            <div className="settings__card-head">
              <h2>Anak {index + 1}</h2>
              <label className="settings__check">
                <input
                  type="checkbox"
                  checked={child.enabled}
                  onChange={(e) => updateChild(index, { enabled: e.target.checked })}
                />
                Aktif
              </label>
            </div>
            <Field label="Nama">
              <input
                className="field__input"
                value={child.name}
                onChange={(e) => updateChild(index, { name: e.target.value })}
              />
            </Field>
            <Field label="Nama pendek (paparan hero)">
              <input
                className="field__input"
                value={child.shortName ?? ''}
                onChange={(e) => updateChild(index, { shortName: e.target.value })}
                placeholder="cth. Naura"
              />
            </Field>
            <div className="settings__row">
              <Field label="Tarikh lahir">
                <input
                  className="field__input"
                  value={child.birthDate}
                  onChange={(e) => updateChild(index, { birthDate: e.target.value })}
                />
              </Field>
              <Field label="Label umur">
                <input
                  className="field__input"
                  value={child.ageLabel}
                  onChange={(e) => updateChild(index, { ageLabel: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Label sambutan">
              <input
                className="field__input"
                value={child.celebrationLabel}
                onChange={(e) =>
                  updateChild(index, { celebrationLabel: e.target.value })
                }
              />
            </Field>
          </section>
        ))}

        <FolderImagesPanel
          title="Foto hero (polaroid)"
          folder="hero"
          multi={false}
          selected={draft.children[0]?.heroPhoto ? [draft.children[0].heroPhoto] : []}
          onChange={(paths) => updateChild(0, { heroPhoto: paths[0] ?? '' })}
          onStatus={setStatus}
        />

        <FolderImagesPanel
          title="Foto kad sambutan"
          folder="card"
          multi={false}
          selected={draft.children[0]?.cardPhoto ? [draft.children[0].cardPhoto] : []}
          onChange={(paths) => updateChild(0, { cardPhoto: paths[0] ?? '' })}
          onStatus={setStatus}
        />

        <section className="card settings__card">
          <h2>WhatsApp</h2>
          {draft.whatsappContacts.map((c, i) => (
            <div key={i} className="settings__row">
              <Field label={`Nama ${i + 1}`}>
                <input
                  className="field__input"
                  value={c.name}
                  onChange={(e) => {
                    const whatsappContacts = draft.whatsappContacts.map((x, idx) =>
                      idx === i ? { ...x, name: e.target.value } : x,
                    )
                    update('whatsappContacts', whatsappContacts)
                  }}
                />
              </Field>
              <Field label="Nombor (6012...)">
                <input
                  className="field__input"
                  value={c.phone}
                  onChange={(e) => {
                    const whatsappContacts = draft.whatsappContacts.map((x, idx) =>
                      idx === i ? { ...x, phone: e.target.value } : x,
                    )
                    update('whatsappContacts', whatsappContacts)
                  }}
                />
              </Field>
            </div>
          ))}
        </section>

        <section className="card settings__card">
          <h2>Aturcara</h2>
          {draft.programme.map((block, i) => (
            <div key={block.id} className="settings__programme">
              <Field label="Slot masa">
                <input
                  className="field__input"
                  value={block.time}
                  onChange={(e) => updateProgramme(i, { time: e.target.value })}
                />
              </Field>
              <Field label="Item (satu baris setiap item)">
                <textarea
                  className="field__input field__textarea"
                  rows={3}
                  value={block.items.join('\n')}
                  onChange={(e) =>
                    updateProgramme(i, {
                      items: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </Field>
            </div>
          ))}
        </section>

        <FolderImagesPanel
          title="Galeri"
          folder="gallery"
          multi
          selected={draft.gallery}
          onChange={(paths) => update('gallery', paths)}
          onStatus={setStatus}
        />

        <FolderImagesPanel
          title="Stiker marquee"
          folder="stickers"
          multi
          accept="image/png,image/*"
          keepPng
          selected={draft.stickers}
          onChange={(paths) => update('stickers', paths)}
          onStatus={setStatus}
        />

        <div className="settings__actions">
          <button type="submit" className="btn btn--solid">
            Simpan
          </button>
          <button type="button" className="btn btn--outline" onClick={onReset}>
            Set Semula
          </button>
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => {
              setDraft(structuredClone(defaultConfig))
              setStatus('Draf dikembalikan (belum disimpan).')
            }}
          >
            Muat Lalai
          </button>
        </div>
        {status && <p className="settings__status">{status}</p>}
      </form>
    </div>
  )
}
