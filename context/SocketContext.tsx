'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Message } from '@/types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: User[];
  sendMessage: (receiver: string, content: string) => void;
  startTyping: (receiver: string) => void;
  stopTyping: (receiver: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({
  children,
  username,
}: {
  children: React.ReactNode;
  username: string;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    const newSocket = io(socketUrl);

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('user:join', username);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('users:online', (users: User[]) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [username]);

  const sendMessage = (receiver: string, content: string) => {
    if (socket) {
      socket.emit('message:send', {
        sender: username,
        receiver,
        content,
      });
    }
  };

  const startTyping = (receiver: string) => {
    if (socket) {
      socket.emit('typing:start', { sender: username, receiver });
    }
  };

  const stopTyping = (receiver: string) => {
    if (socket) {
      socket.emit('typing:stop', { sender: username, receiver });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        sendMessage,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}