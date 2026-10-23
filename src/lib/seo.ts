import type { Product } from '../data'

export const SITE_URL = 'https://babiko.in'
export const DEFAULT_OG_IMAGE = '/og-image.jpg'

export type JsonLdObject = Record<string, unknown>

export type SeoInput = {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'product' | 'article'
  noindex?: boolean
  jsonLd?: JsonLdObject | JsonLdObject[]
}

export function absoluteUrl(value: string) {
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

const ROUTE_JSONLD_ID = 'route-jsonld'

function setRouteJsonLd(data?: JsonLdObject | JsonLdObject[]) {
  document.getElementById(ROUTE_JSONLD_ID)?.remove()
  if (!data) return
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = ROUTE_JSONLD_ID
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export function setSeo({ title, description, path, image = DEFAULT_OG_IMAGE, type = 'website', noindex, jsonLd }: SeoInput) {
  const url = absoluteUrl(path)
  const imageUrl = absoluteUrl(image)

  document.title = title
  document.documentElement.setAttribute('data-seo-path', path)
  setCanonical(url)
  setMeta('name', 'description', description)
  setMeta(
    'name',
    'robots',
    noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  )
  setMeta('property', 'og:type', type)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:image', imageUrl)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', imageUrl)
  setRouteJsonLd(jsonLd)
}

export function productPath(id: string) {
  return `/product/${id}`
}

export function priceValue(price: string) {
  return price.replace(/[^\d.]/g, '')
}

export function productJsonLd(product: Product): JsonLdObject {
  const url = absoluteUrl(productPath(product.id))
  const gallery = product.gallery.length ? product.gallery : [product.image]

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || product.short,
    sku: product.id,
    image: gallery.map(absoluteUrl),
    url,
    brand: { '@type': 'Brand', name: 'Babiko' },
    category: product.category,
    material: product.material,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price: priceValue(product.price),
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'Babiko' }
    }
  }
}

export function itemListJsonLd(name: string, products: Product[], path: string): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: absoluteUrl(productPath(product.id))
    }))
  }
}

export function faqJsonLd(faqs: { question: string; answer: string }[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  }
}
