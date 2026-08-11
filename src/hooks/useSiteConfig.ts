import { useCallback, useState } from 'react'
import { defaultConfig } from '../data/defaultConfig'
import type { SiteConfig } from '../types'

const STORAGE_KEY = 'majlis-aqiqah-config-v8'

function loadConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(defaultConfig)
    const parsed = JSON.parse(raw) as Partial<SiteConfig>
    return {
      ...structuredClone(defaultConfig),
      ...parsed,
      hosts: { ...defaultConfig.hosts, ...parsed.hosts },
      sectionTitles: { ...defaultConfig.sectionTitles, ...parsed.sectionTitles },
      children: parsed.children?.length
        ? parsed.children
        : structuredClone(defaultConfig.children),
      programme: parsed.programme?.length
        ? parsed.programme
        : structuredClone(defaultConfig.programme),
      whatsappContacts: parsed.whatsappContacts?.length
        ? parsed.whatsappContacts
        : structuredClone(defaultConfig.whatsappContacts),
      gallery: parsed.gallery ?? [],
      stickers: parsed.stickers ?? [],
    }
  } catch {
    return structuredClone(defaultConfig)
  }
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(() => loadConfig())

  const saveConfig = useCallback((next: SiteConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setConfig(next)
  }, [])

  const resetConfig = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    const fresh = structuredClone(defaultConfig)
    setConfig(fresh)
    return fresh
  }, [])

  const reload = useCallback(() => {
    setConfig(loadConfig())
  }, [])

  return { config, saveConfig, resetConfig, reload }
}
