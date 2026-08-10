import { useRef, useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { ContactSheet } from '../components/ContactSheet'
import { Gate } from '../components/Gate'
import { InvitationPage } from '../components/InvitationPage'
import { MusicButton, type MusicButtonHandle } from '../components/MusicButton'
import { getDisplayNames } from '../data/defaultConfig'
import { useSiteConfig } from '../hooks/useSiteConfig'
import { useWishes } from '../hooks/useWishes'

export function HomePage() {
  const { config } = useSiteConfig()
  const { wishes, addWish } = useWishes()
  const [gateGone, setGateGone] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const musicRef = useRef<MusicButtonHandle>(null)

  const names = getDisplayNames(config)

  return (
    <>
      {!gateGone && (
        <Gate
          eventTitle={config.eventTitle}
          names={names}
          jawiTitle={config.jawiTitle}
          onOpen={() => {
            void musicRef.current?.start()
          }}
          onOpened={() => {
            setGateGone(true)
          }}
        />
      )}

      <InvitationPage
        config={config}
        wishes={wishes}
        onAddWish={addWish}
        onOpenContact={() => setContactOpen(true)}
      />

      <BottomNav onContact={() => setContactOpen(true)} />
      <MusicButton ref={musicRef} audioUrl={config.audioUrl} />
      <ContactSheet
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        contacts={config.whatsappContacts}
        config={config}
      />
    </>
  )
}
