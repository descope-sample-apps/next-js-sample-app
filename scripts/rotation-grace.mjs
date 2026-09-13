// Exercises the refresh token rotation grace window directly against the API,
// no browser involved.
//
//   LOGIN_ID=... PASSWORD=... NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/rotation-grace.mjs
//
// Reads the project + base url from .env.local.

import { readFileSync } from 'fs';
import { createHash } from 'crypto';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')];
    }),
);

const projectId = env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;
const baseUrl = env.NEXT_PUBLIC_DESCOPE_BASE_URL || 'https://api.descope.com';
// password signin is disabled on this project (E061001), so the starting token
// comes from a flow login captured by cypress/e2e/capture_token_spec.cy.ts
const tokenFile = new URL('../cypress/out/dsr.txt', import.meta.url);
let startingToken;
try {
  startingToken = readFileSync(tokenFile, 'utf8').trim();
} catch {
  console.error(
    'no cypress/out/dsr.txt - run:\n' +
      '  npx cypress run --spec cypress/e2e/capture_token_spec.cy.ts --browser electron \\\n' +
      '    --env login_id=<id>,password=<pw>',
  );
  process.exit(1);
}

const api = (path, { refreshJwt, body } = {}) =>
  fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${projectId}${refreshJwt ? ':' + refreshJwt : ''}`,
    },
    body: JSON.stringify(body ?? {}),
  });

// opaque identity: a hash prefix, so nothing sensitive is printed
const id = (jwt) => {
  if (!jwt) return null;
  const fp = createHash('sha256').update(jwt).digest('hex').slice(0, 12);
  const [h, p] = jwt.split('.');
  const dec = (s) => JSON.parse(Buffer.from(s, 'base64url').toString());
  const payload = dec(p);
  return { fp, jti: payload.jti ?? dec(h).jti ?? null, iat: payload.iat };
};

const refresh = async (jwt) => {
  const res = await api('/v1/auth/refresh', { refreshJwt: jwt });
  const data = await res.json().catch(() => ({}));
  return {
    ok: res.ok,
    status: res.status,
    errorCode: data.errorCode,
    sent: id(jwt),
    received: id(data.refreshJwt),
    raw: data.refreshJwt,
  };
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const show = (name, r) =>
  console.log(
    `  ${name.padEnd(12)} ${r.ok ? 'OK  ' : 'FAIL'} ${String(r.status).padEnd(4)}` +
      ` ${(r.errorCode ?? '').padEnd(10)}` +
      ` sent=${r.sent?.fp} -> got=${r.received?.fp ?? '-'}`,
  );

console.log(`project ${projectId} at ${baseUrl}`);

// each case needs a live refresh token, and cases 1 and 2 leave the family
// alive, so chain the winner's token forward instead of logging in again
let token = startingToken;

console.log('\n[1] two refreshes fired together');
{
  const [a, b] = await Promise.all([refresh(token), refresh(token)]);
  show('A', a);
  show('B', b);
  console.log(`  same token back: ${a.received?.fp === b.received?.fp}`);
  token = a.raw ?? b.raw;
}

console.log('\n[2] second refresh 1s later (inside the 5s grace)');
{
  const a = await refresh(token);
  show('A t=0', a);
  await sleep(1000);
  const b = await refresh(token);
  show('B t=1s', b);
  console.log(`  same token back: ${a.received?.fp === b.received?.fp}`);
  token = b.raw ?? a.raw;
}

console.log('\n[3] second refresh 6s later (past the 5s grace)');
{
  const a = await refresh(token);
  show('A t=0', a);
  await sleep(6000);
  const b = await refresh(token);
  show('B t=6s', b);
  const after = await refresh(a.raw);
  show('winner again', after);
  console.log(
    `  winner token survived B's failure: ${after.ok}` +
      (after.ok ? '' : '  <- whole family invalidated'),
  );
}
