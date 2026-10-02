import { siteImage, loadSiteImages } from './site-images'

export type Collection = 'growth-kit' | 'gift-set' | 'individual-toy'
export type AgeBand = '0-3' | '3-6' | '6-12' | '12-plus'

export type Review = { quote: string; name: string; detail: string; rating?: number }

export type Product = {
  id: string; name: string; price: string; originalPrice?: string; age: string; ageBand: AgeBand; collection: Collection; category: string
  short: string; image: string; gallery: string[]; tag?: string; material: string; benefits: string[]; includes: string[]
  dimensions: string; description: string; care: string; occasion?: string; itemCount?: number; bestSeller?: boolean; amazonUrl: string
  aplus?: string[]; reviews?: Review[]
}

const gallery = (image: string) => [image, siteImage('detail'), siteImage('play')]
const shared = { material: 'Solid beech wood · water-based finish', care: 'Wipe with a soft, damp cloth. Do not soak. Allow to air dry fully before storing.', amazonUrl: 'https://www.amazon.in/' }

export const products: Product[] = [
  { id: 'first-steps', name: 'First Steps in Learning Kit', price: '₹1,699', originalPrice: '₹2,099', age: '0–3 months', ageBand: '0-3', collection: 'growth-kit', category: 'Growth Kit', short: 'A gentle first introduction to sight, sound and touch.', image: siteImage('kit'), gallery: gallery(siteImage('kit')), aplus: [siteImage('detail'), siteImage('play')], tag: 'Bestseller', bestSeller: true, benefits: ['Visual tracking', 'Early sensory exploration', 'Tummy-time confidence'], includes: ['High-contrast vision cards', 'Soft sensory cloth book', 'Wooden grasping ring', 'Parent play guide'], dimensions: 'Gift box: 32 × 24 × 8 cm', description: 'A considered beginning for the earliest days of discovery. This stage-led box offers calm, simple invitations to notice, reach and connect.', itemCount: 4, ...shared },
  { id: 'hands-on', name: 'Hands-On Learning Kit', price: '₹1,999', originalPrice: '₹2,499', age: '3–6 months', ageBand: '3-6', collection: 'growth-kit', category: 'Growth Kit', short: 'Thoughtful textures and gentle challenges for newly curious hands.', image: siteImage('sensory'), gallery: gallery(siteImage('sensory')), aplus: [siteImage('sensory'), siteImage('detail')], benefits: ['Hand–eye coordination', 'Tactile exploration', 'Cause and effect'], includes: ['Textured sensory cards', 'Wooden rattle', 'Rolling drum', 'Parent play guide'], dimensions: 'Gift box: 32 × 24 × 8 cm', description: 'For babies becoming more aware of the world around them. Every object encourages reaching, grasping and the small thrill of making something happen.', itemCount: 4, ...shared },
  { id: 'explore-grow', name: 'Explore & Grow Kit', price: '₹2,399', originalPrice: '₹2,899', age: '6–12 months', ageBand: '6-12', collection: 'growth-kit', category: 'Growth Kit', short: 'Open-ended materials for the months of movement, mastery and wonder.', image: siteImage('blocks'), gallery: gallery(siteImage('blocks')), aplus: [siteImage('blocks'), siteImage('detail')], tag: 'Bestseller', bestSeller: true, benefits: ['Fine motor control', 'Object permanence', 'Problem solving'], includes: ['Wooden shape puzzle', 'Push-and-pull car', 'Stacking discs', 'Object permanence box', 'Parent play guide'], dimensions: 'Gift box: 36 × 28 × 9 cm', description: 'A joyful collection for growing independence. As babies sit, crawl and begin to explore on their own terms, these pieces offer just enough challenge.', itemCount: 5, ...shared },
  { id: 'newborn-gift', name: 'Newborn Rattle & Teether Set', price: '₹499', originalPrice: '₹699', age: '0–3 months', ageBand: '0-3', collection: 'gift-set', category: 'Gift Set', short: 'A beautifully useful welcome for the very first days.', image: siteImage('gift'), gallery: gallery(siteImage('gift')), tag: 'Bestseller', bestSeller: true, occasion: 'New baby · baby shower', benefits: ['Soothing sensory play', 'Early grasping', 'Gentle teething support'], includes: ['Natural wood rattle', 'Beechwood teether', 'Reusable Babiko gift box'], dimensions: 'Gift box: 20 × 16 × 6 cm', description: 'A small, meaningful gift for a new arrival. Quietly beautiful, tactile and designed to become part of the everyday rhythm of early care.', itemCount: 3, ...shared },
  { id: 'wooden-rattles', name: 'Wooden Rattles Collection', price: '₹499', originalPrice: '₹650', age: '0–12 months', ageBand: '0-3', collection: 'gift-set', category: 'Gift Set', short: 'Three gentle sounds for little hands beginning to explore.', image: siteImage('detail'), gallery: gallery(siteImage('detail')), occasion: 'New baby · first milestone', benefits: ['Auditory discovery', 'Hand–eye coordination', 'Grasping'], includes: ['3 wooden rattles', 'Reusable Babiko gift box'], dimensions: 'Gift box: 22 × 18 × 6 cm', description: 'A set of three soft-sounding rattles, designed with differently shaped grips for tiny hands at different stages of discovery.', itemCount: 3, ...shared },
  { id: 'discovery-arc', name: 'The Discovery Arc', price: '₹1,890', originalPrice: '₹2,290', age: '6–12 months', ageBand: '6-12', collection: 'individual-toy', category: 'Sensory Play', short: 'A gentle invitation to reach, grasp and wonder.', image: siteImage('sensory'), gallery: gallery(siteImage('sensory')), tag: 'Bestseller', bestSeller: true, benefits: ['Hand–eye coordination', 'Cause and effect', 'Early sensory exploration'], includes: ['1 wooden discovery arc', '3 hanging sensory shapes', 'A cotton drawstring storage bag'], dimensions: '38 × 21 × 12 cm', description: 'A beautifully simple first activity toy for the months of reaching, grasping and noticing. Each softly shaped element offers a new invitation.', ...shared },
  { id: 'first-forms', name: 'First Forms', price: '₹1,490', originalPrice: '₹1,990', age: '12+ months', ageBand: '12-plus', collection: 'individual-toy', category: 'Early Learning', short: 'Seven considered shapes for small hands and growing minds.', image: siteImage('forms'), gallery: gallery(siteImage('forms')), benefits: ['Shape recognition', 'Problem solving', 'Fine motor control'], includes: ['1 wooden sorting board', '7 tactile shape pieces', 'A cotton drawstring storage bag'], dimensions: '27 × 19 × 3 cm', description: 'Seven familiar forms, sized for small hands. The quiet satisfaction of placing, turning and trying again makes this a gentle introduction to problem solving.', ...shared },
  { id: 'balance-garden', name: 'The Balance Garden', price: '₹1,790', originalPrice: '₹2,190', age: '12+ months', ageBand: '12-plus', collection: 'individual-toy', category: 'Fine Motor', short: 'A quiet ritual of balancing, building and beginning again.', image: siteImage('balance'), gallery: gallery(siteImage('balance')), benefits: ['Patience and focus', 'Fine motor control', 'Creative play'], includes: ['1 curved balancing base', '9 garden-inspired blocks', 'A cotton drawstring storage bag'], dimensions: '30 × 16 × 6 cm', description: 'A playful exercise in balance that changes each time it is picked up. There is no right way to build a garden; only the pleasure of trying one more possibility.', ...shared }
]

export const ageBands: { id: AgeBand; label: string; description: string }[] = [
  { id: '0-3', label: '0–3 months', description: 'For the very first sights, sounds and snuggles.' },
  { id: '3-6', label: '3–6 months', description: 'For growing curiosity and newly busy hands.' },
  { id: '6-12', label: '6–12 months', description: 'For movement, mastery and everyday discovery.' },
  { id: '12-plus', label: '12+ months', description: 'For little ideas with room to grow.' }
]

export const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '918015023399').replace(/\D/g, '')
export const whatsappLink = (product?: Product) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(product ? `Hello Babiko, I would like to order ${product.name} (${product.price}).` : 'Hello Babiko, I would like help choosing a toy.')}`

// Sanity integration helper: attempt to fetch products from Sanity
import { fetchProducts } from './sanity/client'

export async function loadProducts(): Promise<Product[]> {
  try {
    if (!import.meta.env.VITE_SANITY_PROJECT_ID) return products
    await loadSiteImages()
    const remote: any[] = await fetchProducts()
    if (!remote || remote.length === 0) return products
    return remote.map(r => ({
      id: r._id || r.id || (r.slug && r.slug.current) || '',
      name: r.name || '',
      price: r.price || '',
      originalPrice: r.originalPrice,
      age: r.age || '',
      ageBand: (r.ageBand as any) || '0-3',
      collection: (r.collection as any) || 'individual-toy',
      category: r.category || '',
      short: r.short || '',
      image: r.image || r.imageUrl || siteImage('kit'),
      gallery: (r.gallery && r.gallery.length) ? r.gallery : (r.galleryUrls && r.galleryUrls.length) ? r.galleryUrls : gallery(siteImage('detail')),
      tag: r.tag,
      material: r.material || shared.material,
      benefits: r.benefits || [],
      includes: r.includes || [],
      dimensions: r.dimensions || '',
      description: r.description || '',
      care: r.care || shared.care,
      occasion: r.occasion,
      itemCount: r.itemCount,
      bestSeller: r.bestSeller,
      aplus: (r.aplus && r.aplus.length) ? r.aplus : (r.aplusUrls && r.aplusUrls.length) ? r.aplusUrls : [],
      reviews: r.reviews || [],
      amazonUrl: r.amazonUrl || shared.amazonUrl
    }))
  } catch (e) {
    return products
  }
}
