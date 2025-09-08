import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { NavigationItem } from '../../types';
import { personalInfo } from '../../data/content';

const navigation: NavigationItem[] = [
  { name: 'Intro', href: '/' },
  { name: 'Blog', href: '/blog' },
];

export function Header() {
  const location = useLocation();

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Name */}
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link to="/" className="text-xl font-bold text-black focus-visible:focus">
              {personalInfo.name}
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="flex space-x-8">
            {navigation.map((item) => {
              const isActive = item.href === '/' 
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href);
              
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Link
                    to={item.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:focus ${
                      isActive
                        ? 'text-black'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"
                        layoutId="activeTab"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}