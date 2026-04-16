import React, { useRef, useEffect } from 'react';

const TextArea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  name, 
  error, 
  autoHeight = false,
  className = '', 
  rows = 4,
  ...props 
}) => {
  const textareaRef = useRef(null);
  const hasError = Boolean(error);

  useEffect(() => {
    if (autoHeight && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoHeight]);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className={`text-sm font-medium ml-0.5 transition-colors duration-200 ${
          hasError ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
        }`}>
          {label}
        </label>
      )}
      
      <textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 bg-white dark:bg-surface-card-dark border rounded-xl outline-none transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 resize-none ${
          hasError 
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
            : 'border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'

        }`}
        {...props}
      />

      {error && (
        <p className="text-xs font-medium text-red-500 ml-0.5 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;
