const PORT = process.env.CDP_PORT || '9336'
const SIZES = (process.env.SIZES || '390x844,390x667,320x568,768x1024').split(',').map(s => s.split('x').map(Number))

const expr = `(() => {
  const de = document.documentElement, vw = de.clientWidth, vh = de.clientHeight;
  const hero = document.querySelector('.hero');
  const img = document.querySelector('.hero-image');
  const copy = document.querySelector('.hero-copy');
  const cap = document.querySelector('.hero-caption');
  const hr = hero.getBoundingClientRect(), ir = img.getBoundingClientRect(), cr = copy.getBoundingClientRect();
  const capR = cap.getBoundingClientRect(), capC = getComputedStyle(cap);
  const bad = [];
  for (const el of document.querySelectorAll('main *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (el.closest('.feature-scroller') || el.closest('.path-grid')) continue;
    if (r.right > vw + 0.5 || r.left < -0.5) bad.push(el.tagName.toLowerCase() + '.' + (typeof el.className === 'string' ? el.className.trim() : ''));
  }
  return JSON.stringify({
    vw, vh,
    heroH: Math.round(hr.height),
    imageH: Math.round(ir.height), imageW: Math.round(ir.width),
    copyH: Math.round(cr.height),
    imagePctOfHero: Math.round(ir.height / hr.height * 100),
    imagePctOfViewport: Math.round(ir.height / vh * 100),
    caption: { left: Math.round(capR.left), bottom: Math.round(vh - capR.bottom), leftInImage: Math.round(capR.left - ir.left) },
    heroBottom: Math.round(hr.bottom),
    fitsInFirstScreen: hr.bottom <= vh,
    docScrollW: de.scrollWidth, docOverflow: de.scrollWidth - vw,
    outOfBounds: bad
  });
})()`

async function main() {
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()
  const page = list.find(t => t.type === 'page')
  const ws = new WebSocket(page.webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()
  ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) } })
  const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) })
  await new Promise(r => ws.addEventListener('open', r))
  await send('Page.enable')
  for (const [w, h] of SIZES) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: true })
    await send('Page.navigate', { url: 'http://localhost:5173/' })
    await new Promise(r => setTimeout(r, 2800))
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true })
    const v = JSON.parse(res.result.result.value)
    console.log(`${String(v.vw) + 'x' + String(v.vh)}`.padEnd(10) +
      ` hero=${String(v.heroH).padStart(4)}  image=${String(v.imageH).padStart(3)}x${String(v.imageW).padStart(3)}` +
      ` (${String(v.imagePctOfViewport).padStart(2)}% of screen)  copy=${String(v.copyH).padStart(3)}` +
      `  capInset=${v.caption.leftInImage}/${v.caption.bottom}  heroEnds=${String(v.heroBottom).padStart(4)}  fits=${v.fitsInFirstScreen}` +
      `  overflow=${v.docOverflow}  oob=${v.outOfBounds.length}`)
  }
  ws.close()
}
main().catch(e => { console.error(e); process.exit(1) })
