'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const username = localStorage.getItem('chatUsername');
    if (username) {
      router.push('/chat');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  const handleLogin = (username: string) => {
    localStorage.setItem('chatUsername', username);
    router.push('/chat');
  };

  if (isChecking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-700 border-t-slate-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm mt-3">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <LoginForm onLogin={handleLogin} />
    </main>
  );
}