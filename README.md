<div align = "center">

# TyPhed Shared Documents

[![Brand Contract](https://img.shields.io/badge/Brand-%20Contract-003B57?style=plastic&logo=json)](brand)
[![Design Tokens](https://img.shields.io/badge/Design-%20Tokens-003B57?style=plastic&logo=tailwindcss)](brand/tokens)
[![Documentation](https://img.shields.io/badge/Docs-%20Brand%20%26%20Design-003B57?style=plastic&logo=markdown)](docs)
[![Consumed As](https://img.shields.io/badge/Consumed-%20git%20submodule-003B57?style=plastic&logo=git)](#-how-to-consume-it)

</div>

<div align = "justify">

The single source of truth for everything the TyPhed brand says, shows, and looks like. Every property in the ecosystem
mounts this repository as a git submodule at `shared/documents/` and reads from it, so a footer link, a brand colour, or
the legal entity name is written down in exactly one place.

Its companion is [typhed/shared.components](https://github.com/typhed/shared.components), which holds the React
implementation. This repository holds the contract; that one renders it.

## 🧭 What Lives Here

| Path | Holds | Consumed By |
| :---: | --- | :---: |
| [brand/](brand) | The `@typhed/brand` package: site copy, navigation, footer links, social links, launch schedule, design tokens | Every app, as a workspace package |
| [brand/tokens/](brand/tokens) | Colour, spacing, and typography values as JSON | The shared Tailwind preset |
| [assets/brand/](assets/brand) | The mark, the lockup, and the full favicon set | Every app, through the sync script |
| [docs/brand/](docs/brand) | The PRD and the domain / subdomain model | Humans and agents |
| [docs/design/](docs/design) | The colour, spacing, and typography references | Humans and agents |
| [claude/](claude) | `CLAUDE.md` fragments imported by every repository | Claude Code, every session |
| [scripts/](scripts) | The sync that copies brand assets and generates the theme stylesheet | Every app, before dev and build |
| [templates/](templates) | Bootstrap files for a new subdomain repository | You, once per new property |

## 📦 How To Consume It

Add both shared repositories as submodules, then let the workspace pick up their packages:

```shell
$ git submodule add -b master https://github.com/typhed/shared.documents.git shared/documents
$ git submodule add -b master https://github.com/typhed/shared.components.git shared/components
$ git submodule update --init --recursive
```

Point the workspace at them in `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "shared/components/packages/*"
  - "shared/documents/brand"
```

Then import the contract exactly as if it were local:

```tsx
import { SITE, FOOTER_COLUMNS, NAV_LINKS } from "@typhed/brand"
```

The complete bootstrap, including the CI workflow and the `CLAUDE.md` skeleton, is in
[templates/nextjs-subdomain/](templates/nextjs-subdomain). [MIGRATION.md](MIGRATION.md) covers moving an existing
repository onto the shared layer.

## ✏️ How To Change Something

| To change | Edit | Reaches consumers |
| :---: | --- | :---: |
| A footer or nav link, social account, contact email | [brand/navigation.json](brand/navigation.json) | Next build |
| Brand name, tagline, legal entity, canonical URL | [brand/site.json](brand/site.json) | Next build |
| The launch countdown | [brand/launch.json](brand/launch.json) | Next build |
| A theme colour | [brand/tokens/colors.json](brand/tokens/colors.json) | Next build |
| The container, gutters, or radius | [brand/tokens/spacing.json](brand/tokens/spacing.json) | Next build |
| A font stack | [brand/tokens/typography.json](brand/tokens/typography.json) | Next build |
| The logo or favicon artwork | [assets/brand/](assets/brand) | Next build |

Commit and push. Every consuming repository picks the change up on its next build, because their CI floats both
submodules to the branch tip rather than to a pinned commit. To pull a change into a local checkout immediately, run
`pnpm shared:update` there.

Two things do **not** update themselves, and both are documented at the point of use:

  * The hardcoded hex in baked assets. A raster image, the PWA manifest, and the `themeColor` meta cannot read a CSS
    variable. The `static_assets` block in [docs/design/colors.yml](docs/design/colors.yml) lists every one.
  * The recorded submodule pointer in each consumer. CI ignores it, but a fresh local clone uses it. Dependabot raises
    the bump as a pull request so it does not drift far.

## ⚠️ Blast Radius

A commit here changes every TyPhed property at once. Treat it accordingly:

  * A value that is right for only one site does not belong in the contract. Put it in that site.
  * Renaming or removing an export from `@typhed/brand` is a breaking change for every consumer. Add first, migrate, then
    remove.
  * Nothing here is secret. This repository is public and its contents ship to browsers.

</div>
