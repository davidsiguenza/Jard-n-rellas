
import React from 'react';
import { EditIcon, ViewIcon, DownloadIcon, AddIcon, UploadIcon, CloseIcon, CompareIcon, TrashIcon } from './icons';

interface ToolbarProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  isAddingTree: boolean;
  onToggleAddTreeMode: () => void;
  availableDates: string[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onDownload: () => void;
  onSaveRequest: () => void;
  onImportRequest: () => void;
  isMovingTree: boolean;
  onCancelMove: () => void;
  isCompareMode: boolean;
  onToggleCompareMode: () => void;
  compareDates: { dateA: string; dateB: string };
  onCompareDateChange: (which: 'dateA' | 'dateB', value: string) => void;
  isComparing: boolean;
  onClearLocalStorage: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  isEditMode,
  onToggleEditMode,
  isAddingTree,
  onToggleAddTreeMode,
  availableDates,
  selectedDate,
  onDateChange,
  onDownload,
  onSaveRequest,
  onImportRequest,
  isMovingTree,
  onCancelMove,
  isCompareMode,
  onToggleCompareMode,
  compareDates,
  onCompareDateChange,
  isComparing,
  onClearLocalStorage,
}) => {
  const commonSelectClasses = "block w-full pl-3 pr-8 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm";

  if (isMovingTree) {
    return (
      <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center space-x-4 animate-fade-in-up">
        <p className="text-sm font-medium text-blue-700 animate-pulse">Moving tree... Click on the map to place it.</p>
        <button
          onClick={onCancelMove}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          <CloseIcon className="w-4 h-4" />
          <span>Cancel Move</span>
        </button>
      </div>
    )
  }

  if (isCompareMode) {
    const sortedDates = [...availableDates].sort((a,b) => a.localeCompare(b));
    return (
      <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center space-x-4 flex-wrap gap-2">
         <div className="flex items-center space-x-2">
            <label htmlFor="date-a-select" className="text-sm font-medium text-gray-700">Compare:</label>
            <select id="date-a-select" value={compareDates.dateA} onChange={(e) => onCompareDateChange('dateA', e.target.value)} className={commonSelectClasses}>
              {sortedDates.map((date) => <option key={date} value={date}>{date}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="date-b-select" className="text-sm font-medium text-gray-700">with:</label>
            <select id="date-b-select" value={compareDates.dateB} onChange={(e) => onCompareDateChange('dateB', e.target.value)} className={commonSelectClasses}>
              {sortedDates.map((date) => <option key={date} value={date}>{date}</option>)}
            </select>
          </div>
          <div className="h-8 border-l border-gray-300"></div>
          {isComparing && <span className="text-sm text-gray-600 animate-pulse">Comparing...</span>}
          <button
            onClick={onToggleCompareMode}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
            <span>Exit Compare</span>
          </button>
      </div>
    )
  }
  
  return (
    <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center space-x-4 flex-wrap gap-2">
      {!isEditMode && (
        <div className="flex items-center space-x-2">
          <label htmlFor="date-select" className="text-sm font-medium text-gray-700">
            Date:
          </label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className={commonSelectClasses}
          >
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="h-8 border-l border-gray-300"></div>

      <button
        onClick={onToggleEditMode}
        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
          isEditMode
            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
            : 'bg-green-500 text-white hover:bg-green-600'
        }`}
      >
        {isEditMode ? <ViewIcon className="h-5 w-5" /> : <EditIcon className="h-5 w-5" />}
        <span>{isEditMode ? 'View Mode' : 'Edit Mode'}</span>
      </button>

      {isEditMode && (
        <>
          <button
            onClick={onToggleAddTreeMode}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isAddingTree
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
            }`}
            aria-pressed={isAddingTree}
          >
            <AddIcon className="h-5 w-5" />
            <span>{isAddingTree ? 'Click map to place' : 'Add Tree'}</span>
          </button>
          <button
            onClick={onSaveRequest}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span>Save as New Version...</span>
          </button>
        </>
      )}

      {!isEditMode && (
        <>
           <button
            onClick={onToggleCompareMode}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CompareIcon className="h-5 w-5" />
            <span>Compare</span>
          </button>
          <button
            onClick={onDownload}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <DownloadIcon className="h-5 w-5" />
            <span>Download Data</span>
          </button>
        </>
      )}

      <button
        onClick={onImportRequest}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
      >
        <UploadIcon className="h-5 w-5" />
        <span>Import Data</span>
      </button>

      <button
        onClick={onClearLocalStorage}
        title="Clear all locally saved garden versions"
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
      >
        <TrashIcon className="h-5 w-5" />
        <span>Clear Local Data</span>
      </button>
    </div>
  );
};

export default Toolbar;
