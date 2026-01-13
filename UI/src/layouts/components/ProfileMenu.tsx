import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, ShoppingBag, User } from 'lucide-react';
import type { User as UserProfile } from '@/types/domain';
import { authService } from '@/services/auth.service';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div className="fixed top-16 right-4 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-[61] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
           <div className="flex items-center space-x-3">
             <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
             <div>
               <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
               <p className="text-xs text-slate-500">{user.email}</p>
             </div>
           </div>
        </div>
        <div className="p-2 space-y-1">
          {[
            { label: 'My Profile', icon: User, path: '/profile' },
            { label: 'My Orders', icon: ShoppingBag, path: '/orders' },
            { label: 'Settings', icon: Settings, path: '/account' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors min-h-[44px]"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="h-px bg-slate-100 my-1" />
          <button
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
            onClick={() => {
              authService.logout().catch(() => undefined);
              onClose();
              navigate('/login');
            }}
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </>
  );
};
