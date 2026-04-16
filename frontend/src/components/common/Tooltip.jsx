import React, { useState } from 'react';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-t-gray-900 dark:border-t-gray-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-b-gray-900 dark:border-b-gray-800',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-l-gray-900 dark:border-l-gray-800',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1 border-r-gray-900 dark:border-r-gray-800',
  };

  return (
    <div 
      className="relative inline-block w-fit"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`
          absolute z-[200] px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-[11px] font-bold 
          rounded-lg whitespace-nowrap shadow-xl animate-in fade-in zoom-in-95 duration-200
          ${positions[position]}
        `}>
          {content}
          <div className={`absolute border-4 border-transparent ${arrows[position]}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
