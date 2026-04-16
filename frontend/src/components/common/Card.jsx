import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  footer, 
  className = '', 
  headerAction,
  hoverable = false,
  noPadding = false,
  bordered = true,
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-white dark:bg-surface-card-dark 
        rounded-3xl
        transition-all duration-300
        ${bordered ? 'border border-gray-100 dark:border-slate-800' : ''}
        ${hoverable ? 'hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 hover:-translate-y-1' : 'shadow-sm'}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-5 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between gap-4 rounded-t-3xl bg-inherit">
          <div>
            {title && <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div className={`${noPadding ? '' : 'p-6'}`}>
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-50 dark:border-slate-800 rounded-b-3xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
