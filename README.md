## Project

This project uses Nunjucks templating engine. Using gulp task a static files for
the `jkguidaven.github.io` website is generated.

## Prerequisites

- [Node](https://nodejs.org/en/) (at least the latest LTS)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/) (at least 1.0)

## Setting Up

```bash
# 1. Clone this repository.
git clone git@github.com:jkguidaven/jkguidaven.github.io-source.git

## 2. Install dependencies
yarn install

## 3. Build template and watch new changes in
yarn start
```

## To build

```bash
yarn build
```

The build will generate all css, js and index.html files and store it in `dest` folder.

## Continuous Integration

The project uses tools such as `eslint`, `prettier` & `editorconfig` to ensure quality of
codes are properly check. 

Pushing commits to `origin/master` branch will trigger a Github action that will
deploy the output files from `dest` folder to `jkguidaven.github.io` repository.
