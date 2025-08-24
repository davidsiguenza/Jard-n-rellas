import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GardenState, Tree, TreeSize, TreeStatus, DiffTree, TreeDiffStatus } from './types';
import { TREE_NAMES } from './constants';
import GardenMap from './GardenMap';
import Toolbar from './components/Toolbar';
import TreeInfoModal from './components/TreeInfoModal';
import { PlusIcon, MinusIcon, FitScreenIcon, ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, CloseIcon } from './components/icons/index';
import { useLanguage } from './i18n/LanguageContext';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 5;
const ZOOM_SENSITIVITY = 0.001;
const PAN_STEP = 50;

// Helper functions for touch controls
const getTouchDistance = (t1: React.Touch, t2: React.Touch) => {
    return Math.sqrt(Math.pow(t1.clientX - t2.clientX, 2) + Math.pow(t1.clientY - t2.clientY, 2));
};

const getTouchMidpoint = (t1: React.Touch, t2: React.Touch) => {
    return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
};

const CompareLegend: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="absolute bottom-4 left-4 z-20 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg text-xs text-gray-700">
      <h3 className="font-bold mb-2 text-sm">{t('compareLegendTitle')}</h3>
      <div className="space-y-1">
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 border border-green-300 mr-2"></div> {t('legendAdded')}</div>
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 border border-red-300 mr-2"></div> {t('legendRemoved')}</div>
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-300 mr-2"></div> {t('legendMovedNew')}</div>
        <div className="flex items-center"><div className="w-3 h-3 rounded-full border-2 border-dashed border-sky-400 mr-2"></div> {t('legendMovedOld')}</div>
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-purple-500 border border-purple-300 mr-2"></div> {t('legendModified')}</div>
        <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-600 opacity-60 mr-2"></div> {t('legendUnchanged')}</div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { t, lng } = useLanguage();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isAddingTree, setIsAddingTree] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const [manifestVersions, setManifestVersions] = useState<Map<string, string>>(new Map());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [cachedStates, setCachedStates] = useState<Map<string, GardenState>>(new Map());
  
  const [activeGardenState, setActiveGardenState] = useState<GardenState | null>(null);
  const [selectedTree, setSelectedTree] = useState<Tree | DiffTree | null>(null);

  const [editedTrees, setEditedTrees] = useState<Tree[] | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newVersionDate, setNewVersionDate] = useState('');

  const [movingTreeUuid, setMovingTreeUuid] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  
  const lastPanPointRef = useRef<{ x: number; y: number } | null>(null);
  const pinchStartRef = useRef<{
    dist: number;
    midpoint: { x: number; y: number };
    pan: { x: number; y: number };
    zoom: number;
  } | null>(null);
  
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [compareDates, setCompareDates] = useState({ dateA: '', dateB: '' });
  const [diffs, setDiffs] = useState<DiffTree[] | null>(null);
  const [highlightedFilter, setHighlightedFilter] = useState<string>('');

  useEffect(() => {
    const getStoredHistory = (): GardenState[] => {
      const stored = localStorage.getItem('gardenHistory');
      return stored ? JSON.parse(stored) : [];
    };

    const loadInitialData = async () => {
      let manifestMap = new Map<string, string>();
      try {
        const response = await fetch('data/manifest.json');
        if (!response.ok) throw new Error('Failed to fetch manifest');
        const manifest = await response.json();
        
        manifest.versions.forEach((v: {date: string, path: string}) => {
          manifestMap.set(v.date, v.path);
        });
        setManifestVersions(manifestMap);
      } catch (error) {
        console.error("Could not load manifest.json:", error);
        alert(t('alert_manifestError'));
      }
      
      const storedHistory = getStoredHistory();
      const localStates = new Map<string, GardenState>();
      storedHistory.forEach(state => {
        localStates.set(state.date, state);
      });
      setCachedStates(localStates);

      const allDates = [...new Set([...manifestMap.keys(), ...localStates.keys()])];
      allDates.sort((a, b) => b.localeCompare(a)); 
      
      setAvailableDates(allDates);

      if (allDates.length > 0) {
        setSelectedDate(allDates[0]);
      }
    };

    loadInitialData();
  }, [t]);
  
  const fetchAndCacheState = useCallback(async (date: string): Promise<GardenState | null> => {
    if (cachedStates.has(date)) return cachedStates.get(date)!;
    
    if (manifestVersions.has(date)) {
        try {
            const path = manifestVersions.get(date)!;
            const response = await fetch(path);
            if (!response.ok) throw new Error(`Failed to fetch ${path}`);
            const gardenState: GardenState = await response.json();
            
            setCachedStates(prev => new Map(prev).set(date, gardenState));
            return gardenState;
        } catch (error) {
            console.error(`Error loading garden state for ${date}:`, error);
            alert(t('alert_loadStateError', { date }));
            return null;
        }
    }
    return null;
  }, [cachedStates, manifestVersions, t]);

  useEffect(() => {
    if (!selectedDate || isCompareMode) return;

    const loadGardenState = async () => {
      const state = await fetchAndCacheState(selectedDate);
      setActiveGardenState(state);
      setEditedTrees(null);
    };
    loadGardenState();
  }, [selectedDate, fetchAndCacheState, isCompareMode]);
  
  useEffect(() => {
    if (!isCompareMode || !compareDates.dateA || !compareDates.dateB) {
      setDiffs(null);
      return;
    }

    const computeDiffs = async () => {
      setIsComparing(true);
      const stateA = await fetchAndCacheState(compareDates.dateA);
      const stateB = await fetchAndCacheState(compareDates.dateB);

      if (!stateA || !stateB) {
        setDiffs([]);
        setIsComparing(false);
        return;
      }

      const treesA = new Map(stateA.trees.map(t => [t.uuid, t]));
      const treesB = new Map(stateB.trees.map(t => [t.uuid, t]));
      const newDiffs: DiffTree[] = [];

      for (const [uuid, treeB] of treesB.entries()) {
        const treeA = treesA.get(uuid);
        if (!treeA) {
          newDiffs.push({ ...treeB, diffStatus: TreeDiffStatus.Added });
        } else {
          const isMoved = treeA.position.x !== treeB.position.x || treeA.position.y !== treeB.position.y;
          const isChanged = treeA.name !== treeB.name || treeA.status !== treeB.status || treeA.size !== treeB.size;

          if (isMoved || isChanged) {
            const status = isMoved ? TreeDiffStatus.Moved : TreeDiffStatus.Changed;
            newDiffs.push({ ...treeB, diffStatus: status, previous: treeA });
          } else {
            newDiffs.push({ ...treeB, diffStatus: TreeDiffStatus.Unchanged });
          }
        }
      }
      
      for (const [uuid, treeA] of treesA.entries()) {
        if (!treesB.has(uuid)) {
          newDiffs.push({ ...treeA, diffStatus: TreeDiffStatus.Removed });
        }
      }

      setDiffs(newDiffs);
      setIsComparing(false);
    };

    computeDiffs();
  }, [isCompareMode, compareDates, fetchAndCacheState]);

  const updateLocalStorageHistory = (newState: GardenState) => {
    const storedHistoryJSON = localStorage.getItem('gardenHistory');
    const storedHistory: GardenState[] = storedHistoryJSON ? JSON.parse(storedHistoryJSON) : [];
    
    const otherVersions = storedHistory.filter(g => g.date !== newState.date);
    const newHistory = [...otherVersions, newState];
    localStorage.setItem('gardenHistory', JSON.stringify(newHistory));
  };

  const handleDateChange = (date: string) => {
    setHighlightedFilter('');
    if (isEditMode) {
      if (confirm(t('alert_changeDateWarning'))) {
          setIsEditMode(false);
          setEditedTrees(null);
          setIsAddingTree(false);
          setMovingTreeUuid(null);
          setSelectedDate(date);
      }
    } else {
      setSelectedDate(date);
    }
  };

  const handleToggleEditMode = () => {
    setHighlightedFilter('');
    if (isCompareMode) return;
    setIsEditMode(prev => {
        if (prev) {
            setEditedTrees(null);
            setIsAddingTree(false);
            setMovingTreeUuid(null);
            return false;
        } else {
            setEditedTrees(JSON.parse(JSON.stringify(activeGardenState!.trees)));
            return true;
        }
    });
  };

  const handleToggleCompareMode = () => {
    setHighlightedFilter('');
    setIsCompareMode(prev => {
      const newMode = !prev;
      if (newMode) {
        if (isEditMode) {
          setIsEditMode(false);
          setEditedTrees(null);
          setIsAddingTree(false);
          setMovingTreeUuid(null);
        }
        if (availableDates.length >= 2) {
          const sorted = [...availableDates].sort((a,b) => a.localeCompare(b));
          setCompareDates({ dateA: sorted[sorted.length - 2], dateB: sorted[sorted.length - 1] });
        } else if (availableDates.length === 1) {
          setCompareDates({ dateA: availableDates[0], dateB: availableDates[0] });
        }
      } else { 
        setDiffs(null);
      }
      return newMode;
    });
  };

  const handleCompareDateChange = (which: 'dateA' | 'dateB', value: string) => {
    setCompareDates(prev => ({...prev, [which]: value}));
  };
  
  const handleToggleAddTreeMode = () => {
    setIsAddingTree(prev => !prev);
    if (movingTreeUuid) setMovingTreeUuid(null);
  }

  const handleHighlightFilterChange = (filter: string) => {
    setHighlightedFilter(filter);
  };

  const downloadGardenState = (gardenState: GardenState) => {
    const dataStr = JSON.stringify(gardenState, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `garden_data_${gardenState.date}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleDownloadCurrentView = () => {
      if (activeGardenState) {
        downloadGardenState(activeGardenState);
      }
  };

  const handleSaveRequest = () => {
      setNewVersionDate(new Date().toISOString().split('T')[0]);
      setIsSaveModalOpen(true);
  };
  
  const handleSaveNewVersion = () => {
      if (!newVersionDate) {
          alert(t('alert_selectDate'));
          return;
      }
      if (availableDates.includes(newVersionDate)) {
          if (!confirm(t('alert_overwriteVersion', { date: newVersionDate }))) {
              return;
          }
      }

      const newGardenState: GardenState = { date: newVersionDate, trees: editedTrees! };
      
      updateLocalStorageHistory(newGardenState);

      setCachedStates(prev => new Map(prev).set(newVersionDate, newGardenState));
      setAvailableDates(prev => [...new Set([newVersionDate, ...prev])].sort((a, b) => b.localeCompare(a)));
      
      downloadGardenState(newGardenState);

      setIsSaveModalOpen(false);
      setEditedTrees(null);
      setIsEditMode(false);
      setSelectedDate(newVersionDate);
  };

  const handleImportRequest = () => {
      fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const result = event.target?.result as string;
              const importedState: GardenState = JSON.parse(result);

              if (!importedState.date || !Array.isArray(importedState.trees)) {
                  throw new Error(t('alert_invalidFileFormat'));
              }

              if (availableDates.includes(importedState.date)) {
                  if (!confirm(t('alert_overwriteVersion', { date: importedState.date }))) {
                      if (e.target) e.target.value = '';
                      return;
                  }
              }
              
              updateLocalStorageHistory(importedState);
              
              setCachedStates(prev => new Map(prev).set(importedState.date, importedState));
              setAvailableDates(prev => [...new Set([importedState.date, ...prev])].sort((a, b) => b.localeCompare(a)));

              alert(t('alert_importSuccess', { date: importedState.date }));
              setSelectedDate(importedState.date);
          } catch (error) {
              console.error("Failed to import file:", error);
              const errorMessage = error instanceof Error ? error.message : String(error);
              alert(t('alert_importError', { error: errorMessage }));
          } finally {
              if (e.target) e.target.value = '';
          }
      };
      reader.readAsText(file);
  };

  const handleClearLocalStorage = () => {
    if (confirm(t('alert_clearLocalData'))) {
        localStorage.removeItem('gardenHistory');
        alert(t('alert_localDataCleared'));
        window.location.reload();
    }
  };
  
  const handleTreeClick = (tree: Tree | DiffTree) => {
    if (isAddingTree || movingTreeUuid) return;
    if (isCompareMode && (tree as DiffTree).diffStatus === TreeDiffStatus.Unchanged) return;
    if (highlightedFilter) {
        const [type, value] = highlightedFilter.split(':');
        if (!type || !value) return;

        const treeInfo = TREE_NAMES.get(tree.id);
        let isHighlighted = false;
        if (type === 'genus') {
            isHighlighted = treeInfo?.genus?.[lng] === value;
        } else if (type === 'species') {
            isHighlighted = tree.id === parseInt(value, 10);
        }

        if(!isHighlighted) return;
    }
    setSelectedTree(tree);
  };
  
  const handleCloseModal = () => {
    setSelectedTree(null);
  };

  const handleSaveTree = (updatedTree: Tree) => {
    if (!editedTrees) return;
    const treeExists = editedTrees.some(t => t.uuid === updatedTree.uuid);
    let newTrees;
    if (treeExists) {
        newTrees = editedTrees.map(t => t.uuid === updatedTree.uuid ? updatedTree : t);
    } else {
        newTrees = [...editedTrees, updatedTree];
    }
    setEditedTrees(newTrees);
  };
  
  const handleDeleteTree = (treeUuid: string) => {
    if (!editedTrees) return;
    setEditedTrees(editedTrees.filter(t => t.uuid !== treeUuid));
  };
  
  const handleStartMoveTree = (treeUuid: string) => {
    setMovingTreeUuid(treeUuid);
    setSelectedTree(null);
  };

  const handleCancelMove = () => {
    setMovingTreeUuid(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || isAddingTree || movingTreeUuid) return; 
    setIsPanning(true);
    lastPanPointRef.current = { x: e.clientX, y: e.clientY };
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isPanning || !lastPanPointRef.current) return;
      const dx = e.clientX - lastPanPointRef.current.x;
      const dy = e.clientY - lastPanPointRef.current.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPanPointRef.current = { x: e.clientX, y: e.clientY };
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    lastPanPointRef.current = null;
  }, []);
  
  useEffect(() => {
    if (isPanning) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, handleMouseMove, handleMouseUp]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mapX = (x - pan.x) / zoom;
    const mapY = (y - pan.y) / zoom;

    const percentX = (mapX / rect.width) * 100;
    const percentY = (mapY / rect.height) * 100;

    if (movingTreeUuid) {
        const newTrees = editedTrees!.map(t =>
            t.uuid === movingTreeUuid ? { ...t, position: { x: percentX, y: percentY } } : t
        );
        setEditedTrees(newTrees);
        setMovingTreeUuid(null);
        return;
    }

    if (!isAddingTree) return;

    const newTree: Tree = {
      id: 0,
      uuid: `tree-${Date.now()}`,
      name: 'New Tree',
      position: { x: percentX, y: percentY },
      status: TreeStatus.Unidentified,
      size: TreeSize.S,
    };
    setSelectedTree(newTree);
    setIsAddingTree(false);
  };
  
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom - e.deltaY * ZOOM_SENSITIVITY));
    
    if (mapContainerRef.current) {
        const rect = mapContainerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
        const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isAddingTree || movingTreeUuid) return;

    if (e.touches.length === 1) {
        if (pinchStartRef.current) return;
        setIsPanning(true);
        lastPanPointRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
        e.preventDefault();
        setIsPanning(false);
        lastPanPointRef.current = null;
        
        const dist = getTouchDistance(e.touches[0], e.touches[1]);
        const midpoint = getTouchMidpoint(e.touches[0], e.touches[1]);

        pinchStartRef.current = { dist, midpoint, pan, zoom };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
      if (isAddingTree || movingTreeUuid) return;

      if (e.touches.length === 1 && isPanning && lastPanPointRef.current) {
          e.preventDefault();
          const touch = e.touches[0];
          const dx = touch.clientX - lastPanPointRef.current.x;
          const dy = touch.clientY - lastPanPointRef.current.y;
          setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
          lastPanPointRef.current = { x: touch.clientX, y: touch.clientY };
      } else if (e.touches.length === 2 && pinchStartRef.current) {
          e.preventDefault();
          if (!mapContainerRef.current) return;

          const { dist: startDist, midpoint: startMidpoint, pan: startPan, zoom: startZoom } = pinchStartRef.current;
          const newDist = getTouchDistance(e.touches[0], e.touches[1]);
          const newMidpoint = getTouchMidpoint(e.touches[0], e.touches[1]);
          const scale = newDist / startDist;
          const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, startZoom * scale));
          const panDx = newMidpoint.x - startMidpoint.x;
          const panDy = newMidpoint.y - startMidpoint.y;
          
          const rect = mapContainerRef.current.getBoundingClientRect();
          const zoomOriginX = startMidpoint.x - rect.left;
          const zoomOriginY = startMidpoint.y - rect.top;
          
          const zoomAdjustedPanX = zoomOriginX - (zoomOriginX - startPan.x) * (newZoom / startZoom);
          const zoomAdjustedPanY = zoomOriginY - (zoomOriginY - startPan.y) * (newZoom / startZoom);

          setZoom(newZoom);
          setPan({
              x: zoomAdjustedPanX + panDx,
              y: zoomAdjustedPanY + panDy,
          });
      }
  };

  const handleTouchEnd = () => {
      pinchStartRef.current = null;
      setIsPanning(false);
      lastPanPointRef.current = null;
  };

  const handleZoomIn = () => setZoom(z => Math.min(MAX_ZOOM, z + 0.2));
  const handleZoomOut = () => setZoom(z => Math.max(MIN_ZOOM, z - 0.2));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const handlePanButtonClick = (direction: 'up' | 'down' | 'left' | 'right') => {
    switch (direction) {
      case 'up': setPan(p => ({ ...p, y: p.y + PAN_STEP })); break;
      case 'down': setPan(p => ({ ...p, y: p.y - PAN_STEP })); break;
      case 'left': setPan(p => ({ ...p, x: p.x + PAN_STEP })); break;
      case 'right': setPan(p => ({ ...p, x: p.x - PAN_STEP })); break;
    }
  };

  const treesToDisplay = isCompareMode ? (diffs ?? []) : (editedTrees ?? activeGardenState?.trees ?? []);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col font-sans">
      <Toolbar
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
        isAddingTree={isAddingTree}
        onToggleAddTreeMode={handleToggleAddTreeMode}
        availableDates={availableDates}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onDownload={handleDownloadCurrentView}
        onSaveRequest={handleSaveRequest}
        onImportRequest={handleImportRequest}
        isMovingTree={!!movingTreeUuid}
        onCancelMove={handleCancelMove}
        isCompareMode={isCompareMode}
        onToggleCompareMode={handleToggleCompareMode}
        compareDates={compareDates}
        onCompareDateChange={handleCompareDateChange}
        isComparing={isComparing}
        onClearLocalStorage={handleClearLocalStorage}
        highlightedFilter={highlightedFilter}
        onHighlightFilterChange={handleHighlightFilterChange}
      />
      <div className="flex-grow w-full h-full relative p-2 bg-gray-200" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <div 
          ref={mapContainerRef}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-full max-h-full shadow-lg rounded-md overflow-hidden ${isAddingTree || movingTreeUuid ? 'cursor-crosshair' : isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ 
            aspectRatio: '4961 / 3508'
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onClick={handleMapClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
              className="relative w-full h-full origin-top-left"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, touchAction: 'none' }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url("https://storage.googleapis.com/generative-ai-projen-dev-public/user-assets/garden-map-background.png")' }}
              aria-hidden="true"
            />
            <GardenMap
              trees={treesToDisplay}
              isEditMode={isEditMode}
              onTreeClick={handleTreeClick}
              isCompareMode={isCompareMode}
              highlightedFilter={highlightedFilter}
            />
          </div>
        </div>
      </div>
      <TreeInfoModal
        tree={selectedTree}
        onClose={handleCloseModal}
        isEditMode={isEditMode}
        onSave={handleSaveTree}
        onDelete={handleDeleteTree}
        onMoveRequest={handleStartMoveTree}
        isCompareMode={isCompareMode}
      />

      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm m-4 relative animate-fade-in-up">
                <button onClick={() => setIsSaveModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{t('saveModalTitle')}</h2>
                <p className="text-sm text-gray-600 mb-4">
                   {t('saveModalDescription')}
                </p>
                <div>
                    <label htmlFor="version-date" className="block text-sm font-medium text-gray-700">{t('dateLabel')}</label>
                    <input
                        type="date"
                        id="version-date"
                        value={newVersionDate}
                        onChange={(e) => setNewVersionDate(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={() => setIsSaveModalOpen(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSaveNewVersion}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {t('saveAndDownload')}
                    </button>
                </div>
            </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        className="hidden"
        accept="application/json"
      />
      
      {isCompareMode && <CompareLegend />}

      <div className="absolute bottom-4 right-4 z-20 flex items-end gap-2">
        <div className="grid grid-cols-3 grid-rows-3 gap-1 bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-lg">
          <div className="col-start-2 row-start-1 flex justify-center">
            <button onClick={() => handlePanButtonClick('up')} className="p-2 rounded hover:bg-gray-200 transition-colors" aria-label={t('navPanUp')}><ArrowUpIcon className="w-5 h-5" /></button>
          </div>
          <div className="col-start-1 row-start-2 flex justify-center">
            <button onClick={() => handlePanButtonClick('left')} className="p-2 rounded hover:bg-gray-200 transition-colors" aria-label={t('navPanLeft')}><ArrowLeftIcon className="w-5 h-5" /></button>
          </div>
          <div className="col-start-2 row-start-2 flex justify-center">
            <button onClick={handleResetZoom} className="p-2 rounded hover:bg-gray-200 transition-colors" aria-label={t('navReset')}><FitScreenIcon className="w-5 h-5" /></button>
          </div>
          <div className="col-start-3 row-start-2 flex justify-center">
            <button onClick={() => handlePanButtonClick('right')} className="p-2 rounded hover:bg-gray-200 transition-colors" aria-label={t('navPanRight')}><ArrowRightIcon className="w-5 h-5" /></button>
          </div>
          <div className="col-start-2 row-start-3 flex justify-center">
            <button onClick={() => handlePanButtonClick('down')} className="p-2 rounded hover:bg-gray-200 transition-colors" aria-label={t('navPanDown')}><ArrowDownIcon className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex flex-col bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-lg">
            <button onClick={handleZoomIn} className="p-2 rounded hover:bg-gray-200 transition-colors" aria-label={t('navZoomIn')}><PlusIcon className="w-5 h-5" /></button>
            <button onClick={handleZoomOut} className="p-2 rounded hover:bg-gray-200 transition-colors" aria-label={t('navZoomOut')}><MinusIcon className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

export default App;