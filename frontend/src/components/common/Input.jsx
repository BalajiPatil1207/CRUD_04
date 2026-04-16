import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name, 
  className = '', 
  icon: Icon, 
  iconPosition = 'left', 
  error,
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
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 bg-white dark:bg-surface-card-dark border rounded-xl outline-none transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 ${
            Icon && iconPosition === 'left' ? 'pl-11' : ''
          } ${
            Icon && iconPosition === 'right' ? 'pr-11' : ''
          } ${
            hasError 
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'

          }`}
          {...props}
        />

        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500 ml-0.5 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;

