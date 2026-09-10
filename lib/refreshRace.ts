import { createSdk } from '@descope/nextjs-sdk/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const sdk = createSdk({
  projectId: process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID,
  baseUrl: process.env.NEXT_PUBLIC_DESCOPE_BASE_URL,
});

// ponytail: dev-only single-process store, so the winner's new refresh token
// never has to travel to the browser. Resets on every dev server reload.
let lastRefreshJwt: string | undefined;

// the SDK default, same one authMiddleware falls back to
const REFRESH_COOKIE = 'DSR';

// jti + iat identify a refresh token without exposing it
const identify = (jwt?: string) => {
  if (!jwt) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(jwt.split('.')[1], 'base64url').toString(),
    );
    return { jti: payload.jti, iat: payload.iat, exp: payload.exp };
  } catch {
    return { jti: 'unparsable' };
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const refreshRace = async (req: NextRequest, label: string) => {
  const delayMs = Number(req.nextUrl.searchParams.get('delay') ?? 0);
  const refreshJwt = (await cookies()).get(REFRESH_COOKIE)?.value;

  if (!refreshJwt) {
    return NextResponse.json(
      { label, error: `no ${REFRESH_COOKIE} cookie - sign in first` },
      { status: 401 },
    );
  }

  if (delayMs) await sleep(delayMs);

  const startedAt = Date.now();
  const res = await sdk.refresh(refreshJwt);
  const tookMs = Date.now() - startedAt;

  if (res.data?.refreshJwt) lastRefreshJwt = res.data.refreshJwt;

  return NextResponse.json({
    label,
    delayMs,
    tookMs,
    ok: res.ok,
    status: res.code,
    error: res.error,
    sent: identify(refreshJwt),
    received: identify(res.data?.refreshJwt),
  });
};

// Refreshes with the newest token any route received, to show whether the whole
// JWT family survived the race
export const refreshWithLatest = async () => {
  if (!lastRefreshJwt) {
    return NextResponse.json(
      { error: 'no refreshed token stored yet - run the race first' },
      { status: 409 },
    );
  }

  const sent = lastRefreshJwt;
  const res = await sdk.refresh(sent);
  if (res.data?.refreshJwt) lastRefreshJwt = res.data.refreshJwt;

  return NextResponse.json({
    label: 'latest',
    ok: res.ok,
    status: res.code,
    error: res.error,
    sent: identify(sent),
    received: identify(res.data?.refreshJwt),
  });
};
