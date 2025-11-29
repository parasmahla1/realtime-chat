'use client';

interface TypingIndicatorProps {
  username: string;
}

export default function TypingIndicator({ username }: TypingIndicatorProps) {
  return (
    <div className="flex items-start gap-3 mb-4 animate-fade-in">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-medium">
        {username.charAt(0).toUpperCase()}
      </div>
      
      {/* Typing bubble */}
      <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-200">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></span>
          <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></span>
          <span className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></span>
        </div>
      </div>
      
      {/* Username label */}
      <span className="text-xs text-slate-400 self-end mb-1">
        {username} is typing
      </span>
    </div>
  );
}