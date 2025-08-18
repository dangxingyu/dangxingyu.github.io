import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TagProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'accent';
}

export function Tag({ children, className, variant = 'default' }: TagProps) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses = {
    default: "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
    accent: "bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border border-[var(--accent-blue)]/30"
  };
  
  return (
    <motion.span
      className={cn(baseClasses, variantClasses[variant], className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.span>
  );
}