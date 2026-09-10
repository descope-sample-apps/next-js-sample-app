# Refresh token rotation race - test branch

Reproduces what happens when two routes refresh the same session at once, against a local Descope
stack with **refresh token rotation** enabled on the project.

This branch is a test harness, not something to merge.

## Setup

```bash
yarn install
./scripts/use-local-sdk.sh   # copies the locally built nextjs-sdk dist into node_modules
yarn dev:local               # NODE_TLS_REJECT_UNAUTHORIZED=0, the local stack cert is self-signed
```

`.env.local` points at `https://localhost:8443` and the local project.
Re-run `./scripts/use-local-sdk.sh` after every `yarn install` and after every SDK rebuild
(`npx nx run nextjs-sdk:build` in the descope-js worktree).

Sign in at `/sign-in`, then open `/refresh-race`.

## What the harness does

- `/api/refresh-a` and `/api/refresh-b` both read the same `DSR` cookie and call `sdk.refresh()`
- `?delay=<ms>` on B waits before it refreshes, so B always sends the token A already rotated
- neither route writes cookies back - they only report, so the browser session stays put
- `/api/refresh-latest` refreshes with the newest token any route received, to check whether the
  JWT family is still alive
- each result reports the `jti` of the token sent and the token received

## How rotation grace actually works

From the backend (`onetimeservice`):

- grace window is `REFRESH_ROTATION_GRACE_MILLI`, default **5000ms**, a process-global env var on
  onetimeservice - not a project setting and not a feature flag
- grace is keyed per JWT family in Redis (`rt` rotation time, `rtj` current jti, `rtra` remote
  address) and requires **both** within-window **and** the same remote IP as the rotation
- inside grace the retry is re-issued the **already current** jti (`rtj`), it does not mint a
  second token - which is why concurrent refreshes converge instead of forking
- outside grace the server invalidates the **whole family** and returns `E0064005` / 401, so the
  winner's brand new token dies too

## Expected results

| B delay | A | B | newest token after |
| --- | --- | --- | --- |
| 0-2000ms (inside grace) | ok | ok, same `jti` as A | still refreshable |
| 6000ms (outside grace) | ok | 401 `E0064005` | dead - family invalidated |

The second row is the real problem: one late duplicate refresh logs the user out completely.

## Changing the grace window locally

Set `REFRESH_ROTATION_GRACE_MILLI` on onetimeservice in the backend repo, either

- `configs/helm/local.env` (gitignored, Tilt turns it into `global.commonEnv`), or
- `charts/descope/values-dev.yaml` under `global.commonEnv`

then let Tilt redeploy onetimeservice. Nothing sets this var today, so every environment runs the
5000ms default.
