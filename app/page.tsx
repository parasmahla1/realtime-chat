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
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <LoginForm onLogin={handleLogin} />
    </main>
  );
}