'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SocketProvider, useSocket } from '@/context/SocketContext';
import UserList from '@/components/UserList';
import ChatWindow from '@/components/ChatWindow';

function ChatContent({ username }: { username: string }) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { onlineUsers, isConnected } = useSocket();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('chatUsername');
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-col border-r border-slate-200">
        {/* User Info Header */}
        <div className="bg-slate-900 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{username}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              title="Logout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* User List */}
        <UserList
          users={onlineUsers}
          currentUser={username}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <ChatWindow currentUser={username} selectedUser={selectedUser} />
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('chatUsername');
    if (!storedUsername) {
      router.push('/');
    } else {
      setUsername(storedUsername);
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-500 text-sm mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  if (!username) {
    return null;
  }

  return (
    <SocketProvider username={username}>
      <ChatContent username={username} />
    </SocketProvider>
  );
}