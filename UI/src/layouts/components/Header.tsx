import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import type { Notification, User } from '@/types/domain';

interface HeaderProps {
  notifications: Notification[];
  user: User;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ notifications, user, onOpenNotifications, onOpenProfile }) => {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const showSearch = ['/home', '/voucher'].includes(pathname);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled ? 'bg-white/90 backdrop-blur-md py-2 border-slate-200/50 shadow-sm' : 'bg-white py-4 border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        <div className="flex-shrink-0 flex items-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <span className={`font-bold text-xl tracking-tight text-slate-900 hidden sm:block transition-opacity ${scrolled ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            RECASH
          </span>
        </div>

        {showSearch && (
          <div className="flex-1 max-w-sm relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search vouchers, stores..." 
              className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all placeholder:text-slate-400"
            />
          </div>
        )}
        {!showSearch && <div className="flex-1" />}

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={onOpenNotifications}
            className="relative h-11 w-11 rounded-full hover:bg-slate-100 text-slate-600 transition-colors inline-flex items-center justify-center"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>
          
          <button 
            onClick={onOpenProfile}
            className="relative h-11 w-11 rounded-full border-2 border-slate-100 hover:border-primary-200 transition-colors inline-flex items-center justify-center"
          >
            <img src={user.avatarUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
          </button>
        </div>
      </div>
    </header>
  );
};
