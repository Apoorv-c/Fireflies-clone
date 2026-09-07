import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#8b8ba3]">{label}</label>
      )}
      <input
        suppressHydrationWarning
        className={`w-full px-3 py-2 rounded-lg bg-[#2a2a4a] border border-[#3a3a5a] text-[#e0e0e0] placeholder-[#6b6b8a]
          focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/50 focus:border-[#6C5CE7] transition-all text-sm
          ${error ? 'border-red-500 focus:ring-red-500/50' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
