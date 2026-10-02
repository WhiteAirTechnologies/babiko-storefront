#!/usr/bin/env node
/* CommonJS import script for environments where package.json sets "type": "module" */
const sanityPkg = require('@sanity/client')
const sanityFactory = typeof sanityPkg === 'function' ? sanityPkg : (sanityPkg && sanityPkg.default) ? sanityPkg.default : null
if (!sanityFactory) {
  console.error('Unable to load @sanity/client — unexpected export shape')
  process.exit(1)
}
const client = sanityFactory({
  projectId: process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '0wd5v2k0',
  dataset: process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN || process.env.VITE_SANITY_TOKEN,
  useCdn: false
})

const products = require('../sanity/sanity-products.json')

async function run() {
  if (!client.config().token) {
    console.error('Missing SANITY_WRITE_TOKEN environment variable. Create a write token in the Sanity project API page.')
    process.exit(1)
  }

  for (const p of products) {
    const doc = Object.assign({}, p, { _type: 'product' })
    try {
      await client.createOrReplace(doc)
      console.log('Imported', doc._id || (doc.slug && doc.slug.current) || doc.name)
    } catch (err) {
      console.error('Failed to import', doc._id || doc.name, err && err.message ? err.message : err)
    }
  }
}

run().catch(err => { console.error(err); process.exit(1) })
