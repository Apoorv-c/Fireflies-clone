import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'custom';
  width?: string;
  height?: string;
}

export default function Skeleton({ className = '', variant = 'custom', width, height }: SkeletonProps) {
  const baseClass = 'animate-pulse bg-slate-200 rounded';

  const variantClasses: Record<string, string> = {
    text: `${baseClass} h-4 w-full rounded`,
    card: `${baseClass} h-48 w-full rounded-lg`,
    avatar: `${baseClass} h-10 w-10 rounded-full`,
    custom: baseClass,
  };

  return (
    <div
      className={`${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function MeetingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex items-center gap-2">
        <Skeleton variant="avatar" className="h-7 w-7" />
        <Skeleton variant="avatar" className="h-7 w-7" />
        <Skeleton variant="avatar" className="h-7 w-7" />
      </div>
    </div>
  );
}

export function TranscriptSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-3 p-3">
          <Skeleton variant="avatar" className="h-8 w-8 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
