import React from 'react';

const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  label, 
  showPercentage = false, 
  variant = 'primary',
  size = 'md',
  className = '' 
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const variants = {
    primary: 'bg-blue-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-sky-500'
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</span>}
          {showPercentage && <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{percentage}%</span>}
        </div>
      )}
      
      <div className={`w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className={`h-full ${variants[variant]} transition-all duration-500 ease-out rounded-full shadow-sm`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
