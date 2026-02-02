import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono().basePath('/api')

// Mock environment for existing route logic if needed
// or we can import the routes directly if they are refactored to be framework-agnostic.
// For now, let's create a basic handler and then bridge to the existing routes.

app.get('/hello', (c) => {
    return c.json({ message: 'Hello from Cloudflare Functions!' })
})

// Bridge to existing routes will go here
// We'll need to adapt Express req/res to Hono c.req/c.res

export const onRequest = handle(app)
