<img src="https://assets.serlo.org/meta/logo.png" alt="Serlo logo" title="Serlo" align="right" height="60" />

# Athene2

[![Build status](https://img.shields.io/circleci/project/github/serlo/athene2.svg)](https://circleci.com/gh/serlo/athene2) [![Kanban board](https://img.shields.io/badge/Kanban-board-brightgreen.svg)](https://github.com/orgs/serlo/projects/1)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
  - [Clone the project](#clone-the-project)
  - [Now you can start the cluster](#now-you-can-start-the-cluster)
  - [Bootstrapping the project](#bootstrapping-the-project)
  - [Setting up hosts](#setting-up-hosts)
- [Development](#development)
- [Further resources](#further-resources)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

You need [Docker](https://docs.docker.com/engine/installation/), [Node.js v10](https://nodejs.org) and [Yarn](https://yarnpkg.com) installed on your system.

Now follow the upcoming instructions.

### Clone the project

```sh
# Clone the project:
$ git clone https://github.com/serlo/athene2.git
$ cd athene2
```

### Bootstrapping the project

On Linux or macOS, just open a terminal and run the following commands:

```sh
# Copy files
$ cp docker-compose.dist.yml docker-compose.yml
$ cp src/config/definitions.local.dist.php src/config/definitions.local.php
```

### Starting docker-compose

```sh
$ yarn start
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

Now, open [de.serlo.localhost:4567](de.serlo.localhost:4567). Happy coding!

PS: `de.serlo.localhost:4567` works for me in Chrome but not in FireFox. Not sure why, but if it doesn't work try
a different browser.

## Development

Development is straight forward, make your changes to the php files and then reload the browser. Done!

If you want to modify the assets (e.g. `.css`, `.js` files), you will also have to clone and set up https://github.com/serlo/athene2-assets. Before that, make sure you have [yarn](https://yarnpkg.com/en/docs/install) installed:

```sh
$ git clone https://github.com/serlo/athene2-assets
$ cd athene2-assets
$ yarn
$ yarn start
```

Furthermore, set `assets_host` to the url of webpack dev server in `src/config/autoload/develop.local.php`:

```php
return [
    // ...
    'assets_host' => 'http://localhost:8081/'
];
```

Changes to the assets will automatically reload the browser.

## Further resources

Most of these are outdated:

- [Knowledge base](https://github.com/serlo/athene2/wiki/Knowledge-base)
- [Testing](https://github.com/serlo/athene2/wiki/Testing)
- [Development workflow (outdated)](https://github.com/serlo/athene2/wiki/Development-workflow)
- [Installation (totally outdated, do not look at this)](https://github.com/serlo/athene2/wiki/Installation)
- [Athene2 Guide (somewhat outdated)](https://serlo.github.io/athene2-guide/)
