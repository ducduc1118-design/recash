import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TicketPercent, Link2, Wallet, User } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/home', icon: Home },
  { label: 'Voucher', path: '/voucher', icon: TicketPercent },
  { label: 'Paste Link', path: '/paste-link', icon: Link2 },
  { label: 'Wallet', path: '/wallet', icon: Wallet },
  { label: 'Account', path: '/account', icon: User },
];

export const BottomNav: React.FC = () => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-50 lg:hidden">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
      {navItems.map((item, index) => {
        const isCenter = index === 2;

        if (isCenter) {
          return (
            <div key={item.path} className="relative -top-6">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-primary-600/30 transition-transform active:scale-95 ${
                    isActive ? 'bg-slate-900 text-white' : 'bg-primary-600 text-white'
                  }`
                }
              >
                <item.icon className="w-6 h-6" />
              </NavLink>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-slate-500 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          );
        }

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex-1 flex flex-col items-center justify-center space-y-1 py-1 min-h-[44px]"
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={`w-6 h-6 transition-colors ${isActive ? 'text-primary-600' : 'text-slate-400'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-slate-400'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </div>
  </nav>
);
