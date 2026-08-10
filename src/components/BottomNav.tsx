interface BottomNavProps {
  onContact: () => void
}

const items = [
  { href: '#utama', icon: '🏠', label: 'Utama' },
  { href: '#aturcara', icon: '🎀', label: 'Majlis' },
  { href: '#lokasi', icon: '📍', label: 'Lokasi' },
  { href: '#ucapan', icon: '💌', label: 'Ucapan' },
] as const

export function BottomNav({ onContact }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navigasi jemputan">
      {items.map((item) => (
        <a key={item.href} href={item.href} className="bottom-nav__item">
          <span className="bottom-nav__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="bottom-nav__label">{item.label}</span>
        </a>
      ))}
      <button type="button" className="bottom-nav__item" onClick={onContact}>
        <span className="bottom-nav__icon" aria-hidden="true">
          💬
        </span>
        <span className="bottom-nav__label">Hubungi</span>
      </button>
    </nav>
  )
}
