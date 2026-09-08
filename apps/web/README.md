# Woodbrook web application

The TanStack Start public website supports dynamic local development and a fully static production build.

Run the development server from the repository root with `bun run dev:web`.

## Static build

The repository-level command runs quality checks before producing and verifying the Cloudflare Pages artifact:

```bash
bun run build:static
```

Required build environment:

- `STRAPI_URL`: reachable Strapi origin used only while prerendering.
- `VITE_PUBLIC_SITE_URL`: public origin embedded in canonical and social metadata.

Deploy `dist/client` when the Pages project root is `apps/web`, or `apps/web/dist/client` when it is the repository root. Do not deploy `dist/server`; it is a temporary prerendering input and is not needed at runtime.
