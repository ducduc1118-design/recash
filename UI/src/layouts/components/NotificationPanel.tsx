import React from 'react';
import { X } from 'lucide-react';
import type { Notification } from '@/types/domain';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div className="fixed top-16 right-4 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-[61] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-slate-900">Notifications</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No new notifications</div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`p-3 rounded-xl mb-1 flex items-start space-x-3 transition-colors ${n.read ? 'bg-white' : 'bg-blue-50/50'}`}>
                 <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${n.read ? 'bg-slate-200' : 'bg-primary-500'}`} />
                 <div>
                   <p className="text-sm font-medium text-slate-800">{n.title}</p>
                   <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                   <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                 </div>
              </div>
            ))
          )}
        </div>
        <div className="p-3 border-t border-slate-50 text-center">
          <button className="text-xs font-medium text-primary-600 hover:text-primary-700">Mark all as read</button>
        </div>
      </div>
    </>
  );
};
