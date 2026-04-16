import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AccordionItem = ({ title, children, isOpen, onClick }) => {
  return (
    <div className="border border-gray-100 dark:border-slate-700 rounded-3xl overflow-hidden mb-3 bg-white dark:bg-surface-card-dark transition-all duration-300">

      <button
        onClick={onClick}
        className="w-full px-8 py-5 flex items-center justify-between text-left group"
      >
        <span className="font-bold text-gray-900 dark:text-white transition-colors group-hover:text-brand-500">
          {title}
        </span>
        <ChevronDown 
          className={`text-gray-400 transition-transform duration-500 ${isOpen ? 'rotate-180 text-brand-500' : ''}`} 
          size={20} 
        />
      </button>
      
      <div 
        className={`
          overflow-hidden transition-all duration-500 ease-in-out
          ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-8 pb-6 text-gray-500 dark:text-slate-400 text-sm leading-relaxed border-t border-gray-50 dark:border-slate-800/50 pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const Accordion = ({ items = [], allowMultiple = false }) => {
  const [openIndexes, setOpenIndexes] = useState([0]);

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenIndexes(prev => 
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    } else {
      setOpenIndexes(prev => prev.includes(index) ? [] : [index]);
    }
  };

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openIndexes.includes(index)}
          onClick={() => toggleItem(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
