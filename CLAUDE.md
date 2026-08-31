# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## What This Repo Is

`typhed/shared.documents` is the brand contract for the whole TyPhed ecosystem. It contains no application and builds
nothing. Every TyPhed repository mounts it as a git submodule at `shared/documents/` and reads from it.

  * `brand/` is the `@typhed/brand` workspace package: JSON data plus a typed TypeScript view of it.
  * `brand/tokens/` holds the colour, spacing, and typography values the shared Tailwind preset consumes.
  * `assets/brand/` holds the master artwork, copied into each app before it builds.
  * `docs/` holds the brand and design references.
  * `claude/` holds the `CLAUDE.md` fragments every consuming repository imports.
  * `templates/` bootstraps a new subdomain repository.

## The Rule That Governs Everything Here

**A commit in this repository changes every TyPhed property.** There is no such thing as a local change here. Before
editing anything, ask whether the change is true for the brand as a whole. If it is true for only one site, it belongs in
that site instead.

Renaming or removing an export from `brand/index.ts` breaks every consumer at once. Add the new export, migrate the
consumers, then remove the old one.

## Editing The Contract

The JSON files are the source of truth. `brand/index.ts` is a typed view of them and should only ever gain a new export
alongside new JSON, never a hardcoded value of its own.

| File | Owns |
| :---: | --- |
| `brand/site.json` | Name, tagline, canonical URL, description |
| `brand/navigation.json` | Header nav, login CTA, footer columns, social links, contact email, privacy link, copyright |
| `brand/launch.json` | Countdown target and the progress bar zero point, as UTC instants with the IST offset applied |
| `brand/tokens/colors.json` | Both theme palettes as HSL triplets |
| `brand/tokens/spacing.json` | Container, gutters, radius |
| `brand/tokens/typography.json` | Font stacks and the CSS variables each app must expose |

A link in `navigation.json` is written from the brand site's point of view: a page `typhed.com` hosts is stored as the
path it has there, starting with `/`. `brand/index.ts` expands every one of those against `url` in `site.json`, because
the header and the footer also render on the product subdomains, where a root-relative path would resolve against the
wrong host. Never write the domain into a link, and never assume the `href` a component receives is the string sitting
in the JSON.

When you change a token value, update its documentation in `docs/design/` in the same commit. The YAML files there record
the computed hex, where each token is used, and which baked assets carry a hardcoded copy that must be changed by hand.

## Documentation Conventions

  * `*.md` files follow the `markdown-format` skill: `<div align = "center">` title banner, `<div align = "justify">`
    body wrapper, ATX Title Case headings, `  * ` list markers, aligned pipe tables, fenced code blocks with an explicit
    language, and hyphens rather than em dashes.
  * `CLAUDE.md` and everything in `claude/` are the exception: they stay plain, with no div wrappers, because they are
    injected into an agent context rather than rendered.
  * Files in `claude/` load into context at the start of every session in every TyPhed repository. Keep them short. A
    detail that only matters while working on one area belongs in `docs/`, not there.
  * Commits follow the `git-commiter` skill and need an emoji-prefixed subject.

## Checks

There is no build. `@typhed/brand` typechecks with `tsc --noEmit`, which runs from a consuming repository as part of
`pnpm typecheck`. Validate the JSON after editing it by hand, since a malformed file fails every consumer at once.
