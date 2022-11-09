<img src="https://raw.githubusercontent.com/serlo/frontend/staging/public/_assets/img/serlo-logo-gh.svg" alt="Serlo Logo" title="Serlo" align="right" height="75" />

# serlo.org

Monolith that still serves parts of [serlo.org](https://serlo.org). Head over to
[api.serlo.org](https://github.com/serlo/api.serlo.org) and
[frontend](https://github.com/serlo/frontend) for new development.

<a href="https://github.com/orgs/serlo/projects/1"><img align="right" src="https://img.shields.io/badge/Kanban-board-brightgreen.svg" alt="Kanban board"></a>

## Setup

You need [Docker](https://docs.docker.com/engine/installation/),
[Node.js v16](https://nodejs.org) and [Yarn](https://yarnpkg.com) installed on
your system.

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

to your `C:\Windows\System32\drivers\etc\hosts.txt` file. Then run
`ipconfig /flushdns` in cmd.exe and restart your browser.

On macOS / Unix:

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

Run `yarn start` to start everything needed to run serlo.org locally. Now open
[http://de.serlo.localhost:4567](http://de.serlo.localhost:4567). Happy coding!

### Test users

You can use the following users at
[http://de.serlo.localhost:4567](http://de.serlo.localhost:4567). The password
for all users is `123456`. Their names correspond to the roles they have:

- `login`
- `german_reviewer`
- `german_helper`
- `english_langhelper`
- `admin`

### Stop

Interrupt the `yarn start` command to stop webpack and run `yarn stop:server` to
stop the docker containers.

### Repository structure

This repository is managed as a
[monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md)
consisting of the following packages. Check out their READMEs for
package-specific details:

- `packages/private` contains helper packages for deployment and packages used
  by multiple other packages. Specifically:
  - `cloudflare` contains helpers to work with Cloudflare
  - `dev-tools` contains npm packages that are only needed for development (to
    speed up builds of docker images)
  - `docker` handles building, tagging and deploying of our Docker images
  - `editor-helpers` (de-)stringifies editor states
  - `edtr-io` contains the Edtr.io integration
  - `edtr-io-storybook` contains a Storybook to start the Edtr.io integration in
    isolation
  - `gcloud` contains helpers to work with Google Cloud Platform
  - `legacy-editor-to-editor` converts legacy editor state to editor state
  - `markdown` defines our Serlo-flavored markdown as used in the legacy editor
  - `mathjax` contains helpers to work with Mathjax
- `packages/public` contains packages that are deployed somehow. Specifically:
  - `client` contains our assets used in the client (e.g. JavaScript bundle &
    stylesheet)
  - `editor-renderer` is the server-side renderer for our editor
  - `legacy-editor-renderer` is the server-side renderer for our legacy editor
  - `notifications-job` handles the delivery of notification emails
  - `server` is the serlo.org backend
  - `static-assets` contains static assets (e.g. images)

### Other commands

- `yarn build` builds our packages (only needed for deployment)
- `yarn deploy:images` deploys the docker images to our Container Registry (only
  needed for deployment)
- `yarn deploy:packages` deploys the packages to our Package Registry (only
  needed for deployment)
- `yarn format` formats all source code
- `yarn lint` lints all source code
- `yarn license` updates license headers in source files
- `yarn mysql` connects to the running MySQL database (requires `yarn start`
  beforehand)
- `yarn mysql:dump` updates the docker initialization file of the sql database
  with the current database state (requires `yarn start` beforehand)
- `yarn mysql:import-anonymous-data` imports the latest anonymized dump
  (requires `yarn start` beforehand, only works on Unix currently)
- `yarn mysql:rollback` resets the database (requires `yarn start` beforehand)
- `yarn oauth` runs a OAuth workflow to manually test Hydra integration
- `yarn test:e2e` runs all end-to-end tests (requires `yarn start` beforehand)
  - Use `HEADLESS=false yarn test:e2e` to run the tests in an actual browser.
  - Use `HEADLESS=false SLOWMO=<number> yarn test:e2e` to introduce a `<number>`
    of milliseconds delay between actions in tests.
- `yarn test:js` runs all non-PHP unit tests
- `yarn test:php` runs all PHP unit tests
- `yarn migrate:up` runs all the database migration scripts
- `yarn c` allows running composer commands, see `yarn c --help`
- `yarn start` spins up the development environment
