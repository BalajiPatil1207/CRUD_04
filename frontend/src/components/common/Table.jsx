import React from 'react';

const Table = ({ 
  columns = [], 
  data = [], 
  className = '', 
  hoverable = true,
  striped = false,
  ...props 
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm ${className}`}>

      <table className="w-full text-left border-collapse" {...props}>
        <thead className="bg-gray-50/80 dark:bg-gray-800/50 backdrop-blur-md sticky top-0 z-10">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800"

              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">

          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr 
                key={rowIdx} 
                className={`
                  transition-colors
                  ${hoverable ? 'hover:bg-blue-50/30 dark:hover:bg-blue-900/5' : ''}
                  ${striped && rowIdx % 2 !== 0 ? 'bg-gray-50/30 dark:bg-gray-800/10' : 'bg-white dark:bg-surface-card-dark'}
                `}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-12 text-center text-gray-400 italic bg-white dark:bg-surface-card-dark"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
