import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItem } from '../../types';

const navigation: NavigationItem[] = [
  { name: 'Intro', href: '/' },
  { name: 'Blog', href: '/blog' },
];

export function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-out ${
        scrolled
          ? 'border-b border-rule bg-paper/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-page items-baseline justify-between px-6 sm:px-10 lg:px-16">
        <Link
          to="/"
          className="font-display text-[1.0625rem] tracking-[-0.01em] text-ink transition-colors duration-300 ease-out hover:text-accent"
        >
          Xingyu Dang
        </Link>

        <nav className="flex items-baseline gap-8">
          {navigation.map((item) => {
            const isActive =
              item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative pb-1 text-[0.9375rem] transition-colors duration-300 ease-out ${
                  isActive ? 'text-ink' : 'text-ink-faint hover:text-ink'
                }`}
              >
                {item.name}
                <span
                  className={`absolute inset-x-0 bottom-0 h-px origin-left bg-accent transition-transform duration-500 ease-out ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
