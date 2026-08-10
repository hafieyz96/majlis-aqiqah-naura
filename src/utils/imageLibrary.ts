import { assetUrl } from './images'

export type ImageLibrary = {
  writable: boolean
  folders: string[]
  files: Record<string, string[]>
}

export async function fetchImageLibrary(): Promise<ImageLibrary> {
  try {
    const res = await fetch('/api/images')
    if (res.ok) {
      return (await res.json()) as ImageLibrary
    }
  } catch {
    // fall through to static manifest (GitHub Pages)
  }

  try {
    const res = await fetch(assetUrl('/images/manifest.json'))
    if (res.ok) {
      const data = (await res.json()) as {
        folders?: string[]
        files?: Record<string, string[]>
        hero?: string[]
        card?: string[]
        gallery?: string[]
        stickers?: string[]
      }
      const files =
        data.files ??
        ({
          hero: data.hero ?? [],
          card: data.card ?? [],
          gallery: data.gallery ?? [],
          stickers: data.stickers ?? [],
        } satisfies Record<string, string[]>)
      return {
        writable: false,
        folders: data.folders ?? Object.keys(files).sort(),
        files,
      }
    }
  } catch {
    // ignore
  }

  return { writable: false, folders: ['hero', 'card', 'gallery', 'stickers'], files: {} }
}

export async function createImageFolder(folder: string) {
  const res = await fetch('/api/images/mkdir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Gagal cipta folder')
  return data as { files: Record<string, string[]> }
}

export async function uploadImageToFolder(opts: {
  folder: string
  filename: string
  dataBase64: string
}) {
  const res = await fetch('/api/images/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Gagal muat naik')
  return data as { path: string; files: Record<string, string[]> }
}

export async function deleteImageFile(publicPath: string) {
  const res = await fetch('/api/images', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: publicPath }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Gagal padam')
  return data as { files: Record<string, string[]> }
}
