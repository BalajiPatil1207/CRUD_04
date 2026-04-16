import React from 'react';

const RadioGroup = ({ 
  label, 
  name, 
  options = [], 
  value, 
  onChange, 
  error, 
  className = '',
  orientation = 'vertical' 
}) => {
  const hasError = Boolean(error);

  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {label && (
        <label className={`text-sm font-medium ml-0.5 transition-colors duration-200 ${
          hasError ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
        }`}>
          {label}
        </label>
      )}

      <div className={`flex ${orientation === 'horizontal' ? 'flex-row gap-6' : 'flex-col gap-3'}`}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-3 cursor-pointer group w-fit">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="peer sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded-full transition-all duration-200 peer-checked:border-blue-600 ${
                hasError 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
              } group-hover:border-blue-400 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/20`} />
              
              <div className="absolute w-2.5 h-2.5 bg-blue-600 rounded-full opacity-0 scale-50 peer-checked:opacity-100 peer-checked:scale-100 transition-all duration-200 pointer-events-none" />
            </div>
            
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {option.label}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500 ml-0.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default RadioGroup;
