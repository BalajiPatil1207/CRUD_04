import React from 'react';

const Switch = ({ 
  label, 
  checked, 
  onChange, 
  name, 
  error, 
  className = '', 
  ...props 
}) => {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="flex items-center gap-3 cursor-pointer group w-fit">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={(e) => onChange?.({ target: { name, value: e.target.checked } })}
            className="peer sr-only"
            {...props}
          />
          
          <div className={`w-11 h-6 rounded-full transition-all duration-300 peer-checked:bg-blue-600 ${
            hasError 
              ? 'bg-red-200 dark:bg-red-900/30 border-red-500' 
              : 'bg-gray-200 dark:bg-gray-800'
          } group-hover:bg-opacity-80 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/20`} />
          
          <div className="absolute left-1 top-1 w-4 h-4 bg-white dark:bg-gray-200 rounded-full shadow-sm transition-all duration-300 peer-checked:translate-x-5" />
        </div>
        
        {label && (
          <span className={`text-sm font-medium transition-colors duration-200 ${
            hasError ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
          }`}>
            {label}
          </span>
        )}
      </label>

      {error && (
        <p className="text-xs font-medium text-red-500 ml-0.5 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default Switch;
