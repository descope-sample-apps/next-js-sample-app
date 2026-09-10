'use client';

import { useState } from 'react';

type TokenId = { jti?: string; iat?: number; exp?: number } | null;

type Result = {
  label?: string;
  ok?: boolean;
  received?: TokenId;
  [key: string]: unknown;
};

const call = async (path: string) => {
  const res = await fetch(path, { credentials: 'include' });
  return (await res.json()) as Result;
};

export default function RefreshRacePage() {
  const [delayMs, setDelayMs] = useState(0);
  const [results, setResults] = useState<Result[] | null>(null);
  const [latest, setLatest] = useState<Result | null>(null);
  const [running, setRunning] = useState(false);

  // both routes read the same DSR cookie, A refreshes now, B after `delayMs`
  const runRace = async () => {
    setRunning(true);
    setLatest(null);
    try {
      setResults(
        await Promise.all([
          call('/api/refresh-a'),
          call(`/api/refresh-b?delay=${delayMs}`),
        ]),
      );
    } finally {
      setRunning(false);
    }
  };

  const sameJti =
    results?.length === 2 &&
    results.every((r) => r.ok) &&
    !!results[0].received?.jti &&
    results[0].received.jti === results[1].received?.jti;

  return (
    <div className="min-h-screen p-10 font-mono text-sm text-white">
      <h1 className="mb-2 text-xl">Refresh token rotation race</h1>
      <p className="mb-6 max-w-3xl text-white/60">
        Two routes read the same <code>DSR</code> cookie. A refreshes
        immediately, B refreshes after the delay below. Rotation grace is 5000ms
        by default, so a delay under it should let both succeed with the same
        new token, and a delay over it should fail B and take the whole JWT
        family down with it.
      </p>

      <div className="mb-6 flex items-center gap-3">
        <label htmlFor="delay">B delay (ms)</label>
        <input
          id="delay"
          type="number"
          step={500}
          value={delayMs}
          onChange={(e) => setDelayMs(Number(e.target.value))}
          className="w-28 rounded border border-white/30 bg-black/40 px-2 py-1"
        />
        {[0, 2000, 6000].map((ms) => (
          <button
            key={ms}
            onClick={() => setDelayMs(ms)}
            className="rounded border border-white/20 px-2 py-1 text-white/60 hover:text-white"
          >
            {ms}
          </button>
        ))}
        <button
          onClick={runRace}
          disabled={running}
          className="rounded bg-[#00A6B4] px-4 py-2 disabled:opacity-50"
        >
          {running ? 'running...' : 'Run A + B together'}
        </button>
        <button
          onClick={async () => setLatest(await call('/api/refresh-latest'))}
          className="rounded border border-white/30 px-4 py-2"
        >
          Refresh with newest token
        </button>
      </div>

      {results && (
        <>
          <p className="mb-4">
            {results.every((r) => r.ok)
              ? sameJti
                ? 'both succeeded, same jti - grace reissued the winner token'
                : 'both succeeded but with DIFFERENT jti - two live tokens'
              : 'at least one call failed - see below'}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((r, i) => (
              <pre
                key={i}
                className={`overflow-x-auto rounded border p-4 ${
                  r.ok ? 'border-[#5cf34f]/40' : 'border-red-400/60'
                }`}
              >
                {JSON.stringify(r, null, 2)}
              </pre>
            ))}
          </div>
        </>
      )}

      {latest && (
        <div className="mt-6">
          <p className="mb-2 text-white/60">
            Newest token still usable? {latest.ok ? 'yes' : 'NO - family died'}
          </p>
          <pre className="overflow-x-auto rounded border border-white/20 p-4">
            {JSON.stringify(latest, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
