# Project Structure

## Goal

This structure is optimized for an MVP where the main data source is uploaded CSV or Excel files.

The current delivery order is:

1. map
2. upload
3. charts

## Main folders

### `apps/web`

Single web application for:

- public landing overview
- internal dashboard pages
- upload flow
- map view

### `apps/web/src/app`

Route entry points using the Next.js App Router.

- `page.tsx`: overview page
- `upload/page.tsx`: import flow
- `dashboard/page.tsx`: charts and metrics
- `map/page.tsx`: OSM map experience

### `apps/web/src/components`

Reusable UI pieces split by concern:

- `layout`: header, footer, shell
- `charts`: chart widgets
- `maps`: map widgets
- `upload`: upload and preview UI

Current map entry point:

- [toll-station-map.tsx](/Users/nhugiabach/Documents/Github/trafficdemo/apps/web/src/components/maps/toll-station-map.tsx)

### `apps/web/src/features/traffic-data`

Business logic for turning raw spreadsheet rows into application data.

- `types`: central traffic types
- `utils`: normalization helpers

Suggested next subfolders:

- `parsers`
- `schema`
- `validators`
- `transformers`

### `apps/web/src/features/map`

Contains map-specific domain data and types.

- `data`: sample toll stations and later route datasets
- `types`: map-facing domain contracts

### `data/templates`

Contains sample templates that operators can follow when preparing input files.

### `data/uploads`

Local place for temporary uploaded files during early development.

Do not treat this as long-term storage.

### `packages/ui`

Reserved for future shared UI components if the project later grows into multiple apps.

## Suggested next steps

1. Swap the temporary corridor line for real car routing using OSRM or Valhalla.
2. Add toll station search, filter, and route summary cards.
3. Build the upload parser with `papaparse` for CSV and `xlsx` for Excel.
4. Replace chart placeholders with `ECharts` widgets bound to normalized traffic records.
