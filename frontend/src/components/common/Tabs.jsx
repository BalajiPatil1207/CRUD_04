import React, { useState } from 'react';

const Tabs = ({ tabs = [], defaultTab, onChange, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Headers */}
      <div className="flex items-center gap-1 bg-gray-50/50 dark:bg-slate-800/20 p-1 rounded-2xl border border-gray-100 dark:border-slate-700 w-max overflow-x-auto no-scrollbar mb-6">

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 whitespace-nowrap
              ${activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}
            `}
          >
            <div className="flex items-center gap-2">
              {tab.icon && React.createElement(tab.icon, { size: 16 })}
              {tab.label}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;
