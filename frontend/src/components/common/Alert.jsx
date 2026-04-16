import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

const Alert = ({ 
  variant = 'info', 
  title, 
  children, 
  onClose, 
  className = '' 
}) => {
  const variants = {
    info: {
      container: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/20 text-blue-700 dark:text-blue-400',
      icon: <Info size={20} />
    },
    success: {
      container: 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20 text-emerald-700 dark:text-emerald-400',
      icon: <CheckCircle2 size={20} />
    },
    warning: {
      container: 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/20 text-amber-700 dark:text-amber-400',
      icon: <AlertCircle size={20} />
    },
    danger: {
      container: 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20 text-rose-700 dark:text-rose-400',
      icon: <XCircle size={20} />
    }
  };

  const style = variants[variant] || variants.info;

  return (
    <div className={`
      flex items-start gap-4 p-5 border rounded-[24px] animate-in fade-in slide-in-from-top-2 duration-300
      ${style.container} ${className}
    `}>
      <div className="flex-shrink-0 mt-0.5">
        {style.icon}
      </div>
      <div className="flex-1 space-y-1">
        {title && <h4 className="font-bold text-sm leading-tight">{title}</h4>}
        <div className="text-sm opacity-90 leading-relaxed font-medium">
          {children}
        </div>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-current/10 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
