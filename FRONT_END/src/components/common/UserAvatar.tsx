import React from 'react';

interface UserAvatarProps {
  name?: string;
  address?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ name, address, size = 'md', className = '' }: UserAvatarProps) {
  // Extract initials
  const getInitials = () => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    if (address) {
      // For wallet address, take first two characters (excluding 0x)
      const cleanAddr = address.startsWith('0x') ? address.slice(2) : address;
      return cleanAddr.slice(0, 2).toUpperCase();
    }
    return '?';
  };

  // Generate color based on string hash
  const getStringColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 45%)`; // Saturated and dark enough for white text
  };

  const strForColor = name || address || 'default';
  const bgColor = getStringColor(strForColor);
  const initials = getInitials();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl'
  };

  return (
    <div 
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-sm border border-white/10 ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: bgColor }}
      title={name || address}
    >
      {initials}
    </div>
  );
}
