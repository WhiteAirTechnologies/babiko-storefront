import { useEffect } from 'react'
import { setSeo, type SeoInput } from '../lib/seo'

export default function Seo({ title, description, path, image, type, noindex, jsonLd }: SeoInput) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    setSeo({ title, description, path, image, type, noindex, jsonLd })
  }, [title, description, path, image, type, noindex, jsonLdKey])

  return null
}
