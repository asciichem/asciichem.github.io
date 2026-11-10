# 16 — CI and release

- **Priority:** P3
- **Status:** pending
- **Depends on:** 06, 09

## Motivation

Lock in quality before the project grows. CI runs specs on every PR for
the gem and builds the site on every PR for the site repo. Release
process documented so version bumps are reproducible.

## Scope

`../asciichem-ruby/.github/workflows/`:

- `ci.yml` — matrix MRI 3.2 / 3.3 / 3.4. `bundle install`, `bundle exec
  rspec`, `bundle exec rubocop`. Caches based on `Gemfile.lock`.

`asciichem.github.io/.github/workflows/`:

- `ci.yml` — on PR: `npm ci`, `npm run check`, `npm run build`. No
  deploy.
- `deploy-pages.yml` — on push to `main`: build, upload `dist/` as
  Pages artifact, deploy. Uses
  `actions/configure-pages@v4` + `actions/upload-pages-artifact@v3` +
  `actions/deploy-pages@v4`.

`../asciichem-ruby/RELEASING.md`:

- Bump `lib/asciichem/version.rb`.
- Update `CHANGELOG.md`.
- `bundle exec rake build`, `gem push pkg/asciichem-X.Y.Z.gem`.
- Tag `vX.Y.Z` (the user decides when to tag — global rule).

## Acceptance

- Gem CI green on main.
- Site CI green on PRs.
- Deploy workflow serves `www.asciichem.org` (verify via Pages
  dashboard after first deploy — out of scope for code review).
