export function GET() { return new Response("User-agent: *\nAllow: /\nSitemap: https://navant.dev/sitemap-index.xml\n", { headers: { "Content-Type": "text/plain" } }); }
