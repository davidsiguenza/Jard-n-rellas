import React, { useState, useEffect, useRef } from 'react';
import { EditIcon, ViewIcon, DownloadIcon, AddIcon, UploadIcon, CloseIcon, CompareIcon, TrashIcon, DotsVerticalIcon, ChevronDownIcon, InformationCircleIcon, PdfIcon } from './icons/index';
import { TREE_NAMES } from '../constants';
import { useLanguage } from '../i18n/LanguageContext';
import { supportedLngs } from '../i18n/config';

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
  highlightedFilter: string;
  onHighlightFilterChange: (filter: string) => void;
  onToggleLegend: () => void;
  onPdfExport: () => void;
  isPrinting: boolean;
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
  highlightedFilter,
  onHighlightFilterChange,
  onToggleLegend,
  onPdfExport,
  isPrinting,
}) => {
  const { lng, t, changeLanguage } = useLanguage();
  const commonSelectClasses = "block w-full pl-3 pr-8 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm";
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const [treeTypes, setTreeTypes] = useState<{ genera: Map<string, any[]>, species: any[] }>({ genera: new Map(), species: [] });

  useEffect(() => {
    const genera = new Map<string, any[]>();
    const species = [];

    for (const [id, info] of TREE_NAMES.entries()) {
        if(id === 10) continue; // Skip '???'
        
        const speciesData = { id, name: info.common[lng] };
        if (info.genus) {
            const genusName = info.genus[lng];
            if (!genera.has(genusName)) {
                genera.set(genusName, []);
            }
            const speciesList = genera.get(genusName);
            if(speciesList){
                speciesList.push(speciesData);
            }
        } else {
            species.push(speciesData);
        }
    }

    for (const speciesList of genera.values()) {
        speciesList.sort((a, b) => a.name.localeCompare(b.name));
    }

    const sortedGenera = new Map([...genera.entries()].sort());
    species.sort((a, b) => a.name.localeCompare(b.name));

    setTreeTypes({ genera: sortedGenera, species });
}, [lng]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
            setIsActionsMenuOpen(false);
        }
        if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
            setIsLangMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const MenuItem = ({ onClick, icon, text, isDestructive = false, disabled = false }: {onClick: () => void, icon: React.ReactElement<{ className?: string }>, text: string, isDestructive?: boolean, disabled?: boolean}) => (
    <button
        onClick={() => {
            onClick();
            setIsActionsMenuOpen(false);
        }}
        className={`w-full text-left flex items-center space-x-3 px-4 py-2 text-sm ${
            isDestructive ? 'text-red-700' : 'text-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : `hover:${isDestructive ? 'bg-red-50' : 'bg-gray-100'}`} transition-colors`}
        role="menuitem"
        disabled={disabled}
    >
        {React.cloneElement(icon, { className: "w-5 h-5" })}
        <span>{text}</span>
    </button>
  );

  if (isMovingTree) {
    return (
      <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center space-x-4 animate-fade-in-up">
        <p className="text-sm font-medium text-blue-700 animate-pulse">{t('movingTree')}</p>
        <button
          onClick={onCancelMove}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          <CloseIcon className="w-4 h-4" />
          <span>{t('cancelMove')}</span>
        </button>
      </div>
    )
  }

  if (isCompareMode) {
    const sortedDates = [...availableDates].sort((a,b) => a.localeCompare(b));
    return (
      <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center space-x-4 flex-wrap gap-2">
         <div className="flex items-center space-x-2">
            <label htmlFor="date-a-select" className="text-sm font-medium text-gray-700">{t('compareLabel')}:</label>
            <select id="date-a-select" value={compareDates.dateA} onChange={(e) => onCompareDateChange('dateA', e.target.value)} className={commonSelectClasses}>
              {sortedDates.map((date) => <option key={date} value={date}>{date}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="date-b-select" className="text-sm font-medium text-gray-700">{t('withLabel')}:</label>
            <select id="date-b-select" value={compareDates.dateB} onChange={(e) => onCompareDateChange('dateB', e.target.value)} className={commonSelectClasses}>
              {sortedDates.map((date) => <option key={date} value={date}>{date}</option>)}
            </select>
          </div>
          <div className="h-8 border-l border-gray-300"></div>
          {isComparing && <span className="text-sm text-gray-600 animate-pulse">{t('comparing')}...</span>}
          <button
            onClick={onToggleCompareMode}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
            <span>{t('exitCompare')}</span>
          </button>
      </div>
    )
  }
  
  return (
    <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center space-x-4 flex-wrap gap-2">
        {!isEditMode ? (
            <>
                <div className="flex items-center space-x-2">
                    <label htmlFor="date-select" className="text-sm font-medium text-gray-700">{t('dateLabel')}:</label>
                    <select
                        id="date-select"
                        value={selectedDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className={commonSelectClasses}
                    >
                        {availableDates.map((date) => (
                            <option key={date} value={date}>{date}</option>
                        ))}
                    </select>
                </div>

                 <div className="flex items-center space-x-2">
                    <label htmlFor="tree-filter-select" className="text-sm font-medium text-gray-700">{t('highlightLabel')}:</label>
                    <select
                        id="tree-filter-select"
                        value={highlightedFilter}
                        onChange={(e) => onHighlightFilterChange(e.target.value)}
                        className={commonSelectClasses}
                    >
                        <option value="">{t('allTypes')}</option>
                        {treeTypes.species.map(({ id, name }) => (
                            <option key={`species-${id}`} value={`species:${id}`}>{name}</option>
                        ))}
                        {Array.from(treeTypes.genera.entries()).map(([genusName, speciesList]) => (
                            <optgroup key={`genus-${genusName}`} label={genusName}>
                                <option value={`genus:${genusName}`}>{t('allGenus', { genusName })}</option>
                                {speciesList.map(({ id, name }) => (
                                    <option key={`species-${id}`} value={`species:${id}`}>{name}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <div className="h-8 border-l border-gray-300"></div>

                <button
                    onClick={onToggleCompareMode}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <CompareIcon className="h-5 w-5" />
                    <span>{t('compare')}</span>
                </button>
            </>
        ) : (
             <>
                <button
                    onClick={onToggleEditMode}
                    className='flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 bg-yellow-500 text-white hover:bg-yellow-600'
                >
                    <ViewIcon className="h-5 w-5" />
                    <span>{t('viewMode')}</span>
                </button>
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
                    <span>{isAddingTree ? t('addTreeClick') : t('addTree')}</span>
                </button>
                <button
                    onClick={onSaveRequest}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <span>{t('saveAsNewVersion')}</span>
                </button>
            </>
        )}

        {/* Actions Menu */}
        <div className="h-8 border-l border-gray-300"></div>
        <div className="relative" ref={actionsMenuRef}>
            <button
                onClick={() => setIsActionsMenuOpen(prev => !prev)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                aria-haspopup="true"
                aria-expanded={isActionsMenuOpen}
                aria-label={t('actionsMenuLabel')}
            >
                <DotsVerticalIcon className="h-5 w-5 text-gray-700" />
            </button>

            {isActionsMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30 animate-fade-in-up transition-all duration-150">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {!isEditMode && (
                            <>
                                <MenuItem onClick={onToggleEditMode} icon={<EditIcon />} text={t('editMode')} />
                                <MenuItem onClick={onDownload} icon={<DownloadIcon />} text={t('downloadData')} />
                            </>
                        )}
                         <MenuItem onClick={onPdfExport} icon={<PdfIcon />} text={isPrinting ? t('generatingPdf') : t('exportToPdf')} disabled={isPrinting} />
                        <div className="border-t my-1 mx-2 border-gray-100"></div>
                        <MenuItem onClick={onImportRequest} icon={<UploadIcon />} text={t('importData')} />
                        <MenuItem onClick={onClearLocalStorage} icon={<TrashIcon />} text={t('clearLocalData')} isDestructive={true} />
                    </div>
                </div>
            )}
        </div>
        
        {/* Language Switcher */}
        <div className="relative" ref={langMenuRef}>
            <button
                onClick={() => setIsLangMenuOpen(prev => !prev)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-haspopup="true"
                aria-expanded={isLangMenuOpen}
            >
                <span>{supportedLngs[lng]}</span>
                <ChevronDownIcon className="w-4 h-4" />
            </button>
            {isLangMenuOpen && (
                 <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30 animate-fade-in-up transition-all duration-150">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {Object.entries(supportedLngs).map(([code, name]) => (
                            <button
                                key={code}
                                onClick={() => {
                                    changeLanguage(code as 'es' | 'gl');
                                    setIsLangMenuOpen(false);
                                }}
                                className={`w-full text-left block px-4 py-2 text-sm ${lng === code ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} hover:bg-gray-100 hover:text-gray-900`}
                                role="menuitem"
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                 </div>
            )}
        </div>

        {/* Legend Button */}
        <button
            onClick={onToggleLegend}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
            aria-label={t('showLegend')}
        >
            <InformationCircleIcon className="h-5 w-5 text-gray-700" />
        </button>
    </div>
  );
};

export default Toolbar;