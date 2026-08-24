# CLAUDE.md

<!-- Copy to the repository root and fill in the bracketed parts. Keep the three
     imports at the top: they are the shared brand context, and they must load
     before anything specific to this property. -->

@shared/documents/claude/brand.md
@shared/documents/claude/conventions.md
@shared/documents/claude/shared-workflow.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository. The brand context, the
shared conventions, and the submodule workflow come from the imports above. Everything below is true of this repository
only.

## What This Repo Is

[One paragraph: what this property is, what it publishes, and where. Name the subdomain and the host.]

  * `apps/web` - [what the app is, and how it builds].
  * `shared/documents` - submodule, the brand contract. Do not edit casually; see the shared workflow above.
  * `shared/components` - submodule, the shared component library. Same warning.

## Scope

This property is [the product / the blog / ...]. Brand-level content belongs on `typhed.com`, not here, and anything
belonging to a different product belongs in that product. When in doubt, [docs/PRD.md](docs/PRD.md) settles it: this
repository's own requirements document, which governs this property and no other.

[Anything this property is deliberately NOT: no marketing pages, no pricing, no legal content, whatever applies.]

## Commands

| Command | What It Does |
| :---: | --- |
| `corepack enable && pnpm install` | One-time setup. Also initialises the submodules. |
| `pnpm dev` | Run locally with hot reload. |
| `pnpm build` | Produce the production build. |
| `pnpm lint` | ESLint across the workspace. |
| `pnpm typecheck` | `tsc --noEmit` across the workspace. |
| `pnpm shared:update` | Pull the latest shared components and brand contract, then reinstall. |
| `pnpm shared:status` | Show uncommitted or unpushed work inside either submodule. |

[Add anything specific to this property: a content pipeline, a generator, a test suite.]

## Architecture

[Describe what is specific here: the rendering model, the hosting constraint, any server-side pieces, the deploy trigger.
Do not restate the shared design system or the brand model; the imports cover those.]

## Conventions

[Only rules that differ from, or add to, the shared conventions. If a rule is true of every TyPhed repository, it belongs
in `shared/documents/claude/conventions.md` instead, where every property gets it.]
