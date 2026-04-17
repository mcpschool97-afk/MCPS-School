import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'News', path: '/news' },
  ];

  const extraNavLinks = [
    { name: 'Facilities', path: '/facilities' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Donations', path: '/donations' },
    { name: 'Student Portal', path: '/student/login' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close More dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };

    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMoreOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 py-1">
            {/* Logo/School Name */}
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border-2 border-white">
                    <img
                      src="/logo/logo.jpeg"
                      alt="Meridian Creative & Progressive School"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-lg font-bold hidden sm:inline">Meridian Creative & Progressive School</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
                {navLinks.map((link) => (
                  <Link key={link.path} href={link.path}>
                    <div
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive(link.path)
                          ? 'bg-white text-blue-600'
                          : 'text-white hover:bg-blue-500'
                      }`}
                    >
                      {link.name}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="relative" ref={moreDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                  className="px-3 py-2 rounded-full border border-white/30 bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition"
                >
                  More
                </button>
                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-48 rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      {extraNavLinks.map((link) => (
                        <Link key={link.path} href={link.path}>
                          <div
                            onClick={() => setIsMoreOpen(false)}
                            className="px-4 py-3 text-gray-700 text-sm hover:bg-gray-100 cursor-pointer"
                          >
                            {link.name}
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white hover:bg-blue-500 p-2 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <AiOutlineClose size={28} />
                ) : (
                  <AiOutlineMenu size={28} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden bg-blue-700 border-t border-blue-500"
              >
                <div className="px-4 py-4 space-y-2">
                  {navLinks.concat(extraNavLinks).map((link) => (
                    <Link key={link.path} href={link.path}>
                      <div
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                          isActive(link.path)
                            ? 'bg-white text-blue-600'
                            : 'text-white hover:bg-blue-500'
                        }`}
                      >
                        {link.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Footer */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-400">Meridian Creative & Progressive School</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Providing quality education and fostering excellence in academics, sports, and character development.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-400">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/admissions" className="text-gray-400 hover:text-white transition">Admissions</Link></li>
                <li><Link href="/academics" className="text-gray-400 hover:text-white transition">Academics</Link></li>
                <li><Link href="/gallery" className="text-gray-400 hover:text-white transition">Gallery</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-blue-400">Contact Us</h3>
              <p className="text-gray-400 text-sm mb-2">📍 Balrampur, Post Patkhauli, Azamgarh, Near Maa Murati College</p>
              <p className="text-gray-400 text-sm mb-2">📞 +91 9076697973</p>
              <p className="text-gray-400 text-sm">✉️ mcpschool97@gmail.com</p>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Meridian Creative & Progressive School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
