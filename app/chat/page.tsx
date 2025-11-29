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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col bg-gray-800">
        {/* User Info Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold">{username}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition"
            >
              Logout
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
      <ChatWindow currentUser={username} selectedUser={selectedUser} />
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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