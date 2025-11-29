'use client';

import LoginForm from "@/components/LoginForm";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const handleLogin = (username: string) => {
    if (username.trim()) {
      localStorage.setItem('chatUsername', username);
      router.push('/chat');
    }
  };

  return (
  <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoginForm onLogin={handleLogin}/>
    </main>
  );
}
