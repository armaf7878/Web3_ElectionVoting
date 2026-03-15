import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { classNames } from '../../utils/helpers';
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}
export function Card({
  variant = 'default',
  padding = 'md',
  hover = false,
  className,
  children,
  onClick,
  ...props
}: CardProps) {
  const variants = {
    default:
    'bg-[#111118]/80 backdrop-blur-sm shadow-sm border border-red-500/10',
    elevated:
    'bg-[#111118]/90 backdrop-blur-sm shadow-lg border border-red-500/10',
    bordered: 'bg-[#111118]/80 border-2 border-[#1A1A24]',
    glass:
    'bg-[#111118]/60 backdrop-blur-md border border-red-500/20 shadow-xl'
  };
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8'
  };
  const isInteractive = hover || !!onClick;
  const CardComponent = isInteractive ? motion.div : 'div';
  const interactionProps = isInteractive ?
  {
    whileHover: {
      y: -4,
      boxShadow:
      '0 20px 25px -5px rgba(239, 68, 68, 0.1), 0 10px 10px -5px rgba(239, 68, 68, 0.05)',
      borderColor: 'rgba(239, 68, 68, 0.3)'
    },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  } :
  {};
  return (
    <CardComponent
      className={classNames(
        'rounded-xl overflow-hidden font-genos',
        variants[variant],
        paddings[padding],
        isInteractive ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
      {...interactionProps as any}
      {...props}>
      
      {children}
    </CardComponent>);

}