# Contributing

## Issues

Please [create a new issue](https://github.com/alulsh/dc-bikeshare-by-neighborhood/issues/new) to report any bugs, data quality issues, or missing DC bikeshare services.

## Development

### Prerequisites

This project requires Node.js, [nvm](https://github.com/nvm-sh/nvm), and npm to run the local embedded web server (using [serve](https://github.com/vercel/serve)) and [Jest](https://jestjs.io/) unit tests.

If you're only viewing this project locally, you do not need to install Node.js. You can open `index.html` using any local web server that you prefer (e.g., `python3 -m http.server`).

### Installation

To clone this repo, switch to the latest LTS version of Node via [nvm](https://github.com/nvm-sh/nvm), and install development dependencies:

```sh
git clone git@github.com:alulsh/dc-bikeshare-by-neighborhood.git
cd dc-bikeshare-by-neighborhood
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

## Tests

Run `npm test` to run tests locally. This project runs tests automatically on every commit using [GitHub Workflows](https://github.com/alulsh/dc-bikeshare-by-neighborhood/actions).

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

This project is hosted on GitHub Pages using the `main` branch. You can view the GitHub pages deployment log at https://github.com/alulsh/dc-bikeshare-by-neighborhood/deployments.

You can view the live website for this project at https://www.alexandraulsh.com/dc-bikeshare-by-neighborhood/.
