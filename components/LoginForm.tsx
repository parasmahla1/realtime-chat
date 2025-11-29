'use client';

import { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    setError('');
    onLogin(username.trim());
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">💬 Real-Time Chat</h1>
        <p className="text-gray-500">Enter your username to start chatting</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-800"
            placeholder="Enter your username"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition font-medium text-lg"
        >
          Join Chat
        </button>
      </form>
    </div>
  );
}