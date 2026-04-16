import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

const DatePicker = ({ name, label, value, onChange, placeholder = "Select date", error, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef(null);
  const hasError = Boolean(error);

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (!isOpen) {
      setShowMonthSelect(false);
      setShowYearSelect(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  };

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Previous month filler
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    const prevYear = prevMonth.getFullYear();
    const prevMonthVal = prevMonth.getMonth();

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, month: prevMonthVal, year: prevYear, current: false });
    }
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, month: month, year, current: true });
    }
    // Next month filler
    const totalSlots = 42;
    const remainingSlots = totalSlots - days.length;
    const nextMonth = new Date(year, month + 1, 1);
    const nextMonthVal = nextMonth.getMonth();
    const nextYear = nextMonth.getFullYear();

    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ day: i, month: nextMonthVal, year: nextYear, current: false });
    }
    
    return days;
  }, [viewDate]);

  const triggerChange = (val) => {
    onChange?.({
      target: {
        name: name || label,
        value: val
      }
    });
  };

  const handleDateSelect = (dayObj) => {
    // Manually format date string to avoid timezone shifts from toISOString()
    const y = dayObj.year;
    const m = String(dayObj.month + 1).padStart(2, '0');
    const d = String(dayObj.day).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;
    triggerChange(dateString);
    setIsOpen(false);
  };

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const changeYear = (year) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
  };

  const isSelected = (day, month, year) => {
    if (!value) return false;
    const d = new Date(value);
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  };

  const isToday = (day, month, year) => {
    const d = new Date();
    return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
  };

  const [showMonthSelect, setShowMonthSelect] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const yearListRef = useRef(null);
  const selectedYearRef = useRef(null);

  useEffect(() => {
    if (showYearSelect && selectedYearRef.current) {
      selectedYearRef.current.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  }, [showYearSelect]);


  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1000 + 51 }, (_, i) => 1000 + i);


  return (
    <div className={`flex flex-col gap-1.5 relative ${className}`} ref={containerRef}>
      {label && (
        <label className={`text-sm font-medium ml-0.5 transition-colors duration-200 ${
          hasError ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
        }`}>
          {label}
        </label>
      )}

      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-surface-card-dark border rounded-xl cursor-pointer transition-all duration-200 group ${
          hasError 
            ? 'border-red-500 ring-2 ring-red-500/20' 
            : 'border-gray-200 dark:border-slate-700 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 shadow-sm'
        }`}
      >
        <CalendarIcon size={18} className={`transition-colors ${
          hasError ? 'text-red-500' : 'text-gray-400 group-hover:text-blue-500'
        }`} />
        <span className={`text-sm select-none flex-1 truncate ${
          value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600'
        }`}>
          {value ? formatDate(value) : placeholder}
        </span>
        {value && (
          <X 
            size={14} 
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer" 
            onClick={(e) => {
              e.stopPropagation();
              triggerChange('');
            }}
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[300px] bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in duration-200 origin-top-left">
          {/* Calendar Header with Custom Dropdowns */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              {/* Month Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowMonthSelect(!showMonthSelect)}
                  className="flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 text-sm hover:text-blue-600 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  {months[viewDate.getMonth()]}
                </button>
                {showMonthSelect && (
                  <div className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl z-[60] py-2 max-h-60 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                    {months.map((m, i) => (
                      <button
                        key={m}
                        onClick={() => {
                          setViewDate(new Date(viewDate.getFullYear(), i, 1));
                          setShowMonthSelect(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                          viewDate.getMonth() === i 
                            ? 'bg-blue-600 text-white font-bold' 
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Selector */}
              <div className="relative">
                <button 
                  onClick={() => setShowYearSelect(!showYearSelect)}
                  className="flex items-center gap-1 font-bold text-gray-900 dark:text-gray-100 text-sm hover:text-blue-600 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  {viewDate.getFullYear()}
                </button>
                {showYearSelect && (
                  <div 
                    ref={yearListRef}
                    className="absolute top-full left-0 mt-2 w-24 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl z-[60] py-2 max-h-60 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    {years.map(y => {
                      const isYearSelected = viewDate.getFullYear() === y;
                      return (
                        <button
                          key={y}
                          ref={isYearSelected ? selectedYearRef : null}
                          onClick={() => {
                            changeYear(y);
                            setShowYearSelect(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                            isYearSelected 
                              ? 'bg-blue-600 text-white font-bold' 
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {y}
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors cursor-pointer"
                type="button"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => changeMonth(1)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors cursor-pointer"
                type="button"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>


          {/* Days Week Header */}
          <div className="grid grid-cols-7 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="text-center text-[11px] font-bold text-gray-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarData.map((d, i) => {
              const selected = isSelected(d.day, d.month, d.year);
              const today = isToday(d.day, d.month, d.year);
              
              return (
                <button
                  key={i}
                  onClick={() => handleDateSelect(d)}
                  className={`
                    h-8 w-8 text-xs rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer
                    ${!d.current ? 'text-gray-300 dark:text-gray-700' : 'text-gray-700 dark:text-gray-300'}
                    ${selected ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600'}
                    ${today && !selected ? 'border border-blue-200 dark:border-blue-800 text-blue-600' : ''}
                  `}
                  type="button"
                >
                  {d.day}
                </button>
              );
            })}
          </div>

          {/* Calendar Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
            <button 
              onClick={() => {
                triggerChange('');
                setIsOpen(false);
              }}
              className="text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors cursor-pointer uppercase tracking-wider"
              type="button"
            >
              Clear
            </button>
            <button 
              onClick={() => {
                const now = new Date();
                const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                triggerChange(todayStr);
                setIsOpen(false);
              }}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer uppercase tracking-wider"
              type="button"
            >
              Today
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-red-500 ml-0.5 mt-0.5 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};


export default DatePicker;

