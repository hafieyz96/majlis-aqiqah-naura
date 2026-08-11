import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  Cloud,
  FloralCorner,
  ImagePlaceholder,
  JawiTitle,
  LocationPin,
  Ribbon,
  SectionTitle,
  Sparkle,
  Wave,
} from './Decor'
import { Countdown } from './Countdown'
import {
  childDisplayName,
  getActiveChildren,
  getDisplayNames,
} from '../data/defaultConfig'
import type { SiteConfig, Wish } from '../types'
import {
  assetUrl,
  calendarUrl,
  formatRelativeTime,
  mapsUrl,
  wazeUrl,
} from '../utils/images'

interface InvitationPageProps {
  config: SiteConfig
  wishes: Wish[]
  onAddWish: (name: string, message: string) => void
  onOpenContact: () => void
}

function PhotoOrPlaceholder({
  src,
  alt,
  initial,
  priority = false,
}: {
  src: string
  alt: string
  initial: string
  priority?: boolean
}) {
  if (src) {
    return (
      <img
        src={assetUrl(src)}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    )
  }
  return <ImagePlaceholder label={initial || 'Muat naik foto'} />
}

export function InvitationPage({
  config,
  wishes,
  onAddWish,
  onOpenContact,
}: InvitationPageProps) {
  const children = getActiveChildren(config)
  const names = getDisplayNames(config)
  const [wishName, setWishName] = useState('')
  const [wishMessage, setWishMessage] = useState('')
  const [wishError, setWishError] = useState('')
  const [wishSuccess, setWishSuccess] = useState(false)

  const fullAddress = [config.addressLine1, config.addressLine2].filter(Boolean).join(', ')

  const submitWish = (e: FormEvent) => {
    e.preventDefault()
    setWishSuccess(false)
    if (!wishName.trim()) {
      setWishError('Sila masukkan nama anda.')
      return
    }
    if (!wishMessage.trim()) {
      setWishError('Sila tulis ucapan atau doa.')
      return
    }
    onAddWish(wishName, wishMessage)
    setWishName('')
    setWishMessage('')
    setWishError('')
    setWishSuccess(true)
  }

  return (
    <main className="page">
      <header className="hero" id="utama">
        <FloralCorner
          filterId="wash-hero-tl"
          className="hero__corner hero__corner--tl"
          variant="light"
        />
        <FloralCorner
          filterId="wash-hero-tr"
          className="hero__corner hero__corner--tr"
          variant="full"
        />
        <Cloud className="hero__cloud hero__cloud--left" />
        <Cloud className="hero__cloud hero__cloud--right" />
        <Sparkle className="hero__sparkle hero__sparkle--1" />
        <Sparkle className="hero__sparkle hero__sparkle--2" />
        <Sparkle className="hero__sparkle hero__sparkle--3" />

        <div className="hero__content">
          <JawiTitle text={config.jawiTitle} className="hero__jawi" />
          <p className="hero__eyebrow">{config.eventTitle}</p>
          <h1 className="hero__names">
            {children.length <= 1 ? (
              <span className="hero__name-script">{names}</span>
            ) : (
              <>
                <span className="hero__name-script">
                  {childDisplayName(children[0])}
                </span>
                <span className="hero__amp" aria-hidden="true">
                  &
                </span>
                <span className="hero__name-script">
                  {childDisplayName(children[1])}
                </span>
              </>
            )}
          </h1>
          <div className="hero__meta">
            <p className="hero__date">
              {config.eventDayName}, {config.eventDateDisplay}
            </p>
            <p className="hero__time">{config.eventTimeDisplay}</p>
          </div>

          {children.length > 0 && (
            <div className="hero__photos">
              {children.slice(0, 2).map((child, i) => (
                <figure
                  key={child.id}
                  className={`hero__photo ${i === 0 ? 'hero__photo--left' : 'hero__photo--right'}`}
                >
                  <div className="hero__photo-frame">
                    <PhotoOrPlaceholder
                      src={child.heroPhoto}
                      alt={child.name}
                      initial={childDisplayName(child).charAt(0)}
                      priority
                    />
                  </div>
                  <figcaption>
                    {childDisplayName(child)}
                    {child.ageLabel ? ` — ${child.ageLabel}` : ''}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>

        <a href="#jemputan" className="hero__scroll" aria-label="Skrol ke bawah">
          <span className="hero__scroll-text">Skrol</span>
          <span className="hero__scroll-chevron" aria-hidden="true" />
        </a>

        {config.stickers.length > 0 && (
          <div className="marquee" aria-hidden="true">
            <div className="marquee__track">
              {[0, 1].map((group) => (
                <div
                  key={group}
                  className={`marquee__group ${group === 1 ? 'marquee__group--clone' : ''}`}
                >
                  {config.stickers.map((src, i) => (
                    <img
                      key={`${group}-${i}`}
                      className="marquee__sticker"
                      src={assetUrl(src)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <Wave className="hero__wave" />
      </header>

      <section className="section invitation" id="jemputan">
        <SectionTitle
          script={config.sectionTitles.invitationScript}
          heading={config.sectionTitles.invitationHeading}
        />
        <div className="card invitation__card">
          <p className="invitation__text">{config.invitationText}</p>
          <p className="invitation__note">{config.invitationNote}</p>
          <div className="hosts">
            <p className="hosts__intro">{config.hosts.intro}</p>
            <p className="hosts__name">{config.hosts.host1}</p>
            {config.hosts.host2 && (
              <>
                <p className="hosts__amp" aria-hidden="true">
                  &
                </p>
                <p className="hosts__name">{config.hosts.host2}</p>
              </>
            )}
            <p className="hosts__suffix">{config.hosts.suffix}</p>
          </div>
        </div>
      </section>

      {children.length > 0 && (
        <section className="section celebration" id="raikan">
          <SectionTitle
            script={config.sectionTitles.celebrationScript}
            heading={config.sectionTitles.celebrationHeading}
          />
          <div className="celebration__grid">
            {children.map((child) => (
              <article key={child.id} className="card celebration__card">
                <div className="celebration__photo">
                  <PhotoOrPlaceholder
                    src={child.cardPhoto || child.heroPhoto}
                    alt={child.name}
                    initial={child.name.charAt(0)}
                  />
                </div>
                <Ribbon className="celebration__ribbon" />
                <h3 className="celebration__name">{child.name}</h3>
                {child.birthDate && (
                  <p className="celebration__birth">{child.birthDate}</p>
                )}
                {child.celebrationLabel && (
                  <p className="celebration__what">{child.celebrationLabel}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="section details" id="majlis">
        <SectionTitle
          script={config.sectionTitles.detailsScript}
          heading={config.sectionTitles.detailsHeading}
        />
        <div className="card details__card">
          <p className="details__day">{config.eventDayName}</p>
          <p className="details__date">{config.eventDateDisplay}</p>
          <p className="details__time">{config.eventTimeDisplay}</p>
          <div className="details__separator" aria-hidden="true" />
          <address className="details__address">
            {config.addressLine1}
            {config.addressLine2 && (
              <>
                <br />
                {config.addressLine2}
              </>
            )}
          </address>
          <div className="details__actions">
            <a
              className="btn btn--outline"
              href={mapsUrl(config.mapsQuery || fullAddress)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">📍</span> Google Maps
            </a>
            <a
              className="btn btn--outline"
              href={wazeUrl(config.wazeQuery || fullAddress)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">🚗</span> Waze
            </a>
            <a
              className="btn btn--outline"
              href={calendarUrl({
                title: `${config.eventTitle} ${names}`,
                startISO: config.eventDateTimeISO,
                endISO: config.eventEndDateTimeISO,
                details: config.invitationNote,
                location: fullAddress,
              })}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">🗓️</span> Simpan Tarikh
            </a>
            <button type="button" className="btn btn--outline" onClick={onOpenContact}>
              <span aria-hidden="true">💬</span> Hubungi Tuan Rumah
            </button>
          </div>
        </div>
        <Countdown targetISO={config.eventDateTimeISO} />
      </section>

      <section className="section programme" id="aturcara">
        <SectionTitle
          script={config.sectionTitles.programmeScript}
          heading={config.sectionTitles.programmeHeading}
        />
        <ol className="programme__list">
          {config.programme.map((block) => (
            <li key={block.id} className="programme__slot">
              <span className="programme__dot" aria-hidden="true" />
              <p className="programme__time">{block.time}</p>
              <ul className="programme__items">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="section location" id="lokasi">
        <SectionTitle
          script={config.sectionTitles.locationScript}
          heading={config.sectionTitles.locationHeading}
        />
        <div className="card location__card">
          <div className="location__icon" aria-hidden="true">
            <LocationPin />
          </div>
          <address className="location__address">
            {config.addressLine1}
            {config.addressLine2 && (
              <>
                <br />
                {config.addressLine2}
              </>
            )}
          </address>
          <div className="location__actions">
            <a
              className="btn btn--solid"
              href={mapsUrl(config.mapsQuery || fullAddress)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Maps
            </a>
            <a
              className="btn btn--outline"
              href={wazeUrl(config.wazeQuery || fullAddress)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Waze
            </a>
          </div>
        </div>
      </section>

      <section className="section gallery" id="galeri">
        <SectionTitle
          script={config.sectionTitles.galleryScript}
          heading={config.sectionTitles.galleryHeading}
        />
        <div className="gallery__grid">
          {config.gallery.length === 0 ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="gallery__item">
                <ImagePlaceholder label="Muat naik foto" />
              </div>
            ))
          ) : (
            config.gallery.map((src, i) => (
              <div key={i} className="gallery__item">
                <img
                  src={assetUrl(src)}
                  alt={`Galeri ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section wishes" id="ucapan">
        <FloralCorner
          filterId="wash-wishes-l"
          className="wishes__corner wishes__corner--l"
          variant="light"
        />
        <FloralCorner
          filterId="wash-wishes-r"
          className="wishes__corner wishes__corner--r"
          variant="light"
        />
        <SectionTitle
          script={config.sectionTitles.wishesScript}
          heading={config.sectionTitles.wishesHeading}
        />
        <p className="wishes__intro">{config.wishesIntro}</p>
        <form className="card wish-form" onSubmit={submitWish} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="wish-name">
              Nama
            </label>
            <input
              id="wish-name"
              className={`field__input ${wishError && !wishName.trim() ? 'field__input--error' : ''}`}
              type="text"
              name="name"
              autoComplete="name"
              maxLength={100}
              placeholder="Nama anda"
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="wish-message">
              Ucapan atau Doa
            </label>
            <textarea
              id="wish-message"
              className={`field__input field__textarea ${wishError && !wishMessage.trim() ? 'field__input--error' : ''}`}
              name="message"
              rows={4}
              placeholder="Tulis ucapan atau doa anda di sini..."
              value={wishMessage}
              onChange={(e) => setWishMessage(e.target.value)}
            />
          </div>
          {wishError && (
            <p className="field__error" role="alert">
              <span className="field__error-icon" aria-hidden="true">
                ✦
              </span>
              {wishError}
            </p>
          )}
          {wishSuccess && (
            <p className="wish-form__success">Terima kasih! Ucapan anda telah disimpan.</p>
          )}
          <button type="submit" className="btn btn--solid wish-form__submit">
            Hantar Ucapan
          </button>
        </form>

        <div className="wishbook">
          <h3 className="wishbook__heading">Ucapan &amp; Doa</h3>
          {wishes.length === 0 ? (
            <p className="wishes__empty">Belum ada ucapan. Jadilah yang pertama!</p>
          ) : (
            <ul className="wishes__list">
              {wishes.map((w) => (
                <li key={w.id} className="wishes__card">
                  <span className="wishes__quote" aria-hidden="true">
                    ❝
                  </span>
                  <p className="wishes__message">{w.message}</p>
                  <p className="wishes__name">{w.name}</p>
                  <p className="wishes__date">{formatRelativeTime(w.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="section doa" id="doa">
        <SectionTitle
          script={config.sectionTitles.doaScript}
          heading={config.sectionTitles.doaHeading}
        />
        <div className="card doa__card">
          <span className="doa__quote" aria-hidden="true">
            ❝
          </span>
          <p className="doa__text">{config.doaText}</p>
        </div>
      </section>

      <section className="section closing" id="hubungi">
        <FloralCorner
          filterId="wash-closing-bl"
          className="closing__corner closing__corner--l"
          variant="full"
        />
        <FloralCorner
          filterId="wash-closing-br"
          className="closing__corner closing__corner--r"
          variant="full"
        />
        <p className="closing__thanks">{config.closingThanks}</p>
        <p className="closing__host">Daripada kami sekeluarga</p>
        <button type="button" className="btn btn--solid closing__contact" onClick={onOpenContact}>
          <span aria-hidden="true">💬</span> Hubungi Tuan Rumah
        </button>
        <p className="closing__names">{names}</p>
        <p className="closing__date">
          {config.eventDayName} · {config.eventDateDisplay}
        </p>
        <Link to="/settings" className="closing__settings" aria-label="Tetapan">
          ⚙
        </Link>
      </section>
    </main>
  )
}
