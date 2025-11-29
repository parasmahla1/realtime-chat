'use client';

import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled: boolean;
}

export default function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (!isTypingRef.current && value) {
      isTypingRef.current = true;
      onTypingStart();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTypingStop();
      }
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');

      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTypingStop();
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Keep focus on input after sending
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200">
      <div className={`flex items-center gap-3 p-2 bg-slate-50 rounded-xl border transition-all duration-200 ${
        isFocused ? 'border-slate-300 shadow-sm' : 'border-slate-200'
      }`}>
        
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={disabled ? 'Select a user to start chatting' : 'Type your message...'}
          className="flex-1 bg-transparent py-2 text-gray-800 placeholder-gray-400 outline-none disabled:cursor-not-allowed"
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={`p-3 rounded-lg font-medium transition-all duration-200 ${
            message.trim() && !disabled
              ? 'bg-slate-800 text-white hover:bg-slate-700 active:scale-95'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}