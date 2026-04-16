import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  size = 'md', 
  closeOnOverlayClick = true 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    xs: 'max-w-[380px]',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]'
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      
      {/* Modal Content */}
      <div 
        className={`
          relative w-full ${sizes[size]} bg-white dark:bg-surface-card-dark 
          rounded-[32px] shadow-2xl overflow-hidden border border-transparent dark:border-slate-800
          animate-in zoom-in-95 slide-in-from-bottom-4 duration-300
        `}

      >
        {/* Header */}
        {title ? (
          <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50 dark:border-slate-800">

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          onClose && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          )
        )}


        {/* Body */}
        <div className={`px-8 ${title ? 'py-6' : 'pt-10 pb-6'} overflow-y-auto max-h-[70vh]`}>

          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-8 py-5 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-50 dark:border-slate-800 flex items-center justify-end gap-3">

            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
