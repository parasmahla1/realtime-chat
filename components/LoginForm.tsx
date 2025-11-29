'use client';

import { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));
    onLogin(username.trim());
  };

  return (
    <div className="animate-fade-in w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10">
        

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome to ChatApp
          </h1>
          <p className="text-slate-500 text-sm">
            Enter a username to start chatting instantly
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Username
            </label>
            <div className="relative">
              
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 focus:border-slate-900 focus:bg-white outline-none transition-all duration-200 text-slate-900 placeholder-slate-400"
                placeholder="Choose a username"
                autoFocus
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2.5 flex items-center gap-1.5 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="w-full bg-slate-900 text-white py-3.5 px-6 rounded-xl font-medium hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Join Chat</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </form>

      </div>

      {/* Footer */}
      <p className="text-center text-slate-400 text-xs mt-6">
        No registration required | Just pick a name and chat
      </p>
    </div>
  );
}