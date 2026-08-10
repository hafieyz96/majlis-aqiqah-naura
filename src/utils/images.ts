function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Gagal memuatkan imej'))
    }
    img.src = url
  })
}

/** Resolve public asset path with Vite base (GitHub Pages subpath). */
export function assetUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('data:') || /^https?:\/\//i.test(path)) return path
  const base = import.meta.env.BASE_URL || '/'
  const clean = path.replace(/^\//, '')
  return `${base}${clean}`
}

/** Compress/resize image to maxWidth JPEG (quality 0.8). Stickers keep PNG. */
export async function fileToDataUrl(
  file: File,
  options: { maxWidth?: number; quality?: number; keepPng?: boolean } = {},
): Promise<string> {
  const { maxWidth = 1200, quality = 0.8, keepPng = false } = options
  const img = await loadImage(file)
  const scale = Math.min(1, maxWidth / img.width)
  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas tidak disokong')
  ctx.drawImage(img, 0, 0, width, height)

  if (keepPng || file.type === 'image/png') {
    return canvas.toDataURL('image/png')
  }
  return canvas.toDataURL('image/jpeg', quality)
}

export async function fileToUploadPayload(
  file: File,
  options: { maxWidth?: number; quality?: number; keepPng?: boolean } = {},
): Promise<{ dataBase64: string; mimeType: string; filename: string }> {
  const dataUrl = await fileToDataUrl(file, options)
  const [, dataBase64 = ''] = dataUrl.split(',')
  const mimeType = dataUrl.match(/data:([^;]+)/)?.[1] ?? file.type ?? 'image/jpeg'
  const ext = mimeType.includes('png') ? 'png' : 'jpg'
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'upload'
  const safe =
    baseName.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'upload'
  return { dataBase64, mimeType, filename: `${safe}.${ext}` }
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diffSec = Math.max(0, Math.floor((now - then) / 1000))
  if (diffSec < 60) return 'Baru sahaja'
  const mins = Math.floor(diffSec / 60)
  if (mins < 60) return `${mins} minit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  return new Date(iso).toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function mapsUrl(query: string) {
  const trimmed = query.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`
}

export function wazeUrl(query: string) {
  return `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`
}

export function calendarUrl(opts: {
  title: string
  startISO: string
  endISO: string
  details: string
  location: string
}) {
  const toGCal = (iso: string) =>
    new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${toGCal(opts.startISO)}/${toGCal(opts.endISO)}`,
    details: opts.details,
    location: opts.location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function whatsappUrl(phone: string, message: string) {
  const cleaned = phone.replace(/\D/g, '')
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`
}
