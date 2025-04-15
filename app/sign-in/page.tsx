'use client';

import { Descope } from '@descope/nextjs-sdk';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const FloatingShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large gradient circle */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#02dfed]/20 to-[#5cf34f]/20 blur-3xl"
        animate={{
          x: ["-20%", "5%", "-10%"],
          y: ["5%", "-20%", "10%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ top: '10%', left: '60%' }}
      />
      
      {/* Smaller teal blob */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-[#00A6B4]/15 blur-3xl"
        animate={{
          x: ["10%", "-15%", "5%"],
          y: ["-10%", "15%", "-5%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ top: '50%', left: '25%' }}
      />
      
      {/* Small green accent */}
      <motion.div
        className="absolute w-[200px] h-[200px] rounded-full bg-[#5cf34f]/20 blur-2xl"
        animate={{
          x: ["-5%", "10%", "-15%"],
          y: ["10%", "-10%", "5%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ top: '70%', left: '70%' }}
      />
    </div>
  );
};

const GradientText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-[#5cf34f] via-[#02dfed] to-[#00a4c5] ${className}`}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      style={{
        backgroundSize: "200% 200%",
      }}
    >
      {children}
    </motion.span>
  );
};

interface DescopeSuccessEvent {
  detail: {
    user: {
      userId: string;
      name?: string;
      email?: string;
    };
  };
}

interface DescopeErrorEvent {
  detail: {
    error: string;
    message: string;
  };
}

export default function SignInPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-black via-black to-blue-950/20 opacity-70" />
      
      {/* Floating shapes */}
      <FloatingShapes />
      
      {/* Hero Section */}
      <div className="relative pt-12 pb-6 md:pt-20 md:pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <h1 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">
              <GradientText className="font-extrabold">
                Authenticate with Descope
              </GradientText>
            </h1>
          </motion.div>

          {/* Gradient Border Button */}
          {/* Descope Sample App Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-[#5cf34f]/50 inline-block"
          >
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ 
                  opacity: [1, 0.4, 1],
                  scale: [1, 0.9, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-2 h-2 rounded-full bg-[#5cf34f] shadow-[0_0_8px_#5cf34f]"
              />
              <p className="text-sm text-gray-400">
                NextJS Sample App Powered by <a 
                  href="https://descope.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#5cf34f] hover:underline transition-colors"
                >
                  Descope
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Auth Container */}
      <div className="relative max-w-sm mx-auto mt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl bg-white/10 rounded-xl shadow-2xl border border-white/20 overflow-hidden"
        >
          <Descope
            flowId={process.env.NEXT_PUBLIC_DESCOPE_FLOW_ID || 'sign-up-or-in'}
            theme="dark"
            onSuccess={(e: DescopeSuccessEvent) => {
              console.log('Success:', e.detail.user);
              router.push('/dashboard');
            }}
            onError={(e: DescopeErrorEvent) => {
              console.error('Error:', e.detail.message);
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}