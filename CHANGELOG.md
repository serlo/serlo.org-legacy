# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- Dynamically import the new editor and its renderer. This leads to a much smaller bundle size for the initial load.
- Log version to browser console

### Changed

- Upgrade to Webpack 4

### Fixed

- Load all plugins in render server for new editor
- When server side rendering fails, still pass state down to client for improved debugging

### Breaking Changes

- Removed `CommonsChunkPlugin`, i.e. there are no more `commons.js` and `common.css`
- Renamed `editor` to `legacy-editor`, i.e. one has to include `legacy-editor.js` resp. `legacy-editor.css` instead of `editor.js` resp. `editor.css`

## [2.0.4] - 2017-09-28

[unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/6f69feb2bd6d4da735e760d3d640717b900f5959...HEAD
[2.0.4]: https://github.com/serlo-org/athene2-assets/commit/6f69feb2bd6d4da735e760d3d640717b900f5959
