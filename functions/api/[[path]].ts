import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono().basePath('/api')

app.all('*', async (c) => {
  // Replace with your Render URL or set it in Cloudflare Dashboard
  const backendUrl = 'https://anbu-weddings.onrender.com'
  const url = new URL(c.req.url)
  const proxyUrl = `${backendUrl}/api${url.pathname.replace('/api', '')}${url.search}`

  // For POST/PUT/PATCH, we need to pass the body
  const body = c.req.method !== 'GET' ? await c.req.raw.blob() : undefined;

  const response = await fetch(proxyUrl, {
    method: c.req.method,
    headers: c.req.header(),
    body: body,
  })

  return new Response(response.body, response)
})

export const onRequest = handle(app)
