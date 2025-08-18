import { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends MotionProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'alt';
  hover?: boolean;
}

export function Card({ 
  children, 
  className, 
  variant = 'default', 
  hover = true,
  ...motionProps 
}: CardProps) {
  const baseClasses = "p-6 rounded-lg transition-all duration-200";
  const variantClasses = {
    default: "bg-card",
    alt: "bg-card-alt"
  };
  const hoverClasses = hover ? "hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--shadow-medium)]" : "";
  
  return (
    <motion.div
      className={cn(baseClasses, variantClasses[variant], hoverClasses, className)}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}