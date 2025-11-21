# Mappr UI Components

This is a library of UI components for the [Openmappr player](https://github.com/vibrant-data-labs/openmappr-player).

## Development

Prerequisites:
- Node.js 22.x
- Yarn 1.22.22
- Git

1. Create the `.env` file with the following content:

```
MAPPR_ROOT=/path/to/openmappr-player
```

This will copy the built library to the `src/libs` directory of the Openmappr player.

2. Watch the changes to the bundle

```bash
yarn dev
```

## Publishing

This package is not intended to be published separately at the moment. The output bundle is copied to the Openmappr player project during the build process, so to propagate changes to the player the Openmappr project must be published with the latest version of `mappr-components`.


1. Create branches in `openmappr-player` and `mappr-components` and check them both out locally
1. cd to mappr-components:
1. Push all changes and after PR, merge to main on GH
1. Pull and Checkout main
1. `MAPPR_ROOT=/path/to/openmappr-player yarn build`
1. `cd` to openmappr-player (with the checked out `openmappr-player` branch)
1. git add all the changes that came from the `yarn build` -- it copies over the library
1. git push
1. Pull Request and Merge to Main
1. Verify in Github that the [action](https://github.com/vibrant-data-labs/openmappr-player/actions) deployed