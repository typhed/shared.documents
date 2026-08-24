/**
 * Types for the TyPhed brand contract.
 *
 * The contract itself is plain JSON so that any stack can read it: a Next.js
 * app imports it through this package, and a generator in another language
 * reads the same files off disk. These types describe that JSON for the
 * TypeScript consumers.
 */

/**
 * A navigable link. `external` opens in a new tab with safe rel attributes,
 * and the footer marks such a link with a trailing arrow glyph. Placeholder
 * destinations use `href: "#"` until the real route or section exists, so
 * markup and intent stay in one place.
 */
export type NavLink = {
  label: string
  href: string
  external?: boolean
}

/** A titled group of links rendered under one footer heading. */
export type FooterColumn = {
  heading: string
  links: readonly NavLink[]
}

/**
 * One column of the footer grid. A column usually holds a single group, but
 * it may stack two under one another (DISCLAIMER over COMMUNITY) when the
 * grid has fewer columns than the brand has link groups.
 */
export type FooterColumnGroup = readonly FooterColumn[]

/** A contact or social destination rendered as an icon in the footer. */
export type SocialLink = {
  label: string
  href: string
  /** lucide-react icon name; resolved to a glyph by the footer's icon map. */
  icon: "github" | "mail" | "linkedin" | "twitter" | "instagram" | "youtube" | "facebook"
  external: boolean
}

/** Brand identity strings that fan out into metadata, JSON-LD, and copy. */
export type Site = {
  name: string
  tagline: string
  legalEntity: string
  url: string
  description: string
}

/** The two ownership lines rendered in the footer's bottom bar. */
export type Copyright = {
  line1: string
  line2: string
}

/** One theme's CSS custom property values, as bare HSL triplets. */
export type ThemeTokens = {
  label: string
  selector: string
  vars: Record<string, string>
}

/** Both palettes, keyed by theme name. */
export type ColorTokens = {
  themes: {
    light: ThemeTokens
    dark: ThemeTokens
  }
}
