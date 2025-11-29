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

  // Fetch chat history when selected user changes
  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      fetch(`/api/messages/${currentUser}/${selectedUser}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data);
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
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-xl mb-2">Welcome, {currentUser}!</p>
          <p>Select a user from the list to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="p-4 bg-white border-b shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">{selectedUser}</h2>
        <p className="text-sm text-green-500">Online</p>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesEndRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message._id || index}
              message={message}
              isOwn={message.sender === currentUser}
            />
          ))
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