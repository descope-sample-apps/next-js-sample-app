// Runs the sign-up-or-in flow over the flow API to get a refresh token, with no
// browser involved (the project has direct password signin disabled).
//
//   LOGIN_ID=... PASSWORD=... NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/flow-login.mjs
//
// Writes the refresh token to cypress/out/dsr.txt for scripts/rotation-grace.mjs.

import { readFileSync, writeFileSync, mkdirSync } from 'fs';

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
const flowId = env.NEXT_PUBLIC_DESCOPE_FLOW_ID || 'sign-up-or-in';
const loginId = process.env.LOGIN_ID;
const password = process.env.PASSWORD;

const post = async (path, body) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${projectId}`,
    },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
};

// a flow response carries the screen and the interactions it accepts
const summarize = (d) => ({
  executionId: d.executionId,
  stepId: d.stepId,
  status: d.status,
  screenId: d.screen?.id,
  action: d.action,
  interactions: (d.screen?.state?.interactions ?? d.interactions ?? []).slice(0, 5),
  errorCode: d.errorCode,
});

const start = await post('/v1/flow/start', {
  flowId,
  options: { redirectUrl: 'http://localhost:3000' },
  isCustomScreen: false,
});
console.log('start', start.status, JSON.stringify(summarize(start.data)));

if (start.status !== 200) process.exit(1);

const { executionId, stepId } = start.data;

// the sign-in screen takes email + password and submits with the default
// interaction id used by the flow components
const next = await post('/v1/flow/next', {
  executionId,
  stepId,
  interactionId: 'submit',
  input: { email: loginId, externalId: loginId, password },
  isCustomScreen: false,
});
console.log('next ', next.status, JSON.stringify(summarize(next.data)));

const refreshJwt =
  next.data.authInfo?.refreshJwt ?? next.data.refreshJwt ?? null;

if (refreshJwt) {
  mkdirSync(new URL('../cypress/out/', import.meta.url), { recursive: true });
  writeFileSync(new URL('../cypress/out/dsr.txt', import.meta.url), refreshJwt);
  console.log('\nrefresh token written to cypress/out/dsr.txt');
} else {
  console.log('\nno refresh token yet - flow needs another step');
}
