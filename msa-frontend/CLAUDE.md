# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project layout

The repo is a wrapper around a single Vite app at `market-msa-app/` — all commands and source live there, not at the repo root. `cd market-msa-app` first.

Node version: v24.15.0 (per `README.md`).

## Commands

```bash
npm install              # first-time setup
npm run dev              # regenerates routeTree.gen.ts then starts Vite
npm run build            # regenerates route tree, then `tsc -b && vite build`
npm run lint             # eslint .
npm run preview          # vite preview of production build

npx @tanstack/router-cli generate   # regenerate routeTree.gen.ts only
```

`dev` and `build` both run the TanStack Router code generator before Vite, so committed `src/routeTree.gen.ts` may go stale after adding/removing files in `src/routes/` — re-run the generator (or `npm run dev`) after route changes. `tsr.config.json` controls the generator.

There is no test runner configured.

## Environment

`.env` defines `VITE_API_GATEWAY_ENDPOINT` (default `http://127.0.0.1:8100/api/v1`). The frontend talks to a backend API gateway — running the app standalone without that backend will break all data calls.

## Architecture

### Layered REST stack

Data flow is split into three concentric layers, each in its own directory. When adding a new endpoint, touch all three:

1. **`src/libs/rest-api/<domain>/`** — transport layer. One folder per domain (`auth`, `order`, `product`, `inventory`), each with `request.ts`, `response.ts` types and a `<domain>-rest-api.ts` that builds endpoint URLs and calls the shared axios instance. The shared axios instance lives in `src/libs/rest-api/rest-config.ts` and injects the `Bearer` token from localStorage on every request.
2. **`src/services/rest-api/<domain>-service.ts`** — TanStack Query layer. Wraps each rest-api function in `useQuery` / `useMutation`. Mutations here also handle cross-cutting side effects like `queryClient.invalidateQueries` and post-success navigation (see `order-service.ts:createOrder`).
3. **`src/components/<Feature>/containers/<Feature>Container.tsx`** — the only place service hooks are consumed. Containers fetch data and pass plain props to the sibling presentational component (`src/components/<Feature>/<Feature>.tsx`). Routes mount containers, never services directly.

### Routing

TanStack Router with file-based routing. `src/routes/` is the source of truth; `src/routeTree.gen.ts` is generated and should not be hand-edited. `src/routes/__root.tsx` renders `<SideBar />`, `<Outlet />`, and the router devtools shell. `src/libs/route-config.ts` exports a `ROUTE_PATHS` constant — use it for navigation rather than string literals so renames stay in sync.

### State

- **Server state**: TanStack Query, configured in `src/providers/TanStackProvider.tsx` (single `QueryClient`, devtools mounted). `main.tsx` renders only `<TanStackProvider />` — no other root.
- **Client state**: Zustand stores in `src/store/` (`useTokenStore`, `useUserStore`). Stores are paired with custom hooks in `src/hooks/` (`useToken`, `useUser`) that mirror the store into `localStorage` via `src/libs/storage.ts`. The axios request interceptor reads the token straight from localStorage, not the Zustand store, so `useToken.updateToken` must be used (not `setToken` directly) to keep the two in sync.

### TypeScript path aliases

`tsconfig.app.json` defines `@components/*`, `@hooks/*`, `@libs/*`, `@providers/*`, `@routes/*`, `@store/*`, `@typedef/*`, `@services/*`. Vite resolves them via `tsconfigPaths: true` in `vite.config.ts`. Note: the `@hooks/*` mapping currently points at `./src/sthooksore/*` (typo) — imports use `@hooks/useToken` style, so if hook imports break, that path is the cause.

### UI

MUI v9 (`@mui/material`, `@mui/icons-material`) for components, with Tailwind v4 via `@tailwindcss/vite` available alongside. Emotion is the MUI styling engine. Korean copy is used throughout the UI.
