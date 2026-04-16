import React from 'react';

const Avatar = ({ 
  src, 
  alt = "User", 
  initials, 
  size = "md", // sm, md, lg, xl
  status, // online, offline, busy, away
  className = "" 
}) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl",
  };

  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
    away: "bg-amber-500",
  };

  const statusSizes = {
    sm: "h-2 w-2 border",
    md: "h-3 w-3 border-2",
    lg: "h-4 w-4 border-2",
    xl: "h-5 w-5 border-4",
  };

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      <div className={`
        ${sizes[size]} 
        rounded-2xl overflow-hidden flex items-center justify-center 
        bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 font-bold
        border-2 border-white dark:border-slate-800 shadow-sm
      `}>
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <span>{initials || alt.charAt(0).toUpperCase()}</span>
        )}
      </div>

      {status && (
        <span className={`
          absolute bottom-0 right-0 
          ${statusSizes[size]} 
          ${statusColors[status]} 
          rounded-full border-white dark:border-slate-800
        `} />
      )}
    </div>
  );
};

export default Avatar;
