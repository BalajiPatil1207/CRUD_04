import React from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center text-sm ${className}`}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <a 
                  href={item.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  {item.label}
                </a>
              ) : (
                <span className={`font-bold ${isLast ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <ChevronRight size={14} className="text-gray-300 dark:text-gray-700" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
