import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, variant = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => {
      const stagger = prev.length * 200; 
      let next = [...prev, { id, message, variant, duration: duration + stagger, dismissing: false }];
      
      // If we have more than 5, mark the first non-dismissing one to start closing
      const activeToasts = next.filter(t => !t.dismissing);
      if (activeToasts.length > 5) {
        const oldestActiveIndex = next.findIndex(t => !t.dismissing);
        if (oldestActiveIndex !== -1) {
          next[oldestActiveIndex] = { ...next[oldestActiveIndex], dismissing: true };
        }
      }
      return next;
    });
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            {...toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ message, variant, duration, dismissing, onClose }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [remainingTime, setRemainingTime] = useState(duration);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  // Watch for 'dismissing' prop from parent (limit enforcement)
  useEffect(() => {
    if (dismissing && !isExiting) {
      handleClose();
    }
  }, [dismissing, isExiting, handleClose]);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(handleClose, remainingTime);
  }, [handleClose, remainingTime]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      setRemainingTime(prev => Math.max(0, prev - elapsed));
    }
  }, []);

  useEffect(() => {
    if (!isHovered && !isExiting) {
      startTimer();
    } else {
      clearTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isHovered, isExiting, startTimer, clearTimer]);


  const variants = {
    success: {
      icon: <CheckCircle2 size={18} />,
      bg: "bg-white dark:bg-slate-900",
      border: "border-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
      iconColor: "text-emerald-500",
      progress: "bg-emerald-500"
    },
    danger: {
      icon: <AlertCircle size={18} />,
      bg: "bg-white dark:bg-slate-900",
      border: "border-red-500/20",
      text: "text-red-600 dark:text-red-400",
      iconColor: "text-red-500",
      progress: "bg-red-500"
    },
    warning: {
      icon: <AlertTriangle size={18} />,
      bg: "bg-white dark:bg-slate-900",
      border: "border-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
      iconColor: "text-amber-500",
      progress: "bg-amber-500"
    },
    info: {
      icon: <Info size={18} />,
      bg: "bg-white dark:bg-slate-900",
      border: "border-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      iconColor: "text-blue-500",
      progress: "bg-blue-500"
    }
  };

  const style = variants[variant] || variants.info;

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        pointer-events-auto min-w-[320px] max-w-md
        ${style.bg} ${style.border} border shadow-2xl rounded-2xl
        transition-all duration-300 ease-out
        ${isExiting ? 'opacity-0 translate-x-full scale-95' : 'animate-in slide-in-from-right-full'}
        relative overflow-hidden group/toast
      `}
    >
      <div className="flex items-start gap-4 p-5">
        <div className={`${style.iconColor} mt-0.5`}>
          {style.icon}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-bold ${style.text}`}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {message}
          </p>
        </div>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
      
      {/* Progress Bar */}
      {!isExiting && (
        <div className="absolute bottom-0 left-0 h-1 bg-gray-100 dark:bg-slate-800 w-full">
          <div 
            className={`h-full ${style.progress} transition-all linear`}
            style={{ 
              animation: `progress ${duration}ms linear forwards`,
              animationPlayState: isHovered ? 'paused' : 'running'
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};



