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

  // Generate a consistent color based on username
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-slate-600',
      'bg-slate-700',
      'bg-zinc-600',
      'bg-neutral-600',
      'bg-stone-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-72 bg-slate-900 text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Messages</h2>
          <span className="text-xs text-slate-400">
            {otherUsers.length} online
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-2 dark-scrollbar">
        {otherUsers.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="w-12 h-12 mx-auto mb-3 bg-slate-800 rounded-xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-slate-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">No users online</p>
            <p className="text-slate-500 text-xs mt-1">
              Open another tab to test
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {otherUsers.map((user, index) => (
              <li
                key={user.socketId}
                className="animate-fade-in"
              >
                <button
                  onClick={() => onSelectUser(user.username)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all duration-150 flex items-center gap-3 ${
                    selectedUser === user.username
                      ? 'bg-slate-800'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-10 h-10 ${getAvatarColor(user.username)} rounded-lg flex items-center justify-center text-sm font-semibold text-white`}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    {/* Online indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></span>
                  </div>

                  {/* User info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-100 truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      Online
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}