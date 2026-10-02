import sanityClient from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || ''
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

export const client = sanityClient({
  projectId,
  dataset,
  apiVersion: '2024-09-01',
  useCdn: true,
  token: import.meta.env.VITE_SANITY_TOKEN || undefined
})

export async function fetchProducts() {
  if (!projectId) return []
  const query = `*[_type == "product"]{ _id, name, price, originalPrice, age, ageBand, collection, category, short, "image": coalesce(image.asset->url, imageUrl), "gallery": gallery[].asset->url, "galleryUrls": galleryUrls, tag, material, benefits, includes, dimensions, description, care, occasion, itemCount, bestSeller, "aplus": aplus[].asset->url, "aplusUrls": aplusUrls, "reviews": reviews[]{ quote, name, detail, rating }, amazonUrl }`
  return client.fetch(query)
}

export async function fetchSiteImages() {
  if (!projectId) return []
  const query = `*[_type == "siteImage"]{ key, "image": coalesce(image.asset->url, url) }`
  return client.fetch(query)
}

export default client
