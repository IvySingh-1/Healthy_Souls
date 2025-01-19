import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, LogOut, Menu, X, Bell, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export function Layout() {
  const { signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const location = useLocation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const notifications = [
    { id: 1, title: 'New Patient Record', message: 'Dr. Smith added a new patient record', time: '5m ago' },
    { id: 2, title: 'System Update', message: 'New features available', time: '1h ago' },
    { id: 3, title: 'Appointment Reminder', message: 'You have 3 appointments today', time: '2h ago' },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0a192f] relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Interactive Mouse Follower */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 mix-blend-color-dodge"
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
        }}
      />

      {/* Top Navigation Bar */}
      <nav className="relative z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <Activity className="h-8 w-8 text-blue-400" />
                </motion.div>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
                  Healthy Souls
                </span>
              </Link>

              <div className="hidden md:flex md:ml-10 md:space-x-8">
                {[
                  { path: '/dashboard', label: 'Dashboard' },
                  { path: '/records', label: 'Patient Records' },
                  { path: '/symptoms', label: 'Symptom Checker' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 group ${
                      isActiveRoute(item.path)
                        ? 'text-blue-400'
                        : 'text-gray-300 hover:text-blue-400'
                    }`}
                  >
                    {item.label}
                    <motion.span
                      className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300 ${
                        isActiveRoute(item.path) ? 'w-full' : ''
                      }`}
                      layoutId="underline"
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-blue-400 ring-2 ring-[#0a192f]" />
                </motion.button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="fixed right-4 mt-2 w-80 bg-[#0a192f]/95 backdrop-blur-lg rounded-lg shadow-xl border border-white/10 overflow-hidden z-50"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
                        <div className="space-y-4">
                          {notifications.map((notification) => (
                            <motion.div
                              key={notification.id}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 cursor-pointer group"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-300">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="p-2 text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                <Settings className="h-6 w-6" />
              </motion.button>

              {/* Sign Out */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => signOut()}
                className="relative flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-blue-500 group-hover:bg-blue-700 group-hover:skew-x-12"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-blue-700 group-hover:bg-blue-500 group-hover:-skew-x-12"></span>
                <span className="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-blue-600 -rotate-12"></span>
                <span className="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-blue-400 -rotate-12"></span>
                <span className="relative flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </span>
              </motion.button>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-300 hover:text-white"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a192f]/95 backdrop-blur-lg"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {[
                  { path: '/dashboard', label: 'Dashboard' },
                  { path: '/records', label: 'Patient Records' },
                  { path: '/symptoms', label: 'Symptom Checker' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActiveRoute(item.path)
                        ? 'text-blue-400 bg-blue-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="relative z-40 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
