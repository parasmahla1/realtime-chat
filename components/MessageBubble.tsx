'use client';

import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl ${
          isOwn
            ? 'bg-blue-500 text-white rounded-br-md'
            : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
        }`}
      >
        <p className="break-words whitespace-pre-wrap">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn ? 'text-blue-100' : 'text-gray-400'
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}