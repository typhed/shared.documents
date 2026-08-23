/**
 * Prepare a consuming app to build against the shared brand layer.
 *
 * Two jobs, both run before every `dev` and every `build`:
 *
 *   1. Copy the brand artwork into the app's `public/brand`, so a rebrand is
 *      one commit here rather than one per property.
 *   2. Generate the theme stylesheet from `brand/tokens/*.json`, so a colour
 *      changes in one JSON file and every property picks it up.
 *
 * Both destinations are generated and gitignored. Edit the sources in this
 * repository, never the copies in an app.
 *
 * Why the theme is a generated CSS file rather than a Tailwind plugin: a
 * bundler tracks the CSS files it compiles and rebuilds when their content
 * changes, but it does not track JSON that the Tailwind config happens to
 * `require`. Emitting the palette from a plugin therefore produced correct
 * output on a clean build and silently stale colours on an incremental one.
 * A real stylesheet is part of the module graph, so the cache invalidates
 * exactly when it should.
 *
 * Usage, from a consuming repository:
 *
 *   node shared/documents/scripts/sync-shared.mjs \
 *     --assets apps/web/public/brand \
 *     --theme  apps/web/app/theme.css
 *
 * The script fails loudly when a source is missing, because the alternative is
 * a site that deploys successfully with no logo and no colours.
 */

import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, "..")
const ASSET_SOURCE = resolve(ROOT, "assets", "brand")
const COLORS = resolve(ROOT, "brand", "tokens", "colors.json")
const SPACING = resolve(ROOT, "brand", "tokens", "spacing.json")

/**
 * Read `--flag <path>` from argv, falling back to the layout every TyPhed app
 * uses today.
 *
 * @param {string} flag
 * @param {string} fallback
 * @returns {string} absolute path
 */
function option(flag, fallback) {
  const at = process.argv.indexOf(flag)
  const value = at === -1 ? fallback : process.argv[at + 1]

  if (!value) {
    console.error(`sync-shared: ${flag} was given with no path after it.`)
    process.exit(1)
  }

  return resolve(process.cwd(), value)
}

/**
 * Fail with an actionable message rather than a stack trace. A missing source
 * almost always means the submodule was never checked out.
 *
 * @param {string} path
 */
async function requireSource(path) {
  try {
    await stat(path)
  } catch {
    console.error(
      `sync-shared: cannot read ${path}\n` +
        "The shared.documents submodule is probably not checked out. Run:\n" +
        "  git submodule update --init --recursive",
    )
    process.exit(1)
  }
}

/**
 * Render one theme block as a CSS rule. The triplets are written bare, exactly
 * as a custom property expects them, so the Tailwind preset can wrap each one
 * in `hsl()` at the point of use.
 *
 * @param {{ label: string, selector: string, vars: Record<string, string> }} theme
 * @param {string} radius
 * @returns {string}
 */
function themeRule(theme, radius) {
  const declarations = Object.entries(theme.vars)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join("\n")

  return `/* ${theme.label} */\n${theme.selector} {\n${declarations}\n  --radius: ${radius};\n}`
}

async function main() {
  const assets = option("--assets", "public/brand")
  const theme = option("--theme", "app/theme.css")

  await requireSource(ASSET_SOURCE)
  await requireSource(COLORS)

  // Remove first so artwork deleted upstream does not linger in the export.
  await rm(assets, { recursive: true, force: true })
  await mkdir(dirname(assets), { recursive: true })
  await cp(ASSET_SOURCE, assets, { recursive: true })

  const colors = JSON.parse(await readFile(COLORS, "utf8"))
  const spacing = JSON.parse(await readFile(SPACING, "utf8"))
  const radius = spacing.radius.base

  // Light is written before dark on purpose: `:root` and `.dark` carry equal
  // specificity, so source order is what lets the dark theme win.
  const css = [
    "/* GENERATED FILE - DO NOT EDIT.",
    " * Written by shared/documents/scripts/sync-shared.mjs from",
    " * shared/documents/brand/tokens/colors.json before every dev run and build.",
    " * Change a colour there, not here.",
    " */",
    "",
    themeRule(colors.themes.light, radius),
    "",
    themeRule(colors.themes.dark, radius),
    "",
  ].join("\n")

  await mkdir(dirname(theme), { recursive: true })
  await writeFile(theme, css, "utf8")

  console.log(`sync-shared: artwork -> ${assets}`)
  console.log(`sync-shared: theme   -> ${theme}`)
}

main()
