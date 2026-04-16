import React from 'react';
import { Check } from 'lucide-react';

const Checkbox = ({ 
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
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={(e) => onChange?.({ target: { name, value: e.target.checked } })}
            className="peer sr-only"
            {...props}
          />
          
          <div className={`w-6 h-6 border-2 rounded-lg transition-all duration-200 peer-checked:bg-blue-600 peer-checked:border-blue-600 ${
            hasError 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
          } group-hover:border-blue-400 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/20`} />
          
          <div className="absolute opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all duration-200 text-white pointer-events-none">
            <Check size={16} strokeWidth={3} />
          </div>
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

export default Checkbox;
