# DistillSys

An Astro and MDX visual field guide for engineers and technical leaders who need to refresh distributed-systems concepts quickly.

## First milestone

- Responsive educational shell with desktop curriculum sidebar and mobile navigation
- Typed Astro content collection for MDX topics
- Reusable refresher, insight, trade-off, failure, interview, and manager-lens components
- Homepage and learning roadmap
- CAP theorem, Raft consensus, and consistent-hashing vertical slices
- Browser-local reading progress and color theme
- Static GitHub Pages deployment at `navant.dev`

## Local development

Requires Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev
```

## Validation

```bash
pnpm check
pnpm lint
pnpm build
```

Topic metadata is validated by `src/content.config.ts`; invalid MDX frontmatter fails the build.

## Deployment

Pull requests run `.github/workflows/ci.yml`. Merges to `main` build a fully static site into `dist/` and publish it through GitHub Pages using `.github/workflows/deploy.yml`.
