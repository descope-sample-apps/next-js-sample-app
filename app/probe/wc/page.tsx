'use client';

// probe: <Descope> only, no framer-motion
import { Descope } from '@descope/nextjs-sdk';
import { useRouter } from 'next/navigation';

export default function ProbeWc() {
  const router = useRouter();
  return (
    <div>
      <button data-cy="nav" onClick={() => router.push('/')}>
        nav away
      </button>
      <Descope
        flowId={process.env.NEXT_PUBLIC_DESCOPE_FLOW_ID || 'sign-up-or-in'}
        theme="dark"
      />
    </div>
  );
}
