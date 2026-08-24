/**
 * `@typhed/brand` - the single source of truth for brand copy, the launch
 * schedule, navigation, and contact links across every TyPhed property.
 *
 * The values live in the JSON files beside this one so that a non-React
 * subdomain can read them directly. This module is the typed view of that
 * data, and it keeps the export names the component library has always used,
 * so consuming code does not care where the values came from.
 *
 * Edit the JSON, never this file, to change what the site says.
 */

import launchData from "./launch.json"
import navigationData from "./navigation.json"
import siteData from "./site.json"
import type { Copyright, FooterColumnGroup, NavLink, Site, SocialLink } from "./types"

export type {
  ColorTokens,
  Copyright,
  FooterColumn,
  FooterColumnGroup,
  NavLink,
  Site,
  SocialLink,
  ThemeTokens,
} from "./types"

/** Brand identity: name, tagline, legal entity, canonical URL, description. */
export const SITE: Site = siteData

/**
 * The brand layer's own origin, with any trailing slash removed so a path
 * appends cleanly. Every absolute link this module hands out is built from
 * it, which keeps the domain written down exactly once, in `site.json`.
 */
const BRAND_ORIGIN = SITE.url.replace(/\/+$/, "")

/**
 * Expand one contract `href` into a destination that still works when the
 * link is rendered on another property.
 *
 * The contract is written from the brand site's point of view, so a page
 * `typhed.com` hosts is stored as the root-relative path it has there, such
 * as `/about` or `/permalink/conduct.html`. That path is only correct while
 * the page carrying it is also on `typhed.com`. Rendered by the shared header
 * or footer on `blog.typhed.com`, the browser resolves it against the blog
 * and lands on a page that was never deployed there. Expanding it against
 * `BRAND_ORIGIN` points every property at the one page that exists.
 *
 * Anything already unambiguous is returned untouched: an absolute URL, a
 * protocol-relative URL, a `mailto:`, and the `#` placeholder that stands in
 * until a destination exists.
 *
 * Exported so a subdomain can build its own link to a brand page the same
 * way, rather than writing the domain down a second time.
 */
export function resolveBrandHref(href: string): string {
  const isBrandPath = href.startsWith("/") && !href.startsWith("//")
  return isBrandPath ? `${BRAND_ORIGIN}${href}` : href
}

/** `resolveBrandHref` applied to one link, leaving the rest of it alone. */
function resolveLink<T extends NavLink>(link: T): T {
  return { ...link, href: resolveBrandHref(link.href) }
}

/** `resolveLink` mapped over a list of links, preserving their order. */
function resolveLinks<T extends NavLink>(links: readonly T[]): readonly T[] {
  return links.map(resolveLink)
}

/**
 * Launch target, expressed in UTC with the IST offset already applied so the
 * countdown reads correctly from every timezone. See `launch.json`.
 */
export const LAUNCH_DATE = new Date(launchData.date)

/** Start of the journey, used as the 0% point of the launch progress bar. */
export const LAUNCH_START_DATE = new Date(launchData.startDate)

/** Human-readable launch instant, shown beside the countdown. */
export const LAUNCH_LABEL: string = launchData.label

/**
 * Ownership lines for the footer's bottom bar. The year is stamped at module
 * load from `line1Template`, so no annual maintenance is needed.
 */
export const COPYRIGHT: Copyright = {
  line1: navigationData.copyright.line1Template.replace("{year}", String(new Date().getFullYear())),
  line2: navigationData.copyright.line2,
}

/**
 * Social and contact links shown as the footer's icon row. To add a network,
 * append an entry to `navigation.json` with one of the supported `icon` names
 * in `types.ts` - no component change is needed. (The `mail` entry is the
 * contact address; the footer renders it as a text link, not an icon, to
 * avoid duplication.)
 */
export const SOCIAL_LINKS: readonly SocialLink[] = resolveLinks(
  navigationData.social as readonly SocialLink[],
)

/** Contact address surfaced in the footer (no phone / postal address yet). */
export const CONTACT_EMAIL: string = navigationData.contactEmail

/** Primary header navigation. */
export const NAV_LINKS: readonly NavLink[] = resolveLinks(navigationData.nav)

/**
 * The header's primary call-to-action, shared by the desktop bar and the
 * mobile menu so the label and destination stay in one place.
 */
export const LOGIN_CTA: NavLink = resolveLink(navigationData.loginCta)

/**
 * The products the brand layer points visitors at. Each live product sits on
 * its own subdomain, so those entries are external; pricing is a page on the
 * brand site and stays a placeholder until it exists.
 */
export const PRODUCT_LINKS: readonly NavLink[] = resolveLinks(navigationData.footer.products.links)

/**
 * Reading, evidence, and hiring. The blog runs on its own subdomain and the
 * career page is the LinkedIn company page, so both leave the site.
 */
export const RESOURCE_LINKS: readonly NavLink[] = resolveLinks(
  navigationData.footer.resources.links,
)

/** Legal link shown on the right of the footer's bottom bar. */
export const PRIVACY_LINK: NavLink = resolveLink(navigationData.privacy)

/**
 * Legal reading. The privacy policy heads this column rather than being
 * repeated in `navigation.json`, so the column and the bottom bar link can
 * never end up pointing at different pages.
 */
export const DISCLAIMER_LINKS: readonly NavLink[] = [
  PRIVACY_LINK,
  ...resolveLinks(navigationData.footer.disclaimer.links),
]

/**
 * How the outside contributes: the code of conduct and the contributing
 * guidelines, both placeholders until the published pages exist.
 */
export const COMMUNITY_LINKS: readonly NavLink[] = resolveLinks(
  navigationData.footer.community.links,
)

/**
 * The three middle footer columns, in render order. Each entry is one column
 * of the grid: PRODUCTS and RESOURCES carry a single group each, and the third
 * stacks DISCLAIMER over COMMUNITY so the footer keeps five equal columns. The
 * brand column (the lockup alone) and the Contact column are rendered
 * separately, as they hold non-list content.
 */
export const FOOTER_COLUMN_GROUPS: readonly FooterColumnGroup[] = [
  [{ heading: navigationData.footer.products.heading, links: PRODUCT_LINKS }],
  [{ heading: navigationData.footer.resources.heading, links: RESOURCE_LINKS }],
  [
    { heading: navigationData.footer.disclaimer.heading, links: DISCLAIMER_LINKS },
    { heading: navigationData.footer.community.heading, links: COMMUNITY_LINKS },
  ],
]
