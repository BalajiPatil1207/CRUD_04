import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Drawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  position = 'right', 
  size = 'md' 
}) => {
  const [mounted, setMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted && !isOpen) return null;

  const positions = {
    right: {
      idle: 'translate-x-full',
      active: 'translate-x-0',
      pos: 'inset-y-0 right-0 h-full',
    },
    left: {
      idle: '-translate-x-full',
      active: 'translate-x-0',
      pos: 'inset-y-0 left-0 h-full',
    },
    top: {
      idle: '-translate-y-full',
      active: 'translate-y-0',
      pos: 'inset-x-0 top-0 w-full',
    },
    bottom: {
      idle: 'translate-y-full',
      active: 'translate-y-0',
      pos: 'inset-x-0 bottom-0 w-full',
    }
  };

  const sizes = {
    sm: position === 'left' || position === 'right' ? 'w-full max-w-xs' : 'h-64',
    md: position === 'left' || position === 'right' ? 'w-full max-w-md' : 'h-96',
    lg: position === 'left' || position === 'right' ? 'w-full max-w-xl' : 'h-[500px]',
  };

  const posStyle = positions[position];

  return (
    <div className={`fixed inset-0 z-[200] ${mounted ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className={`
          absolute inset-0 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-sm 
          transition-opacity duration-300 ease-in-out
          ${shouldAnimate ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div 
        className={`
          fixed bg-white dark:bg-surface-card-dark shadow-2xl overflow-hidden flex flex-col 
          transition-transform duration-300 ease-out border-gray-100 dark:border-slate-800
          ${posStyle.pos} ${sizes[size]}
          ${shouldAnimate ? posStyle.active : posStyle.idle}
          ${(position === 'left') ? 'border-r' : (position === 'right') ? 'border-l' : (position === 'top') ? 'border-b' : 'border-t'}
        `}
      >

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;

