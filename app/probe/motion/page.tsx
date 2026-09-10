'use client';

// probe: framer-motion only, no <Descope>
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ProbeMotion() {
  const router = useRouter();
  return (
    <div className="relative min-h-screen overflow-hidden">
      <button data-cy="nav" onClick={() => router.push('/')}>
        nav away
      </button>
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl"
        animate={{ x: ['-20%', '5%', '-10%'], y: ['5%', '-20%', '10%'] }}
        transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }}
        style={{ top: '10%', left: '60%' }}
      />
      <motion.div
        className="absolute h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl"
        animate={{ x: ['10%', '-15%', '5%'], y: ['-10%', '15%', '-5%'] }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        style={{ top: '50%', left: '25%' }}
      />
    </div>
  );
}
