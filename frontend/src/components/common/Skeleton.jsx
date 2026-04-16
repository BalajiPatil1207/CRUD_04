import React from 'react';

const Skeleton = ({ 
  variant = 'text', 
  width, 
  height, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-800 animate-pulse";
  
  const variants = {
    text: "h-3 w-full rounded-md mt-1 mb-1",
    circular: "rounded-full",
    rectangular: "rounded-2xl",
  };

  const style = {
    width: width || (variant === 'circular' ? '40px' : undefined),
    height: height || (variant === 'circular' ? '40px' : undefined),
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant] || variants.rectangular} ${className}`} 
      style={style}
      {...props}
    />
  );
};

export default Skeleton;
