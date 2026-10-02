import { useEffect, useState, type CSSProperties } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ageBands, products as staticProducts, loadProducts, type AgeBand, type Collection, type Product, type Review, whatsappLink } from './data'
import { loadSiteImages, useSiteImages } from './site-images'
import logo from './Logo-New theme.png'
import './product.css'
import './collections.css'
import './bestsellers.css'
import './logo.css'
import './mobile-collections.css'
import './section-redesign.css'
import './testimonials.css'

type View = 'home' | 'shop' | 'about' | 'care' | 'all-products' | 'all products' | 'GrowthKit' | 'GiftSet' | 'age'
type CollectionView = Collection | 'age'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [productsState, setProductsState] = useState<Product[]>(staticProducts)
  const [productsReady, setProductsReady] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Babiko — Play, considered.',
      '/shop': 'Shop · Babiko',
      '/all-products': 'All products · Babiko',
      '/all products': 'All products · Babiko',
      '/GrowthKit': 'Growth Kits · Babiko',
      '/GiftSet': 'Gift Sets · Babiko',
      '/age': 'Shop by Age · Babiko',
      '/about': 'Our story · Babiko',
      '/care': 'Safety & care · Babiko'
    }
    const title = titles[location.pathname]
    if (title) document.title = title
  }, [location.pathname])

  useEffect(() => {
    let mounted = true
    loadProducts()
      .then(p => { if (mounted && p && p.length) setProductsState(p) })
      .catch(() => {})
      .finally(() => { if (mounted) setProductsReady(true) })
    loadSiteImages().catch(() => {})
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const root = document.documentElement

    const handlePointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 100
      const y = (event.clientY / window.innerHeight) * 100

      root.style.setProperty('--pointer-x', `${x}%`)
      root.style.setProperty('--pointer-y', `${y}%`)
    }

    const handlePointerLeave = () => {
      root.style.setProperty('--pointer-x', '50%')
      root.style.setProperty('--pointer-y', '50%')
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  const go = (next: View, id?: string) => {
    const target =
      next === 'home' ? '/' :
      next === 'shop' ? '/shop' :
      next === 'about' ? '/about' :
      next === 'care' ? '/care' :
      next === 'all-products' || next === 'all products' ? '/all-products' :
      next === 'GrowthKit' ? '/GrowthKit' :
      next === 'GiftSet' ? '/GiftSet' :
      next === 'age' ? '/age' : '/'

    if (id) {
      navigate(`/product/${id}`)
    } else {
      navigate(target)
    }

    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openCollection = (next: CollectionView) => {
    if (next === 'growth-kit') return go('GrowthKit')
    if (next === 'gift-set') return go('GiftSet')
    return go('age')
  }

  return <>
    <div className="announcement">Complimentary shipping on all orders across India</div>
    <header className="site-header">
      <button className="menu-button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><i></i><i></i></button>
      <button className="brand-logo" onClick={() => go('home')} aria-label="Babiko home"><img src={logo} alt="Babiko — Every Child Deserves" /></button>
      <nav className="desktop-nav"><button onClick={() => go('shop')}>Shop</button><button onClick={() => go('about')}>Our story</button><button onClick={() => go('care')}>Safety & care</button></nav>
      <a className="header-help" href={whatsappLink()} target="_blank" rel="noreferrer">Talk to us <span>↗</span></a>
    </header>

    <aside className={`drawer ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
      <button className="close" onClick={() => setMenuOpen(false)}>×</button><p className="eyebrow">Explore Babiko</p>
      <button onClick={() => go('shop')}>Shop</button>
      <button onClick={() => openCollection('growth-kit')}>Growth Kits</button>
      <button onClick={() => openCollection('gift-set')}>Gift Sets</button>
      <button onClick={() => openCollection('age')}>Shop by age</button>
      <button onClick={() => go('about')}>Our story</button>
      <a href={whatsappLink()} target="_blank" rel="noreferrer">Talk to us ↗</a>
    </aside>

    {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}

    <main>
      <Routes>
        <Route path="/" element={<Home go={go} openCollection={openCollection} products={productsState} />} />
        <Route path="/shop" element={<Shop openCollection={openCollection} go={go} />} />
        <Route path="/all-products" element={<AllProductsPage openCollection={openCollection} go={go} products={productsState} />} />
        <Route path="/all products" element={<AllProductsPage openCollection={openCollection} go={go} products={productsState} />} />
        <Route path="/GrowthKit" element={<CollectionPage selection="growth-kit" openCollection={openCollection} go={go} products={productsState} />} />
        <Route path="/GiftSet" element={<CollectionPage selection="gift-set" openCollection={openCollection} go={go} products={productsState} />} />
        <Route path="/age" element={<CollectionPage selection="age" openCollection={openCollection} go={go} products={productsState} />} />
        <Route path="/product/:id" element={<ProductPage go={go} products={productsState} ready={productsReady} />} />
        <Route path="/about" element={<About />} />
        <Route path="/care" element={<Care />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>

    <Footer go={go} />
  </>
}

const heroPhrases = [
  { lead: 'Play,', accent: 'considered.' },
  { lead: 'Creative', accent: 'toys.' },
  { lead: 'Beautifully', accent: 'safe.' },
  { lead: 'Built', accent: 'to last.' },
  { lead: 'Made for', accent: 'wonder.' },
  { lead: 'Childhood,', accent: 'unrushed.' }
]

function Home({ go, openCollection, products }: { go: (view: View, id?: string) => void; openCollection: (view: CollectionView) => void; products: Product[] }) {
  const [tick, setTick] = useState(0)
  const imgs = useSiteImages()
  const { lead, accent } = heroPhrases[tick % heroPhrases.length]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let interval = 0
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => setTick(current => current + 1), 3800)
    }, 1500)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(interval)
    }
  }, [])

  return <>
    <section className="hero"><div className="hero-image" style={{ '--site-hero': `url('${imgs.hero}')` } as CSSProperties}><div className="hero-caption">Made for the earliest<br/>days of wonder.</div></div><div className="hero-copy"><p className="eyebrow">Thoughtful play, beautifully made</p><h1><span key={tick} className={tick ? 'hero-swap' : undefined}>{lead}<br/><em>{accent}</em></span></h1><p>Thoughtful toys for the rhythm of everyday life—designed to be discovered, used, and loved.</p><button className="text-link" onClick={() => go('shop')}>Shop the collection <b>→</b></button></div></section>
    <section className="feature-scroller horizontal" aria-hidden="false">
      <div className="scroller-viewport horizontal">
        <div className="scroller-track horizontal">
          {['Montessori Inspired','Safety Tested','Sustainably Chosen','Beautifully Crafted'].map((label, i) => <div className="feature-item" key={label + i}><span className="diamond">✦</span><span className="feature-label">{label}</span></div>)}
          {['Montessori Inspired','Safety Tested','Sustainably Chosen','Beautifully Crafted'].map((label, i) => <div className="feature-item" key={label + '-dup' + i}><span className="diamond">✦</span><span className="feature-label">{label}</span></div>)}
        </div>
      </div>
    </section>
    <section className="trust">
      <div className="trust-item"><b>BIS <em>Certified</em></b><span>Bureau of Indian Standards</span></div>
      <div className="trust-item"><b>10,000<em>+</em></b><span>Parents trust Babiko</span></div>
      <div className="trust-item"><b>15,000<em>+</em></b><span>Kids have enjoyed our toys</span></div>
    </section>
    <section className="intro"><p className="eyebrow">The Babiko philosophy</p><h2>Designed for the<br/>way children <em>really</em> play.</h2><p>We create objects that feel as good in your home as they do in little hands—curated for imagination, ease, and everyday rituals.</p></section>
    <ShopPaths openCollection={openCollection} />
    <BestSellers go={go} products={products} />
    <section className="product-feature"><div className="feature-image" style={{ '--site-feature': `url('${imgs.feature}')` } as CSSProperties}></div><div className="feature-copy"><p className="eyebrow">Learning through play</p><h2>Play that builds<br/><em>young brains.</em></h2><p>Babiko toys are chosen to stretch a growing mind — not just to entertain it. Every piece invites your child to think, try and discover at their own pace.</p><div className="feature-points"><div><b>01</b><div><h3>Cognitive & problem solving</h3><p>Sorting, stacking and fitting shapes build early logic — and the confidence to keep trying.</p></div></div><div><b>02</b><div><h3>Fine motor & coordination</h3><p>Grasping, turning and placing pieces strengthen the small muscles that will later hold a pencil.</p></div></div><div><b>03</b><div><h3>Language & focus</h3><p>Open-ended play gives little ones something real to name, describe and stay curious about.</p></div></div><div><b>04</b><div><h3>Creativity & independence</h3><p>No instructions and no wrong answers — just room to imagine, decide and lead their own play.</p></div></div></div><button className="text-link" onClick={() => go('shop')}>Explore learning toys <b>→</b></button></div></section>
    <Testimonials />
    <section className="promise"><p className="eyebrow">The Babiko promise</p><h2>Nothing less than<br/><em>beautifully safe.</em></h2><div className="promise-grid"><div><b>01</b><h3>Gentle by nature</h3><p>Non-toxic finishes and carefully chosen materials for curious little hands and mouths.</p></div><div><b>02</b><h3>Made to endure</h3><p>Thoughtful objects designed to stay loved for years—through siblings, keepsakes, and everyday rituals.</p></div><div><b>03</b><h3>Purpose in play</h3><p>Every detail supports discovery and development without rushing childhood.</p></div></div><button className="text-link light" onClick={() => go('care')}>Our standards <b>→</b></button></section>
  </>
}

function ShopPaths({ openCollection, showTitle = true }: { openCollection: (view: CollectionView) => void; showTitle?: boolean }) {
  const imgs = useSiteImages()
  const paths: { type: CollectionView; eyebrow: string; title: string; copy: string; image: string }[] = [
    { type: 'growth-kit', eyebrow: 'A journey, considered', title: 'Growth<br/><em>Kits</em>', copy: 'Stage-led play for their changing world.', image: imgs['growth-kit'] },
    { type: 'gift-set', eyebrow: 'For the little milestones', title: 'Gift<br/><em>Sets</em>', copy: 'Beautiful beginnings, wrapped with care.', image: imgs['gift-set'] },
    { type: 'age', eyebrow: 'Find their next favourite', title: 'Shop by<br/><em>Age</em>', copy: 'A thoughtful place to begin.', image: imgs['age'] }
  ]
  return <section className="shop-paths"><div className="section-title" style={{display: showTitle ? 'block' : 'none'}}><div><p className="eyebrow">Find what feels right</p><h2>Made for every<br/><em>beginning.</em></h2></div></div><div className="path-grid">{paths.map(path => <button className="path-card" onClick={() => openCollection(path.type)} key={path.type}><img src={path.image} alt="" loading="lazy" decoding="async" /><div><p className="eyebrow">{path.eyebrow}</p><h3 dangerouslySetInnerHTML={{ __html: path.title }} /><p>{path.copy}</p><span>Explore <b>→</b></span></div></button>)}</div></section>
}

function BestSellers({ go, products }: { go: (view: View, id?: string) => void; products: Product[] }) {
  const bestSellers = products.filter(product => product.bestSeller)
  return <section className="best-sellers"><div className="section-title"><div><p className="eyebrow">Loved by little ones</p><h2>Our<br/><em>Bestsellers.</em></h2></div><button className="text-link desktop-only" onClick={() => go('all-products')}>Explore all toys <b>→</b></button></div><div className="best-seller-rail">{bestSellers.map(product => <ProductCard key={product.id} product={product} go={go} />)}</div></section>
}

function Testimonials() {
  const feedback = [
    { quote: 'The growth kit arrived beautifully packaged and genuinely thoughtful. My daughter reaches for the wooden shapes every single day.', name: 'Ananya Sharma', detail: 'Mum to Aria · Bengaluru' },
    { quote: 'You can feel the care in every piece — smooth edges, no plastic smell, and the colours are so gentle. Worth every rupee.', name: 'Rahul Menon', detail: 'Dad to Kabir · Pune' },
    { quote: 'I gifted the newborn set at a baby shower and the new parents were thrilled. It felt far more personal than a last-minute gift.', name: 'Priya Nair', detail: 'Gifted the Newborn Set · Kochi' },
    { quote: 'Finally toys that look as good in the living room as they are to play with. The build quality is exceptional.', name: 'Aditya Verma', detail: 'Dad to Mira · Mumbai' },
    { quote: 'Ordered on a whim and it has become our most-used toy. Every edge is finished so beautifully — you can tell real thought went into it.', name: 'Sneha Iyer', detail: 'Mum to Ved · Hyderabad' },
    { quote: 'The care team answered every question on WhatsApp within minutes and helped me choose the right kit for my nephew. Genuinely lovely service.', name: 'Karan Malhotra', detail: 'Gifted the Growth Kit · Delhi' }
  ]

  const [paused, setPaused] = useState(false)

  return <section className="testimonials">
    <div className="section-title"><div><p className="eyebrow">Kind words from parents</p><h2>Loved in<br/><em>real homes.</em></h2></div></div>
    <div className={`testimonial-viewport${paused ? ' is-paused' : ''}`} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onPointerCancel={() => setPaused(false)} onTouchStart={() => setPaused(true)} onTouchEnd={() => setPaused(false)}>
      <div className="testimonial-track">
        {[0, 1].map(pass => feedback.map(item => <figure className={`testimonial-card${pass ? ' is-dup' : ''}`} key={`${pass}-${item.name}`} aria-hidden={pass ? true : undefined}><div className="testimonial-stars" aria-label="Rated 5 out of 5">★★★★★</div><blockquote>{item.quote}</blockquote><figcaption><strong>{item.name}</strong><span>{item.detail}</span></figcaption></figure>))}
      </div>
    </div>
  </section>
}

function ProductPrice({ product }: { product: Product }) {
  const hasDiscount = !!product.originalPrice && product.originalPrice !== product.price

  const getDiscountPercent = (current: string, original: string) => {
    const parseMoney = (value: string) => Number(value.replace(/[^\d]/g, ''))
    const currentValue = parseMoney(current)
    const originalValue = parseMoney(original)

    if (!currentValue || !originalValue || originalValue <= currentValue) return null
    return `${Math.round(((originalValue - currentValue) / originalValue) * 100)}%`
  }

  const discountPercent = hasDiscount ? getDiscountPercent(product.price, product.originalPrice || '') : null

  return <div className="product-price-block">{hasDiscount && <div className="price-text-group"><span className="original-price">{product.originalPrice}</span>{discountPercent && <span className="discount-badge">{discountPercent}</span>}</div>}<strong className="product-price">{product.price}</strong></div>
}

function ProductCard({ product, go }: { product: Product; go: (view: View, id?: string) => void }) {
  return <article className="product-card">
    <button className="product-photo" onClick={() => go('shop', product.id)}><img src={product.image} alt={product.name} loading="lazy" decoding="async" />{product.tag && <span>{product.tag}</span>}</button>
    <div className="product-meta"><div><p>{product.category} · {product.age}</p><h3>{product.name}</h3></div><ProductPrice product={product} /></div>
    {product.itemCount && <p className="item-count">{product.itemCount} thoughtfully chosen pieces</p>}
    <button className="underlink" onClick={() => go('shop', product.id)}>Explore <b>→</b></button>
  </article>
}

function Shop({ openCollection, go }: { openCollection: (view: CollectionView) => void; go: (view: View, id?: string) => void }) {
  return <section className="shop page">
    <div className="shop-hero">
      <div>
        <p className="eyebrow">The Babiko shop</p>
        <p className="page-intro">Whether you are looking for a thoughtful gift, a play journey, or a toy for right now, start here.</p>
      </div>
      <div className="shop-actions"><button className="text-link" onClick={() => go('all-products')}>View all products <b>→</b></button></div>
    </div>
    <ShopPaths openCollection={openCollection} showTitle={true} />
  </section>
}

function AllProductsPage({ openCollection, go, products }: { openCollection: (view: CollectionView) => void; go: (view: View, id?: string) => void; products: Product[] }) {
  if (!products || products.length === 0) return <section className="collection-page page"><p>Loading products…</p></section>
  return <section className="collection-page page"><div className="section-title"><div><p className="eyebrow">The full collection</p><h2>All<br/><em>products.</em></h2></div></div>
    <div className="collection-switch"><button onClick={() => go('all-products')}>All products</button><button onClick={() => openCollection('growth-kit')}>Growth Kits</button><button onClick={() => openCollection('gift-set')}>Gift Sets</button><button onClick={() => openCollection('age')}>Shop by Age</button></div>
    <div className="product-grid four">{products.map(product => <ProductCard key={product.id} product={product} go={go} />)}</div>
  </section>
}

function CollectionPage({ selection, openCollection, go, products }: { selection: CollectionView; openCollection: (view: CollectionView) => void; go: (view: View, id?: string) => void; products: Product[] }) {
  const [age, setAge] = useState<AgeBand>('0-3')
  const isAge = selection === 'age'
  if (!products || products.length === 0) return <section className="collection-page page"><p>Loading products…</p></section>
  const data = isAge ? products.filter(product => product.ageBand === age) : products.filter(product => product.collection === selection)
  const content = selection === 'growth-kit' ? { eyebrow: 'A play journey for each new stage', heading: <>Growth<br/><em>Kits</em></>, copy: 'Thoughtfully sequenced playthings that meet them where they are—and gently invite what comes next.' } : selection === 'gift-set' ? { eyebrow: 'Beautifully prepared for giving', heading: <>Gift<br/><em>Sets</em></>, copy: 'Meaningful objects for the first hello, the first birthday, and all the moments that deserve to be remembered.' } : { eyebrow: 'Play for right now', heading: <>Shop by<br/><em>Age</em></>, copy: ageBands.find(item => item.id === age)?.description || '' }

  return <section className="collection-page page"><button className="back-link" onClick={() => go('all-products')}>← Back to shop</button><p className="eyebrow">{content.eyebrow}</p><h1>{content.heading}</h1><p className="page-intro">{content.copy}</p>
    <div className="collection-switch"><button className={selection === 'growth-kit' ? 'active' : ''} onClick={() => openCollection('growth-kit')}>Growth Kits</button><button className={selection === 'gift-set' ? 'active' : ''} onClick={() => openCollection('gift-set')}>Gift Sets</button><button className={isAge ? 'active' : ''} onClick={() => openCollection('age')}>Shop by Age</button></div>
    {isAge && <div className="age-selector">{ageBands.map(item => <button className={age === item.id ? 'active' : ''} key={item.id} onClick={() => setAge(item.id)}><span>{item.label}</span><small>{item.description}</small></button>)}</div>}
    <div className="product-grid four">{data.map(product => <ProductCard key={product.id} product={product} go={go} />)}</div>
  </section>
}

function ProductPage({ go, products, ready }: { go: (view: View, id?: string) => void; products: Product[]; ready: boolean }) {
  const { id } = useParams()
  const [activeImage, setActiveImage] = useState(0)
  const [openDetail, setOpenDetail] = useState<number>(-1)
  const [slideDir, setSlideDir] = useState<'next' | 'prev'>('next')
  const product = products.find(item => item.id === id)

  useEffect(() => {
    if (product) document.title = `${product.name} · Babiko`
  }, [product])

  if (!product) {
    if (!ready) return <section className="product-page page"><p>Loading product…</p></section>
    return <section className="product-page page"><button className="back-link" onClick={() => go('all-products')}>← Back to shop</button><h1>Product not found</h1><p className="lead">We couldn't find that toy — it may have been moved or sold out.</p><button className="text-link" onClick={() => go('all-products')}>Browse all products <b>→</b></button></section>
  }

  const totalImages = product.gallery.length
  const goToImage = (index: number, dir: 'next' | 'prev') => {
    setSlideDir(dir)
    setActiveImage(((index % totalImages) + totalImages) % totalImages)
  }
  const related = products.filter(item => item.id !== product.id && (item.collection === product.collection || item.ageBand === product.ageBand)).slice(0, 3)
  const details = [
    ['A closer look', product.description],
    ['What is included', product.includes.map(item => `• ${item}`).join('\n')],
    ['Materials & safety', `Made with ${product.material.toLowerCase()}. Every Babiko toy is thoughtfully selected for little hands and curious mouths. Always supervise play and inspect before use.`],
    ['Size & care', `${product.dimensions}\n\n${product.care}`],
    ['Shipping & returns', 'Complimentary delivery across India. Orders are usually dispatched within 1–2 working days. For help with an order or return, simply speak with our care team on WhatsApp.']
  ]
  const defaultReviews: Review[] = [
    { quote: 'The growth kit arrived beautifully packaged and genuinely thoughtful. My daughter reaches for the wooden shapes every single day.', name: 'Ananya Sharma', detail: 'Mum to Aria · Bengaluru' },
    { quote: 'You can feel the care in every piece — smooth edges, no plastic smell, and the colours are so gentle. Worth every rupee.', name: 'Rahul Menon', detail: 'Dad to Kabir · Pune' },
    { quote: 'I gifted the newborn set at a baby shower and the new parents were thrilled. It felt far more personal than a last-minute gift.', name: 'Priya Nair', detail: 'Gifted the Newborn Set · Kochi' }
  ]
  const hasReviews = !!product.reviews && product.reviews.length > 0
  const reviews = hasReviews ? product.reviews! : defaultReviews
  const reviewAverage = hasReviews ? reviews.reduce((sum, review) => sum + (review.rating || 5), 0) / reviews.length : 4.9
  const reviewCount = hasReviews ? reviews.length : 128

  return <section className="product-page page"><button className="back-link" onClick={() => go('all-products')}>← Back to shop</button><div className="product-layout"><div className="product-gallery"><div className="main-product-image"><img key={activeImage} className={`gallery-slide ${slideDir}`} src={product.gallery[activeImage]} alt={`${product.name}, view ${activeImage + 1}`} fetchPriority="high" decoding="async" />{totalImages > 1 && <><button className="gallery-arrow prev" onClick={() => goToImage(activeImage - 1, 'prev')} aria-label="Previous image">←</button><button className="gallery-arrow next" onClick={() => goToImage(activeImage + 1, 'next')} aria-label="Next image">→</button></>}<span>{String(activeImage + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}</span></div><div className="gallery-thumbnails">{product.gallery.map((image, index) => <button className={index === activeImage ? 'selected' : ''} onClick={() => goToImage(index, index >= activeImage ? 'next' : 'prev')} key={image} aria-label={`View image ${index + 1}`}><img src={image} alt="" loading="lazy" decoding="async" /></button>)}</div></div><div className="product-detail"><p className="eyebrow">{product.category} · {product.age}</p><h1>{product.name}</h1><div className="price"><ProductPrice product={product} /></div><p className="lead">{product.short}</p>{product.occasion && <p className="occasion">{product.occasion}</p>}<div className="purchase-note"><span>●</span> In stock · ready to be loved</div><div className="product-actions"><a className="button dark" href={whatsappLink(product)} target="_blank" rel="noreferrer">Order on WhatsApp <span>↗</span></a><a className="button outline" href={product.amazonUrl} target="_blank" rel="noreferrer">Buy on Amazon <span>↗</span></a></div><p className="order-assurance">Complimentary shipping in India · Secure Amazon checkout available</p><div className="details product-at-a-glance"><div><span>Made with</span><p>{product.material}</p></div><div><span>Supports</span><p>{product.benefits.join(' · ')}</p></div><div><span>Recommended age</span><p>{product.age}</p></div>{product.itemCount && <div><span>Inside the box</span><p>{product.itemCount} thoughtfully chosen pieces</p></div>}</div></div></div>

    {/* A+ visuals section hidden for now — restore by uncommenting
    {product.aplus && product.aplus.length > 0 && <section className="aplus-content"><div className="section-title"><div><p className="eyebrow">A+ visuals</p><h2>More images & details</h2></div></div><div className="aplus-grid">{product.aplus.map((img, i) => <div className="aplus-module" key={i}><img src={img} alt={`${product.name} — visual ${i + 1}`} /></div>)}</div></section>}
    */}

    <section className="product-details-section"><div className="product-accordion">{details.map(([title, text], i) => <div className={"detail-block" + (openDetail === i ? ' expanded' : '')} key={title}><button className="detail-title" onClick={() => setOpenDetail(openDetail === i ? -1 : i)} aria-expanded={openDetail === i}><span>{title}</span><b>{openDetail === i ? '−' : '+'}</b></button>{openDetail === i && <div className="detail-copy">{text}</div>}</div>)}</div></section>

    <section className="product-reviews"><div className="product-reviews-head"><p className="eyebrow">Kind words from parents</p><h2>Loved by<br/><em>little families.</em></h2><div className="review-rating"><span className="testimonial-stars" aria-label={`Rated ${reviewAverage.toFixed(1)} out of 5`}>{'★'.repeat(Math.round(reviewAverage))}</span><b>{reviewAverage.toFixed(1)}</b><span>· Based on {reviewCount} review{reviewCount === 1 ? '' : 's'}</span></div></div><div className="review-grid">{reviews.map((review, i) => <figure className="review-card" key={review.name || i}><div className="testimonial-stars" aria-label={`Rated ${review.rating || 5} out of 5`}>{'★'.repeat(review.rating || 5)}</div><blockquote>{review.quote}</blockquote><figcaption><strong>{review.name}</strong><span>{review.detail}</span></figcaption></figure>)}</div></section>

    {related.length > 0 && <section className="related"><p className="eyebrow">More to explore</p><div className="related-grid">{related.map(item => <ProductCard key={item.id} product={item} go={go} />)}</div></section>}
  </section>
}

function About() { const imgs = useSiteImages(); return <section className="about page"><p className="eyebrow">Our story</p><h1>For all the<br/><em>firsts.</em></h1><div className="about-visual" style={{ '--site-about': `url('${imgs.about}')` } as CSSProperties}></div><div className="about-copy"><p>Babiko began with a belief: that the objects children meet first should be as thoughtful as the love that surrounds them.</p><p>We create playthings that invite curiosity over perfection, imagination over instruction, and a little more wonder into ordinary days.</p></div></section> }

function Care() {
  const [open, setOpen] = useState(0)
  const items = [['Safe in every sense', 'We select considered materials and non-toxic finishes appropriate for curious little hands and mouths.'], ['Made for everyday play', 'Each Babiko piece is designed to meet the demands of real family life, with sturdy construction and softly finished edges.'], ['Caring for your Babiko toy', 'Wipe gently with a clean, damp cloth. Keep dry and away from prolonged direct sunlight.']]

  return <section className="care page"><p className="eyebrow">Safety & care</p><h1>Made with<br/><em>care, always.</em></h1><p className="page-intro">The smallest details matter most. Here is what guides every Babiko piece.</p><div className="accordion">{items.map(([title, text], i) => <div className={open === i ? 'expanded' : ''} key={title}><button onClick={() => setOpen(open === i ? -1 : i)}><span>{title}</span><b>{open === i ? '−' : '+'}</b></button>{open === i && <p>{text}</p>}</div>)}</div></section>
}

function Footer({ go }: { go: (view: View, id?: string) => void }) {
  return <footer><div className="footer-top"><p className="eyebrow">A little note from us</p><h2>Play more.<br/><em>Wonder longer.</em></h2><a className="button light-button" href={whatsappLink()} target="_blank" rel="noreferrer">Talk to Babiko <span>↗</span></a></div><div className="footer-bottom"><button className="brand-logo footer-logo" onClick={() => go('home')}><img src={logo} alt="Babiko — Every Child Deserves" /></button><div className="footer-links"><button onClick={() => go('shop')}>Shop</button><button onClick={() => go('about')}>Our story</button><button onClick={() => go('care')}>Safety & care</button><a href={whatsappLink()} target="_blank" rel="noreferrer">Contact</a></div><p>© 2026 Babiko. Made in India.</p></div></footer>
}

export default App
