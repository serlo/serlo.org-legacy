<img src="https://assets.serlo.org/meta/logo.png" alt="Serlo logo" title="Serlo" align="right" height="60" />

# Serlo.org

[![Kanban board](https://img.shields.io/badge/Kanban-board-brightgreen.svg)](https://github.com/orgs/serlo/projects/1)

## Setup

You need [Docker](https://docs.docker.com/engine/installation/), [Node.js v10](https://nodejs.org) and [Yarn](https://yarnpkg.com) installed on your system.

Now follow the upcoming instructions.

### Clone

```sh
# Clone the project:
$ git clone https://github.com/serlo/serlo.org.git
$ cd serlo.org
```

### Bootstrap

On Linux or macOS, just open a terminal and run the following commands:

```sh
$ cp docker-compose.dist.yml docker-compose.yml
```

### Setting up hosts

On Windows, please add

```sh
127.0.0.1 de.serlo.localhost
127.0.0.1 en.serlo.localhost
```

to your `C:\Windows\System32\drivers\etc\hosts.txt` file. Then run `ipconfig /flushdns` in cmd.exe and
restart your browser.

On macOS:

```sh
$ sudo nano /etc/hosts

# add lines
127.0.0.1    de.serlo.localhost
127.0.0.1    en.serlo.localhost

# flush macOS DNS cache
$ sudo killall -HUP mDNSResponder
```

## Development

### Install dependencies

Run `yarn` to install the dependencies of all packages.

### Start

Run `yarn start` to start everything needed to run serlo.org locally.
Now, open [http://de.serlo.localhost:4567](http://de.serlo.localhost:4567). Happy coding!

### Testuser

You can use the following users at [http://de.serlo.localhost:4567](http://de.serlo.localhost:4567). Their names correspondend to the roles they have:

- `login`
- `german_reviewer`
- `german_helper`
- `admin`

### Stop

Interrupt the `yarn start` command to stop webpack and and run `yarn stop:server` to stop the docker containers.

### Repository structure

This repository is managed as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) consisting
of the following packages:

- `packages/private` contains helper packages for deployment and packages used by multiple other packages. Specifically:
  - `cloudflare` contains helpers to work with Cloudflare
  - `docker` handles building, tagging and deploying of our Docker images
  - `editor-helpers` (de-)stringifies editor states
  - `gcloud` contains helper sto to work with Google Cloud Platform
  - `legacy-editor-to-editor` converts legacy editor state to editor state
  - `markdown` defines our Serlo-flavored markdown as used in the legacy editor
- `packages/public` contains packages that are deployed somehow. Specifically:
  - `client` contains our assets used in the client (e.g. JavaScript bundle & stylesheet)
  - `cloudflare-workers` defines our Cloudflare Worker
  - `editor-renderer` is the server-side renderer for our editor
  - `legacy-editor-renderer` is the server-side-renderer for our legacy editor
  - `server` is the serlo.org backend
  - `static-assets` contains static assets (e.g. images)

### Other commands

- `yarn build` builds our packages (only needed for deployment)
- `yarn build:docker` builds our docker images (only needed for deployment)
- `yarn dump:sql` to update the docker initialization file of the sql database with the current database state
- `yarn format:js` formats all non-PHP source code
- `yarn format:php` formats all PHP source code (requires `yarn start` beforehand)
- `yarn lint:js` lints all non-PHP source code
- `yarn lint:php` lints all PHP source code (requires `yarn start` beforehand)
- `yarn mysql` connects to the running MySQL database (requires `yarn start` beforehand)
- `yarn rollback:sql` to reimport the `.sql` file which inititalizes the database. You can use this command to undo all changes you have done on the database.
- `yarn test:js` runs all non-PHP unit tests
- `yarn test:php` runs all PHP unit tests (requires `yarn start` beforehand)
- `yarn test:e2e` runs all end-to-end tests (requires `yarn start` beforehand)
  - Use `HEADLESS=false yarn test.e2e` when our e2e tests shall not use a headless browser.
  - Use `HEADLESS=false SLOWMO=<number> yarn test:e2e` when inside the e2e tests all actions shall be slowed down by `<number>` of milliseconds between them so that we see what happens.
- `yarn license` updates license headers in source files
- `yarn c` allows to run composer commands, see `yarn c --help` (requires `yarn start`)
- `yarn c-dev` allows to run composer commands (only used for dev tools), see `yarn c --help` (requires `yarn start`)
