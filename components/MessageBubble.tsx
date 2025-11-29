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
        className={`max-w-[75%] px-4 py-2 ${
          isOwn
            ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
            : 'bg-white text-slate-800 rounded-2xl rounded-bl-sm shadow-sm border border-slate-200'
        }`}
      >
        <p className="text-[15px] leading-normal break-words overflow-hidden">{message.content}</p>
        <div
          className={`flex items-center gap-1.5 mt-1 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className={`text-[11px] ${isOwn ? 'text-blue-200' : 'text-slate-400'}`}>
            {formatTime(message.timestamp)}
          </span>
          {isOwn && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3 h-3 text-blue-200"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}