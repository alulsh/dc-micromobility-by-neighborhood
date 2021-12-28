# Contributing

## Issues

Please [create a new issue](https://github.com/alulsh/dc-micromobility-by-neighborhood/issues/new) to report any bugs, data quality issues, or missing DC micromobility services.

## Development

### Prerequisites

This project requires Node.js, [nvm](https://github.com/nvm-sh/nvm), and npm to run the local embedded web server (using [serve](https://github.com/vercel/serve)) and [Jest](https://jestjs.io/) unit tests.

If you're only viewing this project locally, you do not need to install Node.js. You can open `index.html` using any local web server that you prefer (e.g., `python3 -m http.server`).

### Installation

To clone this repo, switch to the latest LTS version of Node via [nvm](https://github.com/nvm-sh/nvm), and install development dependencies:

```sh
git clone git@github.com:alulsh/dc-micromobility-by-neighborhood.git
cd dc-micromobility-by-neighborhood
nvm use
npm install
```

### Setup

If you have Node.js installed, run `npm start` to start a local web server on http://localhost:5000 with [serve](https://github.com/vercel/serve).

If you don't have Node.js installed, open `index.html` using a local web server that you prefer (e.g., `python3 -m http.server`).

## Dependencies

This project uses the following production dependencies:

- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/) for maps
- [Turf](https://github.com/Turfjs/turf)'s [`pointsWithinPolygon`](http://turfjs.org/docs/#pointsWithinPolygon) function to calculate the number of bikes (points) per DC neighborhood cluster (polygon)

## Types

This project uses TypeScript for types and uses [@types/mapbox-gl](https://www.npmjs.com/package/@types/mapbox-gl), [@types/geojson](https://www.npmjs.com/package/@types/geojson), and custom type declarations in `typings/custom-typings.d.ts`.

This project does not the built-in type definitions in the [@turf/turf](https://www.npmjs.com/package/@turf/turf) module. Instead, it uses manually copied [type declarations from the Turf module source code](https://github.com/Turfjs/turf/blob/cd719cde909db79340d390de39d2c6afe3173062/packages/turf-points-within-polygon/index.d.ts#L14-L21), stored in `typings/turf-typings.d.ts`. This enables this project to load the Turf library from a CDN and use the Turf global variable with TypeScript. This system avoids needing to set up a module bundling or transpilation system just to use TypeScript with Turf.

## Tests

Run `npm test` to run tests locally. This project runs tests automatically on every commit using [GitHub Workflows](https://github.com/alulsh/dc-micromobility-by-neighborhood/actions).

This project uses [Jest](https://jestjs.io/) for tests. Since this project loads [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/) through the Mapbox CDN instead of bundling an npm package, the Jest tests mock Mapbox GL JS using the [global object](https://jestjs.io/docs/en/configuration#globals-object) in the test [set up file](https://jestjs.io/docs/en/configuration#setupfiles-array).

This project uses [eslint](https://eslint.org/) with the [Airbnb JavaScript style guide](https://airbnb.io/javascript/) for code quality and [Prettier](https://prettier.io/) for code formatting.

If you're using [Visual Studio Code](https://code.visualstudio.com/), you can add the following to your `.vscode/settings.json` file for this project to enable automatic linting and formatting on save:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

## Deployment

This project is hosted on GitHub Pages using the `main` branch. You can view the GitHub pages deployment log at https://github.com/alulsh/dc-micromobility-by-neighborhood/deployments.

You can view the live website for this project at https://www.alexandraulsh.com/dc-micromobility-by-neighborhood/.

### URL redirect

The old repository name for this project was dc-bikeshare-by-neighborhood and the map was hosted at https://www.alexandraulsh.com/dc-bikeshare-by-neighborhood/. While GitHub repos automatically redirect after name changes, GitHub pages do not automatically redirect. While [jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from) can handle redirects, this project uses client-side redirection techniques that can get your website falsely flagged as a phishing attack. As a result, the [dc-bikeshare-by-neighborhood.md file in alulsh.github.io](https://github.com/alulsh/alulsh.github.io/commit/78c1077c1660c9ebc41d4c871facdac7188f3857) serves as a manual redirect for this project.
