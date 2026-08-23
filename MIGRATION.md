<div align = "center">

# Migrating A Repository Onto The Shared Layer

</div>

<div align = "justify">

This page turns an existing TyPhed repository into a consumer of `shared.documents` and `shared.components`. It also
states plainly what the shared layer costs, because two of its properties surprise people.

For a brand new subdomain, start from [templates/nextjs-subdomain/](templates/nextjs-subdomain) instead; it already
contains everything below.

## Read This First: How Propagation Actually Works

A git submodule **pins an exact commit and never follows a branch on its own**. Cloning with `--recurse-submodules`
checks out the recorded commit, not the latest one. So "change the footer once and every subdomain updates" is not
something submodules give you for free. It comes from four deliberate choices:

| Mechanism | Effect |
| :---: | --- |
| `branch = master` in `.gitmodules` | `git submodule update --remote` fast-forwards to the branch tip |
| `pnpm shared:update` | Pulls the latest shared code into a local checkout on demand |
| A `--remote` step in CI | **Every build compiles the latest shared code, even when the recorded pointer is stale.** This is what makes propagation automatic |
| Dependabot `gitsubmodule` | Raises the pointer bump as a pull request so the recorded commit does not rot |

### Cost One: The Lockfile Cannot Stay Frozen

Floating the submodule can introduce a dependency the consumer's `pnpm-lock.yaml` has never seen, and
`pnpm install --frozen-lockfile` fails hard on exactly that. CI therefore installs with `--no-frozen-lockfile`.

The trade is real: builds are no longer reproducible from the consumer's commit SHA alone. If you would rather have
reproducibility than automatic propagation, delete the `--remote` step from the workflow and restore
`--frozen-lockfile`. Shared changes then reach the site only when you bump the pointer, which Dependabot will offer.

### Cost Two: One Bad Commit Breaks Every Property

Because every consumer floats to the branch tip, a broken commit in a shared repository breaks the next build of every
subdomain simultaneously. Mitigate it by keeping the shared repositories green, and remember the escape hatch above.

### Not Enabled: Instant Redeploy

`templates/nextjs-subdomain/notify-consumers.yml.disabled` fans a shared push out to every consumer as a
`repository_dispatch`, rebuilding and redeploying them immediately. It is shipped disabled on purpose: enabling it means
production deploys can happen without publishing a Release, which contradicts the release-only rule the brand site runs
on today. It also needs a personal access token in each shared repository. Enable it only if you want that trade.

## The Migration

### 1. Add The Submodules

```shell
$ git submodule add -b master https://github.com/typhed/shared.documents.git shared/documents
$ git submodule add -b master https://github.com/typhed/shared.components.git shared/components
$ git submodule update --init --recursive
```

Confirm `.gitmodules` records the branch for both. Without `branch`, `--remote` has nothing to follow:

```text
[submodule "shared/documents"]
	path = shared/documents
	url = https://github.com/typhed/shared.documents.git
	branch = master
```

### 2. Delete What Moved

Remove the local copies now served by the submodules: the `packages/` directory, the design and component
documentation, the PRD, and the brand artwork under `public/`. Use `git rm -r` so the removals are staged and stay
recoverable from history.

### 3. Point The Workspace At The Submodules

```yaml
packages:
  - "apps/*"
  - "shared/components/packages/*"
  - "shared/documents/brand"
```

### 4. Add The Lifecycle Scripts

In the root `package.json`:

```json
{
  "scripts": {
    "shared:update": "git submodule update --remote --merge && pnpm install",
    "shared:status": "git submodule foreach --quiet \"echo [$name] && git status --short --branch\"",
    "postinstall": "git submodule update --init --recursive"
  }
}
```

The `postinstall` entry makes a plain `git clone` self-heal: anyone who forgets `--recurse-submodules` gets the
submodules populated by their first `pnpm install`.

In the app's `package.json`, prepare the shared layer before dev and build. This copies the brand artwork and
generates the theme stylesheet from the colour tokens:

```json
{
  "scripts": {
    "sync:shared": "node ../../shared/documents/scripts/sync-shared.mjs --assets public/brand --theme app/theme.css",
    "predev": "pnpm run sync:shared",
    "prebuild": "pnpm run sync:shared"
  }
}
```

Add both `public/brand/` and `app/theme.css` to `.gitignore`. They are generated now, and editing either directly is a
change that gets overwritten on the next build.

Import the generated stylesheet in the root layout, before the app's own global stylesheet:

```tsx
import "./theme.css"
import "./globals.css"
```

**Why the palette is a generated file rather than a Tailwind plugin.** Emitting it from the preset works on a clean
build and fails quietly on an incremental one: a bundler tracks the CSS files it compiles, but not JSON that the
Tailwind config happens to `require`. Changing a colour then produced correct output in CI and stale colours locally,
which is the exact failure this shared layer exists to prevent. A real stylesheet is part of the module graph, so the
cache invalidates when it should. An app that skips the generate step gets no colours at all, which fails loudly.

### 5. Repoint The Build Configuration

| File | Change |
| :---: | --- |
| `next.config.mjs` | `transpilePackages: ["@typhed/ui", "@typhed/brand"]` |
| `tailwind.config.ts` | Content glob becomes `"../../shared/components/packages/ui/components/**/*.{ts,tsx}"` |
| `app/globals.css` | Delete the `:root` and `.dark` token blocks. The generated `theme.css` carries them now |
| Every import of the old constants file | Becomes `from "@typhed/brand"` |

Missing the Tailwind glob is the failure that does not announce itself: the build succeeds and the shared components
render with their classes silently absent.

### 6. Thin The CLAUDE.md

Open the file with the shared fragments, then keep only what is true of this repository:

```markdown
# CLAUDE.md

@shared/documents/claude/brand.md
@shared/documents/claude/conventions.md
@shared/documents/claude/shared-workflow.md

## What This Repo Is

...
```

Relative imports resolve from the file containing them and stay inside the working directory, so no approval prompt
appears. Run `/context` in a fresh session and confirm the three fragments are listed under **Memory files**.

### 7. Update CI

```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    submodules: recursive

- name: Follow the shared branches
  run: |
    git submodule foreach git fetch --tags origin
    git submodule update --remote --merge
    git submodule status

- name: Install Dependencies
  run: pnpm install --no-frozen-lockfile
```

The explicit `fetch` matters: `actions/checkout` clones submodules shallow, and `--remote` needs the branch ref present
before it can fast-forward.

## Verifying The Migration

  1. `pnpm install && pnpm typecheck && pnpm lint` are clean.
  2. The production build succeeds and the export contains `public/brand` artwork.
  3. The built CSS contains the theme custom properties on `:root` and `.dark`, and any utility used only by a shared
     component. If the tokens are missing the generated `theme.css` is not imported; if the utilities are missing the
     content glob is wrong.
  4. The rendered markup matches the pre-migration build.
  5. Propagation works end to end. Change a string in `shared/documents/brand/navigation.json` **and** a colour in
     `brand/tokens/colors.json`, rebuild **without clearing any cache**, and confirm both appear with no edit to the
     consumer. Test the colour specifically: it is the one that used to go stale.

## Rolling Back

The shared layer is additive and reversible. `git submodule deinit -f shared/documents shared/components` and restoring
the deleted directories from history returns the repository to a standalone checkout.

</div>
