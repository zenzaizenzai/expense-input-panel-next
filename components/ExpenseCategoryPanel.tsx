import React, { useState, useRef, useEffect } from 'react';
import type { Category } from '../types';

interface ExpenseCategoryPanelProps {
  category: Category;
  onClick: (label: string) => void;
  onUpdate: (id: string, newLabel: string) => void;
}

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);


const ExpenseCategoryPanel: React.FC<ExpenseCategoryPanelProps> = ({ category, onClick, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(category.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (label.trim() === '') {
      setLabel(category.label); // Revert if empty
    } else if (label.trim() !== category.label) {
      onUpdate(category.id, label.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setLabel(category.label);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-md border-2 border-indigo-400 aspect-w-1 aspect-h-1 flex items-center justify-center">
        <input
          ref={inputRef}
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full text-center bg-transparent focus:outline-none text-slate-700 font-semibold text-sm sm:text-base"
        />
      </div>
    );
  }


  const isIncome = category.type === 'income';
  const containerClasses = isIncome
    ? "relative group bg-blue-50 p-4 rounded-lg shadow-md hover:shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
    : "relative group bg-white p-4 rounded-lg shadow-md hover:shadow-lg border-2 border-transparent hover:border-indigo-400 transition-all duration-200 ease-in-out transform hover:-translate-y-1";

  const editButtonClasses = isIncome
    ? "absolute top-1 right-1 p-1 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
    : "absolute top-1 right-1 p-1 text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full";

  return (
    <div className={containerClasses}>
      <button
        onClick={() => onClick(category.label)}
        className="w-full h-full aspect-w-1 aspect-h-1 flex items-center justify-center focus:outline-none"
        aria-label={`Add expense for ${category.label}`}
      >
        <span className="text-slate-700 font-semibold text-center text-sm sm:text-base">{category.label}</span>
      </button>
      <button
        onClick={() => setIsEditing(true)}
        className={editButtonClasses}
        aria-label={`Edit category name for ${category.label}`}
        title="ラベルを編集"
      >
        <EditIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ExpenseCategoryPanel;
