import React, { useEffect } from 'react';
import { Loader2, X, Check, ChevronDown } from 'lucide-react';

// --- Card ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}
export const AppCard: React.FC<CardProps> = ({ children, className = '', noPadding = false, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden ${noPadding ? '' : 'p-5'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading,
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900",
    outline: "bg-transparent border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  const sizes = {
    xs: "h-7 px-2.5 text-[10px]",
    sm: "h-9 px-3 text-xs",
    md: "h-11 px-5 text-sm",
    lg: "h-14 px-8 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}
export const Input: React.FC<InputProps> = ({ label, error, rightElement, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
    <div className="relative">
      <input 
        className={`w-full h-11 px-4 rounded-xl border bg-white transition-all outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 ${
          error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 text-red-900 placeholder-red-300' 
            : 'border-slate-200 focus:border-primary-500 focus:ring-primary-500/20 text-slate-900 placeholder-slate-400'
        } ${className}`}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {rightElement}
        </div>
      )}
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

// --- Textarea ---
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
    <textarea 
      className={`w-full p-4 rounded-xl border border-slate-200 bg-white transition-all outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500/20 text-slate-900 placeholder-slate-400 ${className}`}
      {...props}
    />
  </div>
);

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}
export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
    <div className="relative">
      <select
        className={`w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 bg-white transition-all outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-500/20 text-slate-900 appearance-none ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  </div>
);

// --- Switch ---
interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      checked ? 'bg-primary-600' : 'bg-slate-200'
    }`}
  >
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

// --- Badge ---
interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'neutral' | 'error' | 'primary' | 'info';
}
export const StatusBadge: React.FC<BadgeProps> = ({ label, variant = 'neutral' }) => {
  const styles = {
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    neutral: "bg-slate-50 text-slate-600 border-slate-100",
    error: "bg-red-50 text-red-600 border-red-100",
    primary: "bg-primary-50 text-primary-600 border-primary-100",
    info: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles[variant]} uppercase tracking-wide`}>
      {label}
    </span>
  );
};

// --- Chip ---
interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}
export const Chip: React.FC<ChipProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
      active 
        ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/20' 
        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
    }`}
  >
    {label}
  </button>
);

// --- Toast ---
interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}
export const Toast: React.FC<ToastProps> = ({ message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div 
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${
        show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center space-x-2 text-sm font-medium">
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
        <span>{message}</span>
      </div>
    </div>
  );
};

// --- Bottom Sheet / Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] transition-opacity animate-in fade-in ${className}`}
        onClick={onClose}
      />
      <div className={`fixed inset-0 z-[71] pointer-events-none flex items-center justify-center p-4 ${className}`}>
         <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl pointer-events-auto overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {title && (
              <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center flex-shrink-0">
                <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-6 overflow-y-auto no-scrollbar">
              {children}
            </div>
         </div>
      </div>
    </>
  );
};

// --- Table ---
export const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full overflow-x-auto rounded-xl border border-slate-100 bg-white ${className}`}>
    <table className="w-full text-left text-sm text-slate-600">
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-slate-50 text-xs uppercase text-slate-400 font-semibold">
    <tr>{children}</tr>
  </thead>
);

export const TableBody: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="divide-y divide-slate-50">
    {children}
  </tbody>
);

export const TableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <tr className={`hover:bg-slate-50/50 transition-colors ${className}`}>{children}</tr>
);

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <th className={`px-4 py-3 ${className}`}>{children}</th>
);

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);

// --- Skeleton ---
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />
);

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border border-slate-100 rounded-2xl bg-white">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// --- Empty State ---
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="bg-slate-50 p-4 rounded-full mb-4 text-slate-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
};

// --- Stat Pill ---
export const StatPill: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-100 min-w-[100px]">
    <div className="flex items-center space-x-1 text-slate-400 text-xs font-medium mb-1">
      {icon && <span className="w-3 h-3">{icon}</span>}
      <span>{label}</span>
    </div>
    <div className="text-slate-900 font-bold text-lg">{value}</div>
  </div>
);
