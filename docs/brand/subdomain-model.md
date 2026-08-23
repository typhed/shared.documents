<div align = "center">

# The Domain And Subdomain Model

</div>

<div align = "justify">

How the TyPhed ecosystem is laid out across domains, repositories, and hosts. [PRD.md](PRD.md) says what belongs on the
brand layer and what belongs in a product; this page says where each one physically lives and why.

## The Shape

```text
  https://typhed.com/            Brand, marketing, SEO, legal, informational hub
  https://blog.typhed.com/       Blog, product notes, example documentation
  https://trading.typhed.com/    The trading product
```

The parent domain is the **brand and acquisition layer**. Each product runs on its own subdomain, in its own repository,
with its own architecture and hosting. What they share is the brand: the header, the footer, the colour system, the type
system, and the copy that names the company. That sharing is what
[shared.documents](https://github.com/typhed/shared.documents) and
[shared.components](https://github.com/typhed/shared.components) exist for.

## A Subdomain Is Not A Purchase

You already own `typhed.com`. A subdomain is a DNS record inside it, created in Cloudflare in seconds: a record named
`trading` creates `trading.typhed.com`. There is nothing to register and nothing to buy.

## One Repository Per Property

GitHub Pages serves one site per repository, and each repository carries one custom domain in its `CNAME` file. So every
property that wants its own subdomain needs its own repository:

| Property | Repository | `public/CNAME` |
| :---: | :---: | :---: |
| `typhed.com` | `typhed/typhed.github.io` | `typhed.com` |
| A product subdomain | its own repository | `<product>.typhed.com` |

Two files carry the hosting contract in any Pages repository and must survive every cleanup:

  * `CNAME`, which binds the custom domain on each deploy.
  * `.nojekyll`, empty on purpose. Without it Pages runs Jekyll, and Jekyll drops any directory whose name starts with an
    underscore, including Next.js's `_next`. The site deploys successfully and then loads with no CSS or JavaScript.

## Where A Product Actually Belongs

The brand site is a static export with no server, which is why it signs people in entirely in the browser. A real product
usually has to check a session on the server to protect private pages and data, and a static Pages export cannot do that.

So a product subdomain generally belongs on a host that runs server code, while the brand site stays on GitHub Pages.
Both still consume the same shared brand layer; only the hosting differs. That difference in hosting, not the brand, is
the real reason the homepage and a product stay separate projects.

## One Login Across Every Subdomain

A visitor who signs in on `typhed.com` should stay signed in everywhere. Clerk does this with **satellite domains**: one
Clerk application serves every property, `typhed.com` is the primary domain, and each product subdomain joins as a
satellite. Sign-in always happens on the primary domain, and the visitor is recognised on every satellite afterwards.

The outline for a new subdomain:

  1. In the Clerk Dashboard, under **Configure** then **Domains**, add the subdomain as a satellite and create the DNS
     records it shows you in Cloudflare.
  2. Configure that app as a satellite: it shares the same publishable key, marks itself a satellite, names its own
     domain, and points its sign-in link back to `typhed.com`.

The publishable key is public and ships in the browser bundle, so it is a build-time value rather than a secret. What
protects it is the allowed-domains setting, not hiding it. The Clerk **secret** key belongs nowhere in any of these
repositories, and must never be given a `NEXT_PUBLIC_` name.

## Adding A New Subdomain

  1. Create the repository and start from
     [templates/nextjs-subdomain/](https://github.com/typhed/shared.documents/tree/master/templates/nextjs-subdomain).
  2. Add both shared repositories as submodules and wire the workspace, per
     [MIGRATION.md](https://github.com/typhed/shared.documents/blob/master/MIGRATION.md).
  3. Put the subdomain in `public/CNAME` and keep `.nojekyll`.
  4. Create the DNS record in Cloudflare, set the custom domain in the repository's Pages settings, wait for the
     certificate, and enforce HTTPS.
  5. Add the Clerk satellite configuration if the property needs sign-in.

Anything specific to that product, including a stack that differs from the others, is documented in its own repository.
This page and the shared layer only cover what every property has in common.

</div>
