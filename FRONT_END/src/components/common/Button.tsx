import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2Icon } from 'lucide-react';
import { classNames } from '../../utils/helpers';
interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A0F] disabled:opacity-50 disabled:pointer-events-none font-genos tracking-wide';
  const variants = {
    primary:
    'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500 shadow-md',
    secondary:
    'bg-[#1A1A24] text-gray-200 hover:bg-[#2A2A34] focus:ring-red-500',
    outline:
    'border-2 border-red-500 text-red-400 hover:bg-red-500/10 focus:ring-red-500',
    ghost:
    'text-gray-400 hover:bg-white/5 hover:text-gray-200 focus:ring-gray-500',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 focus:ring-red-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  return (
    <motion.button
      whileHover={
      disabled || loading ?
      {} :
      {
        scale: 1.02
      }
      }
      whileTap={
      disabled || loading ?
      {} :
      {
        scale: 0.98
      }
      }
      className={classNames(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      disabled={disabled || loading}
      {...props}>
      
      {loading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>);

}