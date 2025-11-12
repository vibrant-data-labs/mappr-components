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

1. Build the package and copy the bundle to the Openmappr player project

```bash
yarn build
```

2. Publish the Openmappr player

```bash
git push
```
