import React from 'react';
import { Database } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = Database, 
  title = "No data found", 
  description = "We couldn't find what you're looking for. Try adjusting your filters or adding new data.",
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center rounded-3xl bg-gray-50/50 dark:bg-slate-900/20 border border-dashed border-gray-200 dark:border-slate-800 ${className}`}>
      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 animate-bounce-slow">
        <Icon size={32} />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">
        {description}
      </p>

      {action && (
        <div className="flex items-center justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
