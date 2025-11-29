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
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Welcome, {currentUser}!
          </h2>
          <p className="text-gray-500">
            Select a user from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Chat Header */}
      <div className="p-4 bg-white border-b shadow-sm flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
            {selectedUser.charAt(0).toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{selectedUser}</h2>
          <p className="text-sm text-green-500">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesEndRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">No messages yet</p>
              <p className="text-sm">Send a message to start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={message._id || index}
                message={message}
                isOwn={message.sender === currentUser}
              />
            ))}
          </>
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