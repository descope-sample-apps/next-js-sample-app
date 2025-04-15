'use client';

import { useState } from 'react';
import { useSession } from '@descope/nextjs-sdk/client';
import { motion } from 'framer-motion';

interface TestApiComponentProps {
  variant?: 'home' | 'dashboard';
}

export default function TestApiComponent({ variant = 'dashboard' }: TestApiComponentProps) {
  const { isAuthenticated, isSessionLoading } = useSession();
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  if (isSessionLoading) return null;

  const handleApiTest = async () => {
    try {
      const res = await fetch('/api/user-details', {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setApiStatus('API Request Successful!');
        console.log('API Response:', data);
      } else {
        setApiStatus('API Request Failed');
      }
    } catch (error) {
      setApiStatus('API Request Failed');
      console.error('API Error:', error);
    }
  };

  const containerClasses = variant === 'home' 
    ? 'mb-8 p-6 bg-black/20 rounded-lg border border-[#5cf34f]/20 backdrop-blur-sm'
    : 'mb-8 p-6 bg-black/20 rounded-lg border border-[#5cf34f]/20 backdrop-blur-sm';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApiTest}
          className="px-6 py-3 bg-[#00A6B4] text-white rounded-lg hover:bg-[#00A6B4]/80 font-medium shadow-lg backdrop-blur-sm"
        >
          Test API Connection
        </motion.button>

        {apiStatus && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm ${apiStatus.includes('Failed') ? 'text-red-400' : 'text-[#5cf34f]'}`}
          >
            {apiStatus}
          </motion.p>
        )}
      </div>
    </div>
  );
} 