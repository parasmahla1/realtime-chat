'use client';

import { User } from '@/types';

interface UserListProps {
  users: User[];
  currentUser: string;
  selectedUser: string | null;
  onSelectUser: (username: string) => void;
}

export default function UserList({
  users,
  currentUser,
  selectedUser,
  onSelectUser,
}: UserListProps) {
  const otherUsers = users.filter((user) => user.username !== currentUser);

  return (
    <div className="w-72 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Online Users</h2>
        <p className="text-sm text-gray-400">
          {otherUsers.length} {otherUsers.length === 1 ? 'user' : 'users'} online
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {otherUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No other users online</p>
            <p className="text-gray-500 text-xs mt-2">
              Open another browser tab and login with a different username
            </p>
          </div>
        ) : (
          <ul>
            {otherUsers.map((user) => (
              <li key={user.socketId}>
                <button
                  onClick={() => onSelectUser(user.username)}
                  className={`w-full text-left p-3 rounded-lg mb-1 transition flex items-center gap-3 ${
                    selectedUser === user.username
                      ? 'bg-blue-600'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-lg font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
                  </div>
                  <span className="font-medium">{user.username}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}