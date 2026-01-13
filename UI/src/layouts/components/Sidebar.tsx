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

export const Sidebar: React.FC = () => (
  <aside className="hidden lg:block w-64 shrink-0">
    <div className="sticky top-24 px-4 py-6 space-y-2 rounded-2xl border border-slate-100 bg-white shadow-soft">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
              isActive ? 'bg-primary-50 text-primary-700 border border-primary-100' : 'text-slate-600 hover:bg-slate-50'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  </aside>
);
