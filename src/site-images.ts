import { useSyncExternalStore } from 'react'
import { fetchSiteImages } from './sanity/client'

export const defaultSiteImages: Record<string, string> = {
  hero: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1500&q=90',
  feature: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1500&q=85',
  about: 'https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=1600&q=85',
  'growth-kit': 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1400&q=85',
  'gift-set': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1400&q=85',
  age: 'https://images.unsplash.com/photo-1560961911-ba7ef651a56c?auto=format&fit=crop&w=1400&q=85',
  kit: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=85',
  gift: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=85',
  blocks: 'https://images.unsplash.com/photo-1560961911-ba7ef651a56c?auto=format&fit=crop&w=1200&q=85',
  sensory: 'https://images.unsplash.com/photo-1599623560574-39d485900c95?auto=format&fit=crop&w=1200&q=85',
  forms: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=1200&q=85',
  balance: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=1200&q=85',
  detail: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=1200&q=85',
  play: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=85'
}

let cache: Record<string, string> = { ...defaultSiteImages }
const listeners = new Set<() => void>()

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export function getSiteImages() {
  return cache
}

export function siteImage(key: string) {
  return cache[key] || defaultSiteImages[key] || ''
}

let pending: Promise<Record<string, string>> | null = null

export function loadSiteImages(): Promise<Record<string, string>> {
  if (pending) return pending
  pending = fetchSiteImages()
    .then(rows => {
      if (rows && rows.length) {
        const next = { ...cache }
        for (const row of rows) {
          const key = typeof row?.key === 'string' ? row.key.trim() : ''
          if (key && row?.image) next[key] = row.image
        }
        cache = next
        listeners.forEach(listener => listener())
      }
      return cache
    })
    .catch(() => cache)
  return pending
}

export function useSiteImages(): Record<string, string> {
  return useSyncExternalStore(subscribe, getSiteImages)
}
