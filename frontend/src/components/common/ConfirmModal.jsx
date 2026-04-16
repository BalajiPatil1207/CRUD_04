import React from 'react';
import { AlertTriangle, Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Are you sure?", 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  variant = "danger", // danger, warning, info, success
  isLoading = false 
}) => {
  
  const icons = {
    danger: <AlertCircle className="text-red-500" size={48} />,
    warning: <AlertTriangle className="text-amber-500" size={48} />,
    info: <Info className="text-blue-500" size={48} />,
    success: <CheckCircle2 className="text-emerald-500" size={48} />
  };

  const buttonVariants = {
    danger: "danger",
    warning: "primary", // Using primary with custom colors usually, but let's stick to our Button variants
    info: "primary",
    success: "primary"
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={null} // We handle the title inside for custom layout
      size="xs"
    >

      <div className="flex flex-col items-center text-center py-2 px-2">
        <div className="mb-3 p-4 rounded-full bg-gray-50 dark:bg-slate-800/50 animate-in zoom-in duration-500 ring-8 ring-gray-50/50 dark:ring-slate-800/20">
          {React.cloneElement(icons[variant], { size: 36 })}
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5 tracking-tight">
          {title}
        </h3>
        
        <p className="text-gray-500 dark:text-slate-400 text-[12px] leading-relaxed max-w-[220px]">
          {message}
        </p>

        <div className="flex items-center gap-3 mt-6 w-full">


          <Button 
            variant="secondary" 
            className="flex-1 dark:bg-slate-800 dark:hover:bg-slate-700" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>

          <Button 
            variant={buttonVariants[variant]} 
            className="flex-1" 
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
