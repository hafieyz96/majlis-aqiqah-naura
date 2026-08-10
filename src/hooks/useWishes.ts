import { useCallback, useState } from 'react'
import type { Wish } from '../types'

const STORAGE_KEY = 'majlis-aqiqah-wishes'

function loadWishes(): Wish[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Wish[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useWishes() {
  const [wishes, setWishes] = useState<Wish[]>(() => loadWishes())

  const addWish = useCallback((name: string, message: string) => {
    const wish: Wish = {
      id: crypto.randomUUID(),
      name: name.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    }
    setWishes((prev) => {
      const next = [wish, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
    return wish
  }, [])

  const clearWishes = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setWishes([])
  }, [])

  return { wishes, addWish, clearWishes }
}
