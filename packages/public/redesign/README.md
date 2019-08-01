# Athene2 bluegum

Complete rework of the current Athene2 design with a focus on responsive, mobile first.

The idea is to develop the html+css parts with quicker tools and then move this into athene2 when the template is done.

## Demo

- https://athene2-blue-gum.netlify.com

---

## Quick Start

```
# 1 Clone this repo
git clone https://github.com/serlo/athene2-blue-gum.git

# 2 Navigate into the repo directory
cd athene2-blue-gum

# 3 Install all node packages
yarn

# 4a Development mode next.js (with ssr)
yarn next

# 4b Storybook
yarn start

# 5 Run Linter
yarn lint

# 6 Build and Serve
yarn next:build
yarn next:start
```

Directory overview: `src` contains react components, `static` contains font files, `pages` and `.next` are related to next.js, `__stories__` and `.storybook` are related to storybook.
