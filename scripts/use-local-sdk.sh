#!/usr/bin/env bash
# Copy a locally built @descope/nextjs-sdk dist into node_modules.
# Re-run after every `yarn install` and after every SDK rebuild.
set -euo pipefail

SDK_REPO="${SDK_REPO:-$HOME/dev/go/src/github.com/descope/descope-js-skip-refresh-validation}"
SDK_DIR="$SDK_REPO/packages/sdks/nextjs-sdk"

if [ ! -d "$SDK_DIR/dist" ]; then
	echo "no dist - build it first:"
	echo "  (cd $SDK_REPO && npx nx run nextjs-sdk:build)"
	exit 1
fi

rsync -a --delete "$SDK_DIR/dist/" node_modules/@descope/nextjs-sdk/dist/
echo "synced dist from $SDK_DIR"

if grep -q skipRefreshTokenValidation node_modules/@descope/nextjs-sdk/dist/cjs/server/authMiddleware.js; then
	echo "skipRefreshTokenValidation: present"
else
	echo "skipRefreshTokenValidation: MISSING - wrong branch or stale build"
	exit 1
fi
