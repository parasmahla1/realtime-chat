'use client';

interface TypingIndicatorProps {
  username: string;
}

export default function TypingIndicator({ username }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm py-2 px-4">
      <div className="flex items-center gap-1">
        <span className="font-medium">{username}</span>
        <span>is typing</span>
      </div>
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  );
}