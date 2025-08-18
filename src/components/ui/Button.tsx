import React, { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  asChild,
  onClick,
  disabled,
  type = 'button'
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:focus";
  
  const variantClasses = {
    primary: "btn-primary",
    secondary: "bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border border-[var(--accent-blue)]/30 hover:bg-[var(--accent-blue)]/20",
    ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const combinedClasses = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
  
  if (asChild) {
    // When asChild is true, return children directly with className applied
    const child = children as React.ReactElement;
    return React.cloneElement(child, {
      className: cn(combinedClasses, child.props.className)
    });
  }
  
  return (
    <motion.button
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      type={type}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}