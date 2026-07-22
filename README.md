# Traffic Demo

Skeleton project for a North-South expressway monitoring portal MVP.

## Local environment

- Node version target: see [.nvmrc](/Users/nhugiabach/Documents/Github/trafficdemo/.nvmrc)
- Package manager: `corepack pnpm`
- Lockfile: [pnpm-lock.yaml](/Users/nhugiabach/Documents/Github/trafficdemo/pnpm-lock.yaml)
- Map config example: [.env.example](/Users/nhugiabach/Documents/Github/trafficdemo/.env.example)

## Quick start

```bash
cp .env.example .env.local
corepack pnpm dev
```

## MVP scope

- Web portal with header and footer
- OpenStreetMap-based map view
- CSV and Excel upload flow
- Traffic volume charts from uploaded files
- Clear module boundaries for future expansion

## Current focus

The current implementation is map-first:

- real `MapLibre` map on `/map`
- sample toll station dataset for the North-South corridor
- start/end station selectors
- corridor line preview between selected stations
- popup details for each station

Traffic charts are intentionally left for the next iteration.

## Structure

```text
.
├── apps
│   └── web
│       ├── public
│       └── src
│           ├── app
│           ├── components
│           ├── features
│           └── lib
├── data
│   ├── templates
│   └── uploads
├── docs
└── packages
    └── ui
```

See [docs/project-structure.md](/Users/nhugiabach/Documents/Github/trafficdemo/docs/project-structure.md) for the reasoning behind each folder.
