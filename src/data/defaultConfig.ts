import type { SiteConfig } from '../types'

export const defaultConfig: SiteConfig = {
  eventTitle: 'Majlis Aqiqah & Sambutan Hari Lahir',
  jawiTitle: 'عقيقة',
  invitationText:
    'Dengan penuh kesyukuran ke hadrat Allah SWT, kami sekeluarga dengan sukacitanya menjemput Dato’/Datin/Tuan/Puan/Encik/Cik sekeluarga ke Majlis Aqiqah serta Sambutan Hari Lahir Naura Binti Muhammad Hafiz.',
  invitationNote: 'Kehadiran dan doa daripada anda sekeluarga amat kami hargai.',
  hosts: {
    intro: 'Daripada Kami,',
    host1: 'Muhammad Hafiz Bin Nor Sahaidi',
    host2: 'Natasha Binti Sakimin',
    suffix: 'sekeluarga.',
  },
  children: [
    {
      id: 'child-1',
      name: 'Naura Binti Muhammad Hafiz',
      shortName: 'Naura',
      enabled: true,
      birthDate: '',
      celebrationLabel: 'Majlis Aqiqah & Sambutan Hari Lahir',
      ageLabel: '',
      heroPhoto: '/images/hero/hero-01.jpg',
      cardPhoto: '/images/card/card-01.jpg',
    },
    {
      id: 'child-2',
      name: '',
      shortName: '',
      enabled: false,
      birthDate: '',
      celebrationLabel: '',
      ageLabel: '',
      heroPhoto: '',
      cardPhoto: '',
    },
  ],
  eventDayName: 'Sabtu',
  eventDateDisplay: '3 Oktober 2026',
  eventTimeDisplay: '11.00 Pagi – 3.00 Petang',
  eventDateTimeISO: '2026-10-03T11:00:00+08:00',
  eventEndDateTimeISO: '2026-10-03T15:00:00+08:00',
  addressLine1: 'No 9 Jln Tg Bidara 30/29A',
  addressLine2: 'Kg Jln Kebun',
  mapsQuery: 'https://maps.app.goo.gl/rSBUNrUMz2hgPWBw5?g_st=ic',
  wazeQuery: 'No 9 Jln Tg Bidara 30/29A Kg Jln Kebun',
  whatsappContacts: [
    { name: 'Hafiz', phone: '60177136631' },
  ],
  programme: [
    {
      id: 'prog-1',
      time: '11.00 pagi – 1.00 petang',
      items: ['Berzanji', 'Majlis Berselawat', 'Bacaan Yasin', 'Tahlil', 'Doa Selamat'],
    },
    {
      id: 'prog-2',
      time: '1.00 petang – 3.00 petang',
      items: ['Sambutan Hari Lahir', 'Potong Kek', 'Sesi Bergambar', 'Jamuan Makan'],
    },
    {
      id: 'prog-3',
      time: '3.00 petang',
      items: ['Majlis Bersurai'],
    },
  ],
  gallery: [
    '/images/gallery/gallery-01.jpg',
    '/images/gallery/gallery-02.jpg',
    '/images/gallery/gallery-03.jpg',
    '/images/gallery/gallery-04.jpg',
    '/images/gallery/gallery-05.jpg',
    '/images/gallery/gallery-06.jpg',
    '/images/gallery/gallery-07.jpg',
    '/images/gallery/gallery-08.jpg',
    '/images/gallery/gallery-09.jpg',
    '/images/gallery/gallery-10.jpg',
    '/images/gallery/gallery-11.jpg',
    '/images/gallery/gallery-12.jpg',
    '/images/gallery/gallery-13.jpg',
    '/images/gallery/gallery-14.jpg',
    '/images/gallery/gallery-15.jpg',
    '/images/gallery/gallery-16.jpg',
    '/images/gallery/gallery-17.jpg',
    '/images/gallery/gallery-18.jpg',
    '/images/gallery/gallery-19.jpg',
    '/images/gallery/gallery-20.jpg',
  ],
  stickers: [
    '/images/stickers/sticker-01.jpg',
    '/images/stickers/sticker-02.jpg',
    '/images/stickers/sticker-03.jpg',
    '/images/stickers/sticker-04.jpg',
    '/images/stickers/sticker-05.jpg',
    '/images/stickers/sticker-06.jpg',
  ],
  // Path is resolved with Vite base (/majlis-aqiqah-naura/) via assetUrl()
  audioUrl: '/audio/selawat.mp3',
  doaText:
    'Ya Allah, jadikanlah anak-anak kami anak yang solehah, dikurniakan kesihatan, dipanjangkan usia dalam kebaikan dan sentiasa berada dalam rahmat serta perlindungan-Mu.',
  closingThanks: 'Terima kasih atas doa, kehadiran dan ingatan daripada anda sekeluarga.',
  wishesIntro: 'Tinggalkan sedikit ucapan atau doa buat Naura.',
  sectionTitles: {
    invitationScript: 'Dengan Sukacitanya',
    invitationHeading: 'Kami Menjemput Anda',
    celebrationScript: 'Buah Hati Kami',
    celebrationHeading: 'Yang Diraikan',
    detailsScript: 'Butiran Majlis',
    detailsHeading: 'Tarikh & Tempat',
    programmeScript: 'Susunan Acara',
    programmeHeading: 'Aturcara Majlis',
    locationScript: 'Menanti Kehadiran Anda',
    locationHeading: 'Lokasi Majlis',
    galleryScript: 'Detik Manis',
    galleryHeading: 'Galeri',
    wishesScript: 'Titipan Doa & Ucapan',
    wishesHeading: 'Ucapan Tetamu',
    doaScript: 'Amin Ya Rabbal Alamin',
    doaHeading: 'Doa',
  },
}

export function getActiveChildren(config: SiteConfig) {
  return config.children.filter((c) => c.enabled && c.name.trim())
}

export function childDisplayName(child: { name: string; shortName?: string }) {
  return child.shortName?.trim() || child.name
}

export function getDisplayNames(config: SiteConfig) {
  const active = getActiveChildren(config)
  if (active.length === 0) return 'Naura'
  if (active.length === 1) return childDisplayName(active[0])
  return `${childDisplayName(active[0])} & ${childDisplayName(active[1])}`
}
