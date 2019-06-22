# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Internal

- Cleaned up configuration files, local configuration is now set in `src/config/definitions.local.php`
- Added `Dockerfile`s for web and php server. Were possible, we use the same base configurations in development. Mind
  the changes to `docker-compose.yml`.

## [Build 8] - 2019-02-20

### Fixed

- Upload all images required for new tenants
- Send notification emails correctly

### Internal

- Downgrade PHP version in dev environment to PHP 7.0.33 to match version on production servers
- Execute PHP stuff (e.g. Composer, PHPUnit) in a Docker Container with PHP 7.0.33
- Automatically deploy assets (mind the changes in `develop.local.dist.php`)

## [Build 7] - 2019-02-18

### Added

- Add hindi (hi) and spanish (es) tenants. Locally needs a database update before using! ([#807](https://github.com/serlo/athene2/pull/724))

### Changed

- Improved compliance with spam guidelines
- Improved welcome email
- Improved notification email

### Internal

- Add mock mail adapter to test emails in development environment (see changed `src/config/autoload/develop.local.dist.php`)

## [Build 6] - 2019-01-14

### Added

- Add unit tests based on PHPUnit ([#824](https://github.com/serlo/athene2/pull/824))
  - Add yarn script `unit` that executes `./src/vendor/bin/phpunit`
- Pass CSRF token down
- Verify ReCAPTCHA tokens on server
- Specify Sentry release

## [Build 5] - 2018-12-01

### Added

- Add meta title to courses ([#814](https://github.com/serlo/athene2/pull/814))
- Add share option to exercises ([#815](https://github.com/serlo/athene2/pull/815))
- Add Sentry to monitor PHP runtime errors ([#816](https://github.com/serlo/athene2/pull/816))
- Add versionized privacy policies ([#821](https://github.com/serlo/athene2/pull/821))

### Changed

- Update privacy policy because of switch from Fundraisingbox to twingle ([#821](https://github.com/serlo/athene2/pull/821))

### Fixed

- Display fields in compare view correctly ([#820](https://github.com/serlo/athene2/pull/820))

## [Build 4] - 2018-11-22

### Added

- New donation page using twingle ([#810](https://github.com/serlo/athene2/pull/810))

### Changed

- Build markdown service from `src/athene2-editor-server` and use Node v10 ([#809](https://github.com/serlo/athene2/pull/809))

### Removed

- Remove remaining Vagrant files ([#810](https://github.com/serlo/athene2/pull/810))

### Fixed

- Handle `ggt/{id}` links correctly ([#806](https://github.com/serlo/athene2/pull/806))

### Breaking Changes

- Production server needs Node v10

## [Build 3] - 2018-11-16

### Added

- Improved title in entities (e.g. automated " - lernen mit Serlo" suffix) ([#678](https://github.com/serlo/athene2/pull/678))
- Add `package.json` so that we can use `yarn` as task runner ([#785](https://github.com/serlo/athene2/pull/785))
- Add yarn script `start` that executes `docker-compose up` ([#785](https://github.com/serlo/athene2/pull/785))
- Add yarn script `format:prettier` that executes prettier (formats Markdown, YAML, JSON, etc.) ([#785](https://github.com/serlo/athene2/pull/785))
- Add yarn script `format:php` that executes php-cs-fixer (formats PHP according to PSR-2 with some additional rules) ([#785](https://github.com/serlo/athene2/pull/785))
- Add yarn script `license` that handles license headers in our source code files ([#785](https://github.com/serlo/athene2/pull/785))
- Add yarn script `e2e` that opens Cypress for end-to-end testing ([#800](https://github.com/serlo/athene2/pull/800))
- Enable Xdebug remote support in Dockerfile, see [Starting The Debugger](https://xdebug.org/docs/remote#starting) on how to start a Xdebug remote session ([#801](https://github.com/serlo/athene2/pull/801))

### Changed

- Make list of unrevised revisions (e.g. https://de.serlo.org/mathe/entity/unrevised) faster ([#790](https://github.com/serlo/athene2/pull/790), [#780](https://github.com/serlo/athene2/pull/780))
- Show all unrevised revisions of an entity (and not only the newest one) ([#790](https://github.com/serlo/athene2/pull/790))
- Show a subject-specific Open Graph meta image (e.g. for Facebook previews) ([#678](https://github.com/serlo/athene2/pull/678))
- Expose a tenant-specific Open Search description file ([#678](https://github.com/serlo/athene2/pull/678))
- Link to new "Nachhaltigkeit" starting page ([#796](https://github.com/serlo/athene2/pull/796))
- Rename `*.php.dist` files to `*.dist.php` for better IDE support ([#801](https://github.com/serlo/athene2/pull/801))
- Improve performance of Docker Volumes on macOS ([#801](https://github.com/serlo/athene2/pull/801))

### Removed

- Disable special characters (e.g. `<`, `*`) in entities' fields (e.g. title, reasoning) again until we resolve the issue this caused ([#797](https://github.com/serlo/athene2/pull/797))

### Fixed

- Fix issues in PHPDoc comments causing false-positives in some IDEs ([#798](https://github.com/serlo/athene2/pull/798))

### Breaking Changes

- Rename `docker-compose.yml` to `docker-compose.dist.yml` since it now contains some OS-specific options and gitignore `docker-compose.yml` ([#801](https://github.com/serlo/athene2/pull/801))

## [Build 2] - 2017-10-30

This release uses athene2-assets@3 (blue) ([Changelog](https://github.com/serlo/athene2-assets/blob/master/CHANGELOG.md))

### Added

- Allow special characters (e.g. `<`, `*`) in entities' fields (e.g. title, reasoning) ([#729](https://github.com/serlo/athene2/pull/729))
- Hide trashed entities and dead nodes in sorting actions (e.g. sorting of course pages) ([#752](https://github.com/serlo/athene2/pull/752))
- Allow sorting of trashed entities by timestamp ([#763](https://github.com/serlo/athene2/pull/763))
- Allow embedding of videos from BR Mediathek ([#775](https://github.com/serlo/athene2/pull/775))
- Add content type as meta data ([#777](https://github.com/serlo/athene2/pull/777))

### Changed

- Update translations ([#769](https://github.com/serlo/athene2/issues/769))
- Make [trash bin](https://de.serlo.org/uuid/recycle-bin) faster ([#763](https://github.com/serlo/athene2/pull/763))
- Enable newsletter pop-up on [Ressourcen für PädagogInnen](https://de.serlo.org/community/ressourcen-paedagoginnen) ([#778](https://github.com/serlo/athene2/pull/778))

### Fixed

- Using the same page alias on two different language tenants works as intended now ([#738](https://github.com/serlo/athene2/pull/738))
- Translate all strings used in the registration form ([#760](https://github.com/serlo/athene2/issues/760))
- Fix title on starting page ([#767](https://github.com/serlo/athene2/issues/767))
- Show only one side bar on entities' pages ([#771](https://github.com/serlo/athene2/issues/771))

## [Build 1] - 2017-10-05

[unreleased]: https://github.com/serlo/athene2/compare/7...HEAD
[build 7]: https://github.com/serlo/athene2/compare/6...7
[build 6]: https://github.com/serlo/athene2/compare/5...6
[build 5]: https://github.com/serlo/athene2/compare/4...5
[build 4]: https://github.com/serlo/athene2/compare/3...4
[build 3]: https://github.com/serlo/athene2/compare/2...3
[build 2]: https://github.com/serlo/athene2/compare/e485b49b632799c6011e9ddf0be1efa56325a7ab...2
[build 1]: https://github.com/serlo/athene2/commit/e485b49b632799c6011e9ddf0be1efa56325a7ab
