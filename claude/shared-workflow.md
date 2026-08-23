# Working With The Shared Submodules

<!-- Imported into every TyPhed repository's CLAUDE.md via @shared/documents/claude/shared-workflow.md.
     Loads into context every session; keep it short. -->

Every TyPhed repository mounts two shared repositories as git submodules:

| Path | Repository | Holds |
| :---: | :---: | --- |
| `shared/documents/` | `typhed/shared.documents` | The `@typhed/brand` contract, design tokens, brand docs, brand assets, these CLAUDE.md fragments |
| `shared/components/` | `typhed/shared.components` | `@typhed/ui`, `@typhed/tailwind-config`, `@typhed/tsconfig`, and the component reference docs |

Both are pnpm workspace packages in the consuming repository, so `@typhed/ui` and `@typhed/brand`
import exactly as they always did. Nothing about the import paths reveals that they live in a
submodule.

## The Rule That Matters

**Editing a file under `shared/` changes every TyPhed property, not just this one.** A submodule is a
checkout of another repository, so a change there is not part of this repository's commit. It has to
be committed and pushed in the shared repository itself.

When you change something under `shared/`:

  1. Say so explicitly in your summary. The user needs to know the blast radius reaches other sites.
  2. Commit inside the submodule directory, not from the parent repository.
  3. Push that commit before the change can reach any other property.

If a change is only right for this one site, it does not belong under `shared/`. Put it in this
repository instead.

## Commands

| Command | What It Does |
| :---: | --- |
| `pnpm shared:update` | Fast-forward both submodules to their branch tip and reinstall. Run it when a shared change should land here. |
| `pnpm shared:status` | Show whether either submodule has uncommitted or unpushed work. Run it before finishing a task that touched `shared/`. |
| `git submodule update --init --recursive` | Populate the submodules after a clone that forgot `--recurse-submodules`. `pnpm install` runs this for you. |

## Gotchas

  * **A submodule pins a commit, and this repository records that pin.** The CI build floats to the
    branch tip so shared changes propagate without a pointer bump, but a local checkout stays on the
    recorded commit until you run `pnpm shared:update`. If shared code looks stale locally, that is
    why.
  * **An empty `shared/` directory means the submodules were never initialised.** The `@import` lines
    at the top of `CLAUDE.md` resolve to nothing, the workspace loses `@typhed/ui` and `@typhed/brand`,
    and the build fails on unresolved imports. Run `git submodule update --init --recursive`.
  * **Brand assets are generated, not committed.** `public/brand/` is copied from
    `shared/documents/assets/brand/` before every build and is gitignored. Edit the artwork in the
    shared repository, never in `public/`.
