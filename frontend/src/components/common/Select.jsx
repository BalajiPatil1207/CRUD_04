import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  name, 
  error, 
  placeholder = "Select an option",
  className = '', 
  ...props 
}) => {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className={`text-sm font-medium ml-0.5 transition-colors duration-200 ${
          hasError ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
        }`}>
          {label}
        </label>
      )}
      
      <div className="relative group">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none px-4 py-2.5 bg-white dark:bg-surface-card-dark border rounded-xl outline-none transition-all duration-200 text-gray-900 dark:text-gray-100 cursor-pointer ${
            hasError 
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'

          }`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
          <ChevronDown size={18} />
        </div>
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500 ml-0.5 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
