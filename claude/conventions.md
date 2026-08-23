# TyPhed Shared Conventions

<!-- Imported into every TyPhed repository's CLAUDE.md via @shared/documents/claude/conventions.md.
     Loads into context every session; keep it short. Repository-specific rules go in that
     repository's own CLAUDE.md. -->

These conventions hold in every TyPhed repository. Where a repository needs a stricter rule, it states
it in its own `CLAUDE.md`.

## Colours Go Through Tokens

Never hardcode a hex value in a component. Every colour resolves from a theme token, so both themes
move together.

  * The values are HSL triplets in
    [brand/tokens/colors.json](https://github.com/typhed/shared.documents/blob/master/brand/tokens/colors.json).
  * The shared Tailwind preset maps each one to a utility through `hsl(var(--token))`, and the `sync:shared` script
    generates the `:root` and `.dark` custom properties into a stylesheet each app imports. No app declares the palette
    by hand.
  * Full reference, including every computed hex and the sync rules:
    [docs/design/colors.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/colors.yml).
    Read it before any colour work.

The one category that escapes tokens is baked assets: raster and SVG artwork, the PWA manifest, and
`themeColor` meta cannot read a CSS variable, so they carry literal hex and are synced by hand. The
`static_assets` block in `colors.yml` lists every one of them.

## Spacing And Type Come From The System

Stay on the Tailwind step scale and the documented type scale rather than reaching for arbitrary
values. The sanctioned exceptions are documented, and adding a new one needs a reason:

  * [docs/design/spacing.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/spacing.yml)
    covers the step scale, the container and its gutters, breakpoints, the fluid vertical rhythm of
    full-height sections, fixed component sizes, and the radius map.
  * [docs/design/typography.yml](https://github.com/typhed/shared.documents/blob/master/docs/design/typography.yml)
    covers the two loaded fonts and how they reach the browser, the size scale, weights, tracking,
    heading semantics, and the baked-in type that cannot follow the theme.

## Shared Components Are Shared

Components in `shared/components/packages/ui` render on every TyPhed property. A change there is a
change everywhere, so:

  * Read the component's page in `shared/components/docs/components/` before editing it.
  * Keep a component free of anything specific to one property. If only one site needs the behaviour,
    it belongs in that site's own `components/` directory, or behind a prop with a neutral default.
  * Respect the runtime boundary. A component marked Client carries `"use client"` for a reason. Do
    not add hooks to a Server Component, and do not drop `"use client"` from a Client one.
  * Preserve the accessibility contract recorded on each component's page: roles, `aria-*` attributes,
    labels, and focus styles.

## Markdown And Commits Are Skill-Governed

Every TyPhed repository follows the same two skills, which live in the user configuration rather than
in any repository:

  * `markdown-format` owns `*.md` structure: the `<div align = "center">` title banner, the
    `<div align = "justify">` body wrapper, ATX Title Case headings, `  * ` list markers, aligned pipe
    tables, fenced code blocks with an explicit language, and hyphens rather than em dashes. `CLAUDE.md`
    and the files it imports are the exception: they stay plain, with no div wrappers.
  * `git-commiter` owns commit messages and requires an emoji-prefixed subject.

Follow them when editing docs or committing, in any repository.
