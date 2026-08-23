<div align = "center">

# Product Requirements Document (PRD)

</div>

<div align = "justify">

🚀 **`TyPhed - Engineering Tomorrow`** is a technology-driven brand built around privacy and data security. What sets us
apart is one core principle: we never track or share user data. As an end user of our products, you bring your own data,
or plug in a data connector, then analyse, build, fine-tune, and disconnect.

<div align = "center">

| Product Name | Document Version | Product Status |
| :---: | :---: | :---: |
| **TyPhed - Engineering Tomorrow** | v1.0.0-dev.0 | WIP |

</div>

## Product Overview

The platform will serve as the **central brand, marketing, SEO, and informational website** for the product ecosystem. Its
primary responsibility is to establish and communicate the parent brand identity, not to host the products themselves.

Each product will be deployed and operated under its own subdomain, allowing it to maintain its own technical architecture,
UX, and design requirements while remaining part of the same brand ecosystem. The main website will act as the
authoritative destination for:

  * Overall brand positioning, messaging, and visual identity,
  * Product ecosystem overview and discovery,
  * SEO-focused content and organic search visibility,
  * Marketing campaigns, landing pages, and conversion-oriented content,
  * Company/about information and brand communications,
  * Product documentation or high-level product information where appropriate,
  * Legal notices, terms, privacy policies, cookie policies, disclaimers, and related compliance content,
  * Cross-product navigation and links to the relevant product subdomains, and
  * Other trust, credibility, and informational content associated with the parent brand.

## Domain Architecture

The architecture follows a domain and subdomain model. Shared brand elements, such as the main layout and the primary
navigation links, stay consistent across every property. Everything else lives on its own subdomain, which keeps control
and maintenance simpler.

```text
  https://typhed.com/       → Brand, Marketing, SEO, Legal, and Informational Hub
  https://blog.typhed.com/  → Blog, Product Notes, and Example Documentation
```

The parent domain (this repository) should therefore be treated as the **brand and acquisition layer**, while each subdomain
hosts an independent product experience. The subdomains (i.e., products) are maintained in a separate repository and may or
may not be directly available here.

### Core Principle

The main website should not replicate or constrain the individual product interfaces. Instead, it should provide a
consistent brand foundation and a clear path from **discovery → trust → product selection → product experience**, while
allowing each product subdomain to evolve independently according to its own design and functional requirements.

The resulting ecosystem should feel like a **single, coherent brand with multiple purpose-built products**, rather than a
monolithic application containing every product experience.

</div>
