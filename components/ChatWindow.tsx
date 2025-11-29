'use client';

import { useEffect, useState } from 'react';
import { Message } from '@/types';
import { useSocket } from '@/context/SocketContext';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  currentUser: string;
  selectedUser: string | null;
}

export default function ChatWindow({ currentUser, selectedUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const { socket, sendMessage, startTyping, stopTyping } = useSocket();
  const messagesEndRef = useScrollToBottom(messages);

  // Generate avatar color
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-slate-700',
      'bg-zinc-700',
      'bg-neutral-700',
      'bg-stone-700',
      'bg-gray-700',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Fetch chat history when selected user changes
  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      setMessages([]);
      fetch(`/api/messages/${currentUser}/${selectedUser}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMessages(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching messages:', err);
          setLoading(false);
        });
    } else {
      setMessages([]);
    }
  }, [currentUser, selectedUser]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceive = (message: Message) => {
      if (
        (message.sender === selectedUser && message.receiver === currentUser) ||
        (message.sender === currentUser && message.receiver === selectedUser)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleMessageSent = (message: Message) => {
      if (message.sender === currentUser && message.receiver === selectedUser) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleTypingUpdate = (data: { sender: string; isTyping: boolean }) => {
      if (data.sender === selectedUser) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on('message:receive', handleMessageReceive);
    socket.on('message:sent', handleMessageSent);
    socket.on('typing:update', handleTypingUpdate);

    return () => {
      socket.off('message:receive', handleMessageReceive);
      socket.off('message:sent', handleMessageSent);
      socket.off('typing:update', handleTypingUpdate);
    };
  }, [socket, selectedUser, currentUser]);

  // Reset typing indicator when selected user changes
  useEffect(() => {
    setIsTyping(false);
  }, [selectedUser]);

  const handleSendMessage = (content: string) => {
    if (selectedUser) {
      sendMessage(selectedUser, content);
    }
  };

  const handleTypingStart = () => {
    if (selectedUser) {
      startTyping(selectedUser);
    }
  };

  const handleTypingStop = () => {
    if (selectedUser) {
      stopTyping(selectedUser);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-5 bg-slate-200 rounded-xl flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-slate-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Welcome, {currentUser}!
          </h2>
          <p className="text-slate-500 text-sm">
            Select a conversation to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      {/* Chat Header */}
      <div className="px-5 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 ${getAvatarColor(selectedUser)} rounded-lg flex items-center justify-center text-white text-sm font-semibold`}>
              {selectedUser.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-800">{selectedUser}</h2>
            <p className="text-xs text-green-600">Online</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesEndRef}
        className="flex-1 overflow-y-auto p-4 bg-slate-100"
      >
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full gap-3">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600">No messages yet</p>
            <p className="text-xs text-slate-400">Send a message to start</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message, index) => (
              <MessageBubble
                key={message._id || index}
                message={message}
                isOwn={message.sender === currentUser}
              />
            ))}
          </div>
        )}
        {isTyping && <TypingIndicator username={selectedUser} />}
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
        disabled={!selectedUser}
      />
    </div>
  );
}