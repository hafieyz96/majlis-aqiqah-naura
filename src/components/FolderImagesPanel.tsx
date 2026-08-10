import { useCallback, useEffect, useState } from 'react'
import { assetUrl, fileToUploadPayload } from '../utils/images'
import {
  createImageFolder,
  deleteImageFile,
  fetchImageLibrary,
  type ImageLibrary,
  uploadImageToFolder,
} from '../utils/imageLibrary'

type Props = {
  title: string
  folder: string
  selected: string[]
  multi: boolean
  onChange: (paths: string[]) => void
  accept?: string
  keepPng?: boolean
  onStatus?: (msg: string) => void
}

export function FolderImagesPanel({
  title,
  folder,
  selected,
  multi,
  onChange,
  accept = 'image/*',
  keepPng = false,
  onStatus,
}: Props) {
  const [library, setLibrary] = useState<ImageLibrary | null>(null)
  const [newFolder, setNewFolder] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    const lib = await fetchImageLibrary()
    setLibrary(lib)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const folderFiles = library?.files[folder] ?? []
  const writable = library?.writable ?? false

  const toggleSelect = (path: string) => {
    if (multi) {
      if (selected.includes(path)) onChange(selected.filter((p) => p !== path))
      else onChange([...selected, path])
    } else {
      onChange(selected[0] === path ? [] : [path])
    }
  }

  const onUpload = async (files: FileList | null) => {
    if (!files?.length) return
    if (!writable) {
      onStatus?.(
        'Upload folder hanya semasa npm run dev di PC, kemudian commit/push.',
      )
      return
    }
    setBusy(true)
    try {
      const uploaded: string[] = []
      for (const file of [...files]) {
        const payload = await fileToUploadPayload(file, {
          keepPng,
          maxWidth: keepPng ? 600 : 1400,
        })
        const result = await uploadImageToFolder({
          folder,
          filename: payload.filename,
          dataBase64: payload.dataBase64,
        })
        uploaded.push(result.path)
        setLibrary({
          writable: true,
          folders: Object.keys(result.files).sort(),
          files: result.files,
        })
      }
      if (multi) onChange([...selected, ...uploaded])
      else onChange(uploaded.slice(-1))
      onStatus?.(`Disimpan ke public/images/${folder}/`)
    } catch (err) {
      onStatus?.(err instanceof Error ? err.message : 'Gagal muat naik')
    } finally {
      setBusy(false)
    }
  }

  const onCreateFolder = async () => {
    const name = newFolder.trim().replace(/^\/+|\/+$/g, '')
    if (!name) return
    if (!writable) {
      onStatus?.(
        'Cipta folder hanya semasa npm run dev di PC, kemudian commit/push.',
      )
      return
    }
    setBusy(true)
    try {
      const target = name.includes('/') ? name : `${folder}/${name}`
      const result = await createImageFolder(target)
      setLibrary({
        writable: true,
        folders: Object.keys(result.files).sort(),
        files: result.files,
      })
      setNewFolder('')
      onStatus?.(`Folder dicipta: public/images/${target}/`)
    } catch (err) {
      onStatus?.(err instanceof Error ? err.message : 'Gagal cipta folder')
    } finally {
      setBusy(false)
    }
  }

  const onDelete = async (path: string) => {
    if (!writable) {
      onStatus?.('Padam fail hanya semasa npm run dev di PC.')
      return
    }
    if (!confirm(`Padam fail ini dari folder?\n${path}`)) return
    setBusy(true)
    try {
      const result = await deleteImageFile(path)
      setLibrary({
        writable: true,
        folders: Object.keys(result.files).sort(),
        files: result.files,
      })
      onChange(selected.filter((p) => p !== path))
      onStatus?.('Fail dipadam dari folder.')
    } catch (err) {
      onStatus?.(err instanceof Error ? err.message : 'Gagal padam')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card settings__card">
      <div className="settings__card-head">
        <h2>{title}</h2>
        <span className="settings__folder-tag">/{folder}</span>
      </div>

      {!writable && (
        <p className="settings__hint">
          Mode baca sahaja (GitHub Pages). Untuk upload/cipta folder, jalankan{' '}
          <code>npm run dev</code> di PC, kemudian push ke GitHub.
        </p>
      )}

      <div className="settings__folder-actions">
        <label className="btn btn--outline settings__file-btn">
          {busy ? 'Memproses…' : 'Muat naik ke folder'}
          <input
            type="file"
            accept={accept}
            multiple={multi}
            disabled={busy || !writable}
            hidden
            onChange={(e) => {
              void onUpload(e.target.files)
              e.target.value = ''
            }}
          />
        </label>
        <div className="settings__mkdir">
          <input
            className="field__input"
            placeholder={`Subfolder dalam ${folder}/`}
            value={newFolder}
            disabled={!writable || busy}
            onChange={(e) => setNewFolder(e.target.value)}
          />
          <button
            type="button"
            className="btn btn--outline"
            disabled={!writable || busy || !newFolder.trim()}
            onClick={() => void onCreateFolder()}
          >
            Cipta folder
          </button>
        </div>
      </div>

      <p className="settings__hint">
        Klik gambar untuk {multi ? 'pilih/nyahpilih dalam config' : 'pilih sebagai foto aktif'}.
      </p>

      <div className="settings__thumbs">
        {folderFiles.length === 0 && (
          <p className="settings__hint">Folder ini masih kosong.</p>
        )}
        {folderFiles.map((src) => {
          const active = selected.includes(src)
          return (
            <div
              key={src}
              className={`settings__thumb-wrap ${active ? 'settings__thumb-wrap--active' : ''}`}
            >
              <button
                type="button"
                className="settings__thumb-btn"
                onClick={() => toggleSelect(src)}
                title={src}
              >
                <img className="settings__thumb" src={assetUrl(src)} alt="" />
              </button>
              <div className="settings__thumb-meta">
                <span>{src.split('/').pop()}</span>
                {writable && (
                  <button
                    type="button"
                    className="settings__remove"
                    onClick={() => void onDelete(src)}
                  >
                    Padam fail
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selected.length > 0 && (
        <p className="settings__hint">
          Dipilih dalam jemputan: {selected.map((s) => s.split('/').pop()).join(', ')}
        </p>
      )}
    </section>
  )
}
