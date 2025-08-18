import { ReactNode } from 'react';
import { Header } from './Header';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-pattern pointer-events-none" />
      

      
      <Header />
      
      <main className="relative pt-16">
        {children}
      </main>
    </div>
  );
}