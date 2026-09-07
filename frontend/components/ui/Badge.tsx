import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'filled' | 'outline';
  className?: string;
}

export default function Badge({ children, color, variant = 'filled', className = '' }: BadgeProps) {
  if (variant === 'outline') {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border border-slate-200 text-slate-600 bg-slate-50 ${className}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: color ? `${color}20` : '#6C5CE720',
        color: color || '#6C5CE7',
      }}
    >
      {children}
    </span>
  );
}
