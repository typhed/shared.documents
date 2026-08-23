<div align = "center">

# TyPhed Brand And Design Reference

</div>

<div align = "justify">

The reference set every TyPhed property shares. Read the relevant page before changing anything it covers, rather than
inferring the rule from one site's code.

## 🧭 Brand

| Page | Covers |
| :---: | --- |
| [brand/PRD.md](brand/PRD.md) | The product requirements document: what the ecosystem is for, what belongs on the brand layer, and the principles behind it |
| [brand/subdomain-model.md](brand/subdomain-model.md) | The domain and subdomain architecture: DNS, one repository per property, custom domains, and single sign-on across them |

## 🎨 Design System

| Page | Covers | Source Of Truth |
| :---: | --- | :---: |
| [design/colors.yml](design/colors.yml) | Every theme token, its computed hex, where it is used, and the rules for changing it | [brand/tokens/colors.json](../brand/tokens/colors.json) |
| [design/spacing.yml](design/spacing.yml) | The step scale, container and gutters, breakpoints, vertical rhythm, component sizes, radius | [brand/tokens/spacing.json](../brand/tokens/spacing.json) |
| [design/typography.yml](design/typography.yml) | Fonts and how they load, the size scale, weights, tracking, heading semantics | [brand/tokens/typography.json](../brand/tokens/typography.json) |

The distinction in that last column matters. The YAML files **document** the system: they carry the computed hex values,
the usage notes, and the gotchas. The JSON files **are** the system: they are what the Tailwind preset reads at build
time. Change a value in the JSON, then update the YAML in the same commit so the two never disagree.

## 🧩 Component Reference

Component pages live with the code they describe, in
[typhed/shared.components](https://github.com/typhed/shared.components/tree/master/docs/components). Keeping them in one
repository is what lets a documentation fix ride along with the change that caused it.

## 🤖 Notes For Agents

  * These pages describe the brand across every property. A rule that applies to one site belongs in that site's own
    documentation, not here.
  * The design YAML files record file paths as they appear **from a consuming repository**, for example
    `shared/components/packages/ui/components/site-footer.tsx`. That is where the developer actually works.
  * A colour, spacing, or type change is never only a documentation change. Update the JSON token, the YAML reference,
    and any baked asset listed in the `static_assets` block of [design/colors.yml](design/colors.yml).

</div>
