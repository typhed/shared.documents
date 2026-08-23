# TyPhed Brand Context

<!-- Imported into every TyPhed repository's CLAUDE.md via @shared/documents/claude/brand.md.
     It loads into context at the start of every session, so keep it short and factual.
     Anything true of only one repository belongs in that repository's own CLAUDE.md. -->

This is shared context for every repository in the TyPhed ecosystem. It describes the brand and the
domain model, not any single codebase.

## The Ecosystem

TyPhed is a technology brand owned by **Debmalya Pramanik HUF**, positioned on privacy and data
security. The architecture is a domain and subdomain model:

  * `typhed.com` is the **brand and acquisition layer**: brand positioning, the product ecosystem
    overview, SEO and marketing content, company information, high-level product information, legal
    and compliance pages, and cross-product navigation. It is not a product host.
  * Each product runs on **its own subdomain, in its own repository**, free to choose its own
    architecture, UX, and design. `blog.typhed.com` carries the blog, product notes, and example
    documentation. `trading.typhed.com` is the trading product.

The full product requirements document is
[docs/brand/PRD.md](https://github.com/typhed/shared.documents/blob/master/docs/brand/PRD.md), and the
hosting and DNS shape is in
[docs/brand/subdomain-model.md](https://github.com/typhed/shared.documents/blob/master/docs/brand/subdomain-model.md).
Read the PRD before adding a page, a route, or a feature: most "does this belong here?" questions are
answered there and nowhere in the code.

The rule that follows from the model: **a feature that belongs to one product does not belong on the
brand layer, and brand-level content does not belong inside a product.** Build the path from discovery
to trust to product selection on `typhed.com`, and leave the product experience to the product
subdomain.

## The Privacy Principle Has Teeth

TyPhed never tracks or shares user data. Users bring their own data or plug in a connector, analyse,
build, fine-tune, and disconnect.

Adding an analytics script, a tracking pixel, session recording, or any third-party tag that observes
visitors is therefore a **brand decision, not a routine one**, in every TyPhed repository. Raise it
with the user rather than wiring it in.

## One Source Of Truth For Brand Content

Brand copy, navigation, footer links, social links, the launch schedule, and the colour, spacing and
type tokens all live in the `@typhed/brand` contract in the `shared.documents` repository, mounted as
a submodule at `shared/documents/`.

Never hardcode a brand string, a nav item, a footer link, or a colour into a component or a page.
Change the JSON in `shared/documents/brand/`, and every property picks it up on its next build.
