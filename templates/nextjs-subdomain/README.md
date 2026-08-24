<div align = "center">

# New Subdomain Bootstrap

</div>

<div align = "justify">

Everything a new TyPhed subdomain repository needs in order to consume the shared brand layer. Copy these files into the
new repository, then follow [MIGRATION.md](../../MIGRATION.md) from step 1.

## What To Copy Where

| File | Copy to | Then |
| :---: | :---: | --- |
| [.gitmodules](.gitmodules) | repository root | Or let `git submodule add -b master ...` write it for you |
| [pnpm-workspace.yaml](pnpm-workspace.yaml) | repository root | Merge with the app globs this property needs |
| [CLAUDE.md](CLAUDE.md) | repository root | Fill in the bracketed sections; keep the three imports at the top |
| [PRD.md](PRD.md) | `docs/` | Fill in the bracketed sections. This property's requirements live here, not in the shared layer |
| [deploy.yml](deploy.yml) | `.github/workflows/` | Adjust the app filter and add any property-specific steps |
| [dependabot.yml](dependabot.yml) | `.github/` | No changes needed |
| [notify-consumers.yml.disabled](notify-consumers.yml.disabled) | a **shared** repository, not here | Read the header first; it ships disabled deliberately |

## The Order That Works

  1. Create the repository and add both submodules.
  2. Copy `pnpm-workspace.yaml`, the workflow files, and `PRD.md` into `docs/`.
  3. Scaffold the app under `apps/`, depending on `@typhed/ui` and `@typhed/brand` with `workspace:*`.
  4. Add the lifecycle scripts and the brand asset sync from
     [MIGRATION.md](../../MIGRATION.md) step 4.
  5. Put the subdomain in `public/CNAME`, keep `.nojekyll`, and wire DNS per
     [subdomain-model.md](../../docs/brand/subdomain-model.md).
  6. Write the PRD before the first feature. It is what settles whether a page belongs on this property at all, and it
     is far cheaper to answer once than to argue per pull request.
  7. Run the verification checklist at the end of `MIGRATION.md` before the first deploy.

## The Two Mistakes Worth Naming

  * **Forgetting the Tailwind content glob** for `shared/components/packages/ui/components`. The build succeeds and the
    shared components render with their classes silently missing. Nothing warns you.
  * **Forgetting `branch = master` in `.gitmodules`.** Without it `git submodule update --remote` has nothing to follow,
    so the property quietly stops receiving shared changes while appearing to be wired correctly.

</div>
