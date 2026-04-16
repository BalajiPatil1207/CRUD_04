import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';

const FileUpload = ({ name, label, onChange, accept, multiple = false, error, className = '' }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const hasError = Boolean(error);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      updateFiles(newFiles);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      updateFiles(newFiles);
    }
  };

  const updateFiles = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    let finalValue;
    if (multiple) {
      finalValue = [...files, ...newFiles];
      setFiles(finalValue);
    } else {
      finalValue = newFiles[0];
      setFiles([finalValue]);
    }

    if (onChange) {
      console.log(`[FileUpload] Sending ${name || label}:`, finalValue);
      onChange({
        target: { name: name || label, value: finalValue }
      });
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    
    let finalValue;
    if (multiple) {
      finalValue = updatedFiles;
    } else {
      finalValue = updatedFiles[0] || null;
    }

    if (onChange) {
      console.log(`[FileUpload] Removal Sending ${name || label}:`, finalValue);
      onChange({
        target: { name: name || label, value: finalValue }
      });
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className={`text-sm font-medium ml-0.5 transition-colors duration-200 ${
          hasError ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'
        }`}>
          {label}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer ${
          dragActive 
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' 
            : hasError 
              ? 'border-red-500 bg-red-50/50 dark:bg-red-900/10' 
              : 'border-gray-200 dark:border-slate-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900'

        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
        />

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400 group-hover:text-blue-500 transition-colors">
            <Upload size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              Click or drag file to upload
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              PNG, JPG, PDF up to 10MB
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 bg-white dark:bg-surface-card-dark border border-gray-100 dark:border-slate-800 rounded-xl group animate-in slide-in-from-top-1 duration-200"
            >

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg">
                  <FileText size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[180px]">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-red-500 ml-0.5 mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
