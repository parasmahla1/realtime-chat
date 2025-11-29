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
    <div className="w-64 bg-gray-800 text-white h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Online Users</h2>
        <p className="text-sm text-gray-400">{otherUsers.length} online</p>
      </div>
      <ul className="p-2">
        {otherUsers.length === 0 ? (
          <li className="text-gray-400 text-sm p-3">No other users online</li>
        ) : (
          otherUsers.map((user) => (
            <li key={user.socketId}>
              <button
                onClick={() => onSelectUser(user.username)}
                className={`w-full text-left p-3 rounded-lg mb-1 transition flex items-center gap-3 ${
                  selectedUser === user.username
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-700'
                }`}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {user.username}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}