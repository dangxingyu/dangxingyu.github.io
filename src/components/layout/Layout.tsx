import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="paper-grain relative min-h-screen bg-paper">
      <Header />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
