# DistillSys

An Astro and MDX visual field guide for engineers and technical leaders who need to refresh distributed-systems concepts quickly.

## Product status

- Responsive educational shell with desktop curriculum sidebar and mobile navigation
- Typed Astro content collection for MDX topics
- Reusable refresher, insight, trade-off, failure, interview, and manager-lens components
- Polished homepage, learning roadmap, topic library, glossary, printable cheatsheets, and interview bank
- 33 visual topic lessons with four interactive learning labs
- 12 end-to-end system-design walkthroughs connected back to core concepts
- Static research-paper index covering five areas and publication years 2024–2026
- Browser-local completion tracking, bookmarks, recent history, and Light/Dark/System themes
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
pnpm check:links
```

Topic metadata is validated by `src/content.config.ts`; invalid MDX frontmatter fails the build.
The link check validates generated routes and anchors, including repository-subpath builds.

## Deployment

Pull requests run `.github/workflows/ci.yml`. Merges to `main` build a fully static site into `dist/` and publish it through GitHub Pages using `.github/workflows/deploy.yml`.
