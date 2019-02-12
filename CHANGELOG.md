# Changelog

All notable changes to this project will be documented in this file.

## [3.7.1](https://github.com/serlo/athene2-assets/compare/3.7.0..3.7.1) - February 12, 2019

### Fixed

- Fixed image upload in new editor

## [3.7.0](https://github.com/serlo/athene2-assets/compare/3.6.0..3.7.0) - February 2, 2019

### Changed

- Improved content styles

### Internal

- Move to CircleCI from Travis
- Use [@splish-me/changelog](https://github.com/splish/changelog) to generate changelogs

## [3.6.0](https://github.com/serlo/athene2-assets/compare/3.5.0..3.6.0) - January 22, 2019

### Added

- Content API: notify parent window of actual content dimensions
- Editor: shortcuts for undo/redo

### Fixed

- Editor: various fixes

## [3.5.0](https://github.com/serlo/athene2-assets/compare/3.4.0..3.5.0) - January 16, 2019

### Added

- H5P.com editor plugin

### Internal

- Upload `yarn.lock` with Google Cloud Function for consistent dependencies

## [3.4.0](https://github.com/serlo/athene2-assets/compare/3.3.0..3.4.0) - January 14, 2019

### Added

- Redirect from <https://start.serlo.org> to team overview document

### Changed

- Update `@serlo/editor` to 0.4.0

### Fixed

- Correct heading styles in new editor
- Set max file size limit of old image upload to 2MB
- Handle rewriting of <https://assets.serlo.org/meta> links correctly

### Internal

- Lazy load ReCAPTCHA

## [3.3.0](https://github.com/serlo/athene2-assets/compare/3.2.2..3.3.0) - December 2, 2018

### Changed

- Handle legacy GeoGebra applets more gracefully

### Fixed

- Fix text plugin

## [3.2.2](https://github.com/serlo/athene2-assets/compare/3.2.1..3.2.2) - December 2, 2018

### Internal

- Associate commit with Sentry release on deployment correctly

## [3.2.1](https://github.com/serlo/athene2-assets/compare/3.2.0..3.2.1) - December 2, 2018

### Fixed

- Always show consent banner on top

### Internal

- Associate commit with Sentry release on deployment

## [3.2.0](https://github.com/serlo/athene2-assets/compare/3.1.1..3.2.0) - December 1, 2018

### Added

- Add consent banner for privacy policy and terms of use (de.serlo.org only for now)

### Internal

- Add Sentry to monitor JavaScript runtime errors

## [3.1.1](https://github.com/serlo/athene2-assets/compare/3.1.0..3.1.1) - November 22, 2018

### Fixed

- Handle `ggt/{id}` links correctly

## [3.1.0](https://github.com/serlo/athene2-assets/compare/3.0.1..3.1.0) - November 18, 2018

### Added

- Style semantic elements in taxonomy

### Fixed

- Polyfill css class `.fa-1-5-x`

## [3.0.1](https://github.com/serlo/athene2-assets/compare/3.0.0..3.0.1) - October 31, 2018

### Changed

- Remove explicit target on `@babel/preset-env` so that [Browserlist's](https://github.com/browserslist/browserslist) recommended config is used

### Fixed

- Replace usages of `String.startsWith` for IE compatibility

## [3.0.0](https://github.com/serlo/athene2-assets/compare/2.0.4..3.0.0) - October 30, 2018

### Breaking Changes

- Removed `CommonsChunkPlugin`, i.e. there are no more `commons.js` and `common.css`
- Renamed `editor` to `legacy-editor`, i.e. one has to include `legacy-editor.js` resp. `legacy-editor.css` instead of `editor.js` resp. `editor.css`
- Asset bundle moved to `https://packages.serlo.org/athene2-assets@a/` resp. `https://packages.serlo.org/athene2-assets@b/` (blue-green deployment)
- Google Cloud Function moved to `https://europe-west1-serlo-assets.cloudfunctions.net/editor-renderer-a` resp. `https://europe-west1-serlo-assets.cloudfunctions.net/editor-renderer-b` (blue-green deployment)
- Needs an element with id `ory-editor-meta-data-wrapper` around the element with id `ory-editor-meta-data`

### Fixed

- Load all plugins in render server for new editor
- When server side rendering fails, still pass state down to client for improved debugging
- Hide double sidebar outside the editor

### Internal

- Dynamically import the new editor and its renderer. This leads to a much smaller bundle size for the initial load.
- Automated blue-green deployment of athene2-assets and server side renderer for new editor
- Automated deployment of Cloudflare workers
- Log version to browser console
- Add a content hash of length 8 to file names of chunks and assets (e.g. fonts and images)
- Upgrade to Webpack 4

## [2.0.4](https://github.com/serlo/athene2-assets/compare/bc6106e006b1633f5e6c15f6af2eef0443d8e81f..2.0.4) - September 28, 2018
