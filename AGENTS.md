# AGENTS.md

> Guidance for AI coding assistants working on this repository.

## Project Overview

**Selective Bookmarks Export Tool** (`free-export-bookmarks`) is a browser extension that lets users choose which bookmarks to export as an HTML file, control the structure of the exported content, and filter bookmarks by keyword while selecting.

It is a cross-browser extension targeting **Chrome**, **Firefox**, and **Edge**, each distributed through its respective add-on store.

## Tech Stack

- **Language:** TypeScript (strict mode)
- **UI framework:** Vue 3 — Composition API with `<script setup lang="ts">`
- **Component library:** Element Plus, plus `@element-plus/icons-vue`
- **Build tool:** Vite
- **State management:** Pinia
- **Package manager:** pnpm

## Tooling

| Purpose | Tool | Command |
| --- | --- | --- |
| Linting | ESLint (flat config — `eslint.config.mjs`) | `pnpm run lint` |
| Formatting | Prettier (`.prettierrc`) | `pnpm run lint` |
| Type checking | `vue-tsc` | `pnpm run test` |
| Unit testing | Mocha (BDD, with Chai assertions and `jsdom-global`) | `pnpm run test` |

- `pnpm run test` — runs `vue-tsc` for type checking, then Mocha. Specs match `test/**/*.spec.ts`.
- `pnpm run lint` — runs `eslint . --fix`, then `prettier --write` over `{src,test}/**/*.{js,mjs,cjs,ts,vue,css}`.

Prettier rules in effect: single quotes, avoided arrow parens, semicolons, `printWidth: 160`, auto line endings.

## Common Commands

- `pnpm install` — install dependencies
- `pnpm run build:c` / `build:f` / `build:e` — production build for Chrome / Firefox / Edge (zips land in `archive/`)
- `pnpm run watch:c` / `watch:f` / `watch:e` — development watch builds (output in `dist/`)
- `pnpm run test` — type check + unit tests
- `pnpm run lint` — lint fix + format
- `pnpm run release` — bump version via `standard-version`

Builds are parameterized by the `BROWSER_ENV` environment variable (`chrome` | `firefox` | `edge`).

## Repository Layout

```palin
src/
├── index/          # Popup UI entry (App.vue, index.html, index.ts)
├── background/     # Background service worker
├── components/     # Reusable Vue components (e.g. BSettingsDrawer.vue)
├── stores/         # Pinia stores (e.g. settings.ts)
├── common/         # Shared helpers (i18n.ts, tools.ts)
├── manifest/       # Per-browser manifest.json (chrome/ edge/ firefox/)
├── assets/         # Static assets, copied to build root; holds _locales/
├── img/            # Extension icons
└── vite.d.ts
test/               # Mocha specs (*.spec.ts) + expected fixtures
```

## Development Guidelines

- **Follow the existing code style.** Match the code surrounding your change; do not introduce new patterns or dependencies without reason.
- **Keep changes small and focused.** Minimize the diff and concentrate on the task at hand.
- **Check existing files before introducing new structures.** Reuse the existing helpers (`src/common/`), stores (`src/stores/`), and components (`src/components/`) first.
- **Do not refactor unrelated code.** Leave working code outside the scope of your change untouched.
- **Use kebab-case for component element names in Vue templates** — write `<my-component>` rather than `<MyComponent>`. Component filenames and script-level imports stay PascalCase (e.g. file `BSettingsDrawer.vue`, template `<b-settings-drawer>`).
- **Import via the `@` path alias** — `@` maps to `src/` (e.g. `import i18n from '@/common/i18n';`).
- **Element Plus `el-*` components are auto-imported** via `unplugin-vue-components`; do not import them explicitly. Icons (`@element-plus/icons-vue`) and imperative services (`ElMessage`, `ElLoading`) are imported explicitly — follow the existing pattern in nearby files. `auto-imports.d.ts` and `components.d.ts` are generated; never edit them by hand.
- **Never hardcode user-facing text.** Localization goes through `chrome.i18n.getMessage`, wrapped by `src/common/i18n.ts`. Add strings to the locale message files under `src/assets/_locales/{en,zh_CN,zh_TW}/messages.json` and reference them by key (e.g. `i18n('indexExportText')`).
- **Branch browser-specific code on build-time env** — use `import.meta.env.IS_CHROMIUM` or `import.meta.env.BROWSER` (see `BSettingsDrawer.vue`), not runtime sniffing. `import.meta.env.VERSION` exposes the package version.

## Verification

Whenever you modify source code, before finishing:

1. Run `pnpm run test` — confirm type checking passes and all unit tests are green. Add or update specs under `test/` to cover your changes where reasonable.
2. Run `pnpm run lint` — apply lint fixes and formatting.
