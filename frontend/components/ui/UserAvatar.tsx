'use client';

import React from 'react';
import Image from 'next/image';
import { useUIStore } from '@/lib/store';
import { User } from 'lucide-react';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showProBadge?: boolean;
  onClick?: () => void;
}

export default function UserAvatar({
  size = 'md',
  className = '',
  showProBadge = false,
  onClick,
}: UserAvatarProps) {
  const { userProfile, isPremium } = useUIStore();

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs rounded-lg',
    md: 'w-8 h-8 text-sm rounded-lg',
    lg: 'w-10 h-10 text-base rounded-xl',
    xl: 'w-20 h-20 text-2xl rounded-2xl',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
    xl: 36,
  };

  const renderContent = () => {
    // 1. If custom uploaded photo URL exists
    if (userProfile.avatarUrl) {
      return (
        <img
          src={userProfile.avatarUrl}
          alt={userProfile.name}
          className="w-full h-full object-cover rounded-[inherit]"
        />
      );
    }

    // 2. If user selected blank photo avatar
    if (userProfile.avatarType === 'blank') {
      return (
        <img
          src="/blank-profile.svg"
          alt="Blank Profile Photo"
          className="w-full h-full object-cover rounded-[inherit]"
        />
      );
    }

    // 3. If user selected neutral blank avatar
    if (userProfile.avatarType === 'blank-neutral') {
      return (
        <img
          src="/blank-avatar.svg"
          alt="Default Avatar"
          className="w-full h-full object-cover rounded-[inherit]"
        />
      );
    }

    // 4. Default: Purple Brand Initial 'A' matching Fireflies style
    const initial = userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'A';
    return (
      <span className="font-bold tracking-tight text-white select-none">
        {initial}
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 ${
        userProfile.avatarType === 'initial' && !userProfile.avatarUrl
          ? 'bg-[#6C5CE7] hover:bg-[#5a4bd6]'
          : 'bg-slate-100'
      } ${sizeClasses[size]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {renderContent()}

      {showProBadge && isPremium && (
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-slate-900 font-black shadow-2xs">
          ★
        </span>
      )}
    </div>
  );
}
