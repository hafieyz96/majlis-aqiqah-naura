export interface Child {
  id: string
  name: string
  /** Paparan pendek (cth. hero) — jika kosong, guna `name`. */
  shortName: string
  enabled: boolean
  birthDate: string
  celebrationLabel: string
  ageLabel: string
  heroPhoto: string
  cardPhoto: string
}

export interface ProgrammeBlock {
  id: string
  time: string
  items: string[]
}

export interface Hosts {
  intro: string
  host1: string
  host2: string
  suffix: string
}

export interface ContactPerson {
  name: string
  phone: string
}

export interface SiteConfig {
  eventTitle: string
  jawiTitle: string
  invitationText: string
  invitationNote: string
  hosts: Hosts
  children: Child[]
  eventDayName: string
  eventDateDisplay: string
  eventTimeDisplay: string
  eventDateTimeISO: string
  eventEndDateTimeISO: string
  addressLine1: string
  addressLine2: string
  mapsQuery: string
  wazeQuery: string
  whatsappContacts: ContactPerson[]
  programme: ProgrammeBlock[]
  gallery: string[]
  stickers: string[]
  audioUrl: string
  doaText: string
  closingThanks: string
  wishesIntro: string
  sectionTitles: {
    invitationScript: string
    invitationHeading: string
    celebrationScript: string
    celebrationHeading: string
    detailsScript: string
    detailsHeading: string
    programmeScript: string
    programmeHeading: string
    locationScript: string
    locationHeading: string
    galleryScript: string
    galleryHeading: string
    wishesScript: string
    wishesHeading: string
    doaScript: string
    doaHeading: string
  }
}

export interface Wish {
  id: string
  name: string
  message: string
  createdAt: string
}
