import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GardenState, Tree, TreeSize, TreeStatus } from './types';
import { TREE_NAMES } from './constants';
import GardenMap from './GardenMap';
import Toolbar from './components/Toolbar';
import TreeInfoModal from './components/TreeInfoModal';
import { PlusIcon, MinusIcon, FitScreenIcon, ArrowUpIcon, ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, CloseIcon } from './components/icons';

const MIN_ZOOM = 0.2;
const MAX_ZOOM = 5;
const ZOOM_SENSITIVITY = 0.001;
const PAN_STEP = 50;


const App: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isAddingTree, setIsAddingTree] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const [manifestVersions, setManifestVersions] = useState<Map<string, string>>(new Map());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [cachedStates, setCachedStates] = useState<Map<string, GardenState>>(new Map());
  
  const [activeGardenState, setActiveGardenState] = useState<GardenState | null>(null);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

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
  const lastPinchDistRef = useRef<number>(0);


  useEffect(() => {
    const getStoredHistory = (): GardenState[] => {
      const stored = localStorage.getItem('gardenHistory');
      return stored ? JSON.parse(stored) : [];
    };

    const loadInitialData = async () => {
      let manifestMap = new Map<string, string>();
      try {
        const response = await fetch('/data/manifest.json');
        if (!response.ok) throw new Error('Failed to fetch manifest');
        const manifest = await response.json();
        
        manifest.versions.forEach((v: {date: string, path: string}) => {
          manifestMap.set(v.date, v.path);
        });
        setManifestVersions(manifestMap);
      } catch (error) {
        console.error("Could not load manifest.json:", error);
        alert("Could not load base garden history. Only showing locally saved versions.");
      }
      
      const storedHistory = getStoredHistory();
      const localStates = new Map<string, GardenState>();
      storedHistory.forEach(state => {
        localStates.set(state.date, state);
      });
      setCachedStates(localStates);

      const allDates = [...new Set([...manifestMap.keys(), ...localStates.keys()])];
      allDates.sort((a, b) => b.localeCompare(a)); // Newest first
      
      setAvailableDates(allDates);

      if (allDates.length > 0) {
        setSelectedDate(allDates[0]);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const loadGardenState = async () => {
      // 1. Check cache first (includes localStorage data)
      if (cachedStates.has(selectedDate)) {
        setActiveGardenState(cachedStates.get(selectedDate)!);
        setEditedTrees(null); // Clear edits when changing date
        return;
      }

      // 2. If not in cache, check manifest and fetch from file
      if (manifestVersions.has(selectedDate)) {
        try {
          const path = manifestVersions.get(selectedDate)!;
          const response = await fetch(path);
          if (!response.ok) throw new Error(`Failed to fetch ${path}`);
          const gardenState: GardenState = await response.json();
          
          setCachedStates(prev => new Map(prev).set(selectedDate, gardenState));
          setActiveGardenState(gardenState);
          setEditedTrees(null); // Clear edits when changing date
        } catch (error) {
          console.error(`Error loading garden state for ${selectedDate}:`, error);
          alert(`Could not load data for ${selectedDate}.`);
          setActiveGardenState(null);
        }
      }
    };
    loadGardenState();
  }, [selectedDate, cachedStates, manifestVersions]);
  
  const updateLocalStorageHistory = (newState: GardenState) => {
    const storedHistoryJSON = localStorage.getItem('gardenHistory');
    const storedHistory: GardenState[] = storedHistoryJSON ? JSON.parse(storedHistoryJSON) : [];
    
    const otherVersions = storedHistory.filter(g => g.date !== newState.date);
    const newHistory = [...otherVersions, newState];
    localStorage.setItem('gardenHistory', JSON.stringify(newHistory));
  };

  const handleDateChange = (date: string) => {
    if (isEditMode) {
      if (confirm("You are in Edit Mode with unsaved changes. Are you sure you want to switch dates and discard them?")) {
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
    setIsEditMode(prev => {
        if (prev) { // Was editing, now exiting
            setEditedTrees(null);
            setIsAddingTree(false);
            setMovingTreeUuid(null);
            return false;
        } else { // Was viewing, now entering edit
            setEditedTrees(JSON.parse(JSON.stringify(activeGardenState!.trees)));
            return true;
        }
    });
  };
  
  const handleToggleAddTreeMode = () => {
    setIsAddingTree(prev => !prev);
    if (movingTreeUuid) setMovingTreeUuid(null);
  }

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
          alert('Please select a date.');
          return;
      }
      if (availableDates.includes(newVersionDate)) {
          if (!confirm(`A version for ${newVersionDate} already exists. Overwrite it?`)) {
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
                  throw new Error('Invalid file format. Missing "date" or "trees" property.');
              }

              if (availableDates.includes(importedState.date)) {
                  if (!confirm(`A version for date ${importedState.date} already exists. Overwrite it?`)) {
                      if (e.target) e.target.value = '';
                      return;
                  }
              }
              
              updateLocalStorageHistory(importedState);
              
              setCachedStates(prev => new Map(prev).set(importedState.date, importedState));
              setAvailableDates(prev => [...new Set([importedState.date, ...prev])].sort((a, b) => b.localeCompare(a)));

              alert(`Successfully imported garden state for ${importedState.date}`);
              setSelectedDate(importedState.date);
          } catch (error) {
              console.error("Failed to import file:", error);
              alert(`Failed to import file. Make sure it is a valid garden data JSON file. Error: ${error instanceof Error ? error.message : String(error)}`);
          } finally {
              if (e.target) e.target.value = '';
          }
      };
      reader.readAsText(file);
  };
  
  const handleTreeClick = (tree: Tree) => {
    if (isAddingTree || movingTreeUuid) return;
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

  const getPinchDistance = (touches: React.TouchList) => {
    return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isAddingTree || movingTreeUuid) return;
    e.preventDefault();
    if (e.touches.length === 1) {
        setIsPanning(true);
        lastPanPointRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
        setIsPanning(false);
        lastPinchDistRef.current = getPinchDistance(e.touches);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (e.touches.length === 1 && isPanning && lastPanPointRef.current) {
          const dx = e.touches[0].clientX - lastPanPointRef.current.x;
          const dy = e.touches[0].clientY - lastPanPointRef.current.y;
          setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
          lastPanPointRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && mapContainerRef.current) {
          const newDist = getPinchDistance(e.touches);
          const delta = newDist - lastPinchDistRef.current;
          const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta * ZOOM_SENSITIVITY * 2));

          const rect = mapContainerRef.current.getBoundingClientRect();
          const t1 = e.touches[0];
          const t2 = e.touches[1];
          const midX = (t1.clientX + t2.clientX) / 2 - rect.left;
          const midY = (t1.clientY + t2.clientY) / 2 - rect.top;

          const newPanX = midX - (midX - pan.x) * (newZoom / zoom);
          const newPanY = midY - (midY - pan.y) * (newZoom / zoom);

          setZoom(newZoom);
          setPan({ x: newPanX, y: newPanY });
          lastPinchDistRef.current = newDist;
      }
  };

  const handleTouchEnd = () => {
      setIsPanning(false);
      lastPanPointRef.current = null;
      lastPinchDistRef.current = 0;
  };

  const treesToDisplay = editedTrees ?? activeGardenState?.trees ?? [];

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
      />
      <div 
        ref={mapContainerRef}
        className={`flex-grow w-full h-full bg-cover bg-center ${isAddingTree || movingTreeUuid ? 'cursor-crosshair' : 'cursor-auto'}`}
        style={{ backgroundImage: 'url("https://storage.googleapis.com/generative-ai-projen-dev-public/user-assets/garden-map-background.png")' }}
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
          <GardenMap
            trees={treesToDisplay}
            isEditMode={isEditMode}
            onTreeClick={handleTreeClick}
          />
        </div>
      </div>
      <TreeInfoModal
        tree={selectedTree}
        onClose={handleCloseModal}
        isEditMode={isEditMode}
        onSave={handleSaveTree}
        onDelete={handleDeleteTree}
        onMoveRequest={handleStartMoveTree}
      />

      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm m-4 relative animate-fade-in-up">
                <button onClick={() => setIsSaveModalOpen(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Save New Version</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Enter a date for this new version of the garden. This will create a new entry in the history.
                </p>
                <div>
                    <label htmlFor="version-date" className="block text-sm font-medium text-gray-700">Date</label>
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
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveNewVersion}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Save & Download
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
      
      <div className="absolute bottom-4 right-4 z-20 flex items-end gap-2">
        <div className="grid grid-cols-3 gap-1 bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-lg">
          <div className="col-start-2 flex justify-center">
            <button onClick={() => handlePanButtonClick('up')} className="p-2 rounded hover:bg-gray-200 transition-colors"><ArrowUpIcon className="w-5 h-5" /></button>
          </div>
          <div className="flex justify-center">
            <button onClick={() => handlePanButtonClick('left')} className="p-2 rounded hover:bg-gray-200 transition-colors"><ArrowLeftIcon className="w-5 h-5" /></button>
          </div>
          <div/>
          <div className="flex justify-center">
            <button onClick={() => handlePanButtonClick('right')} className="p-2 rounded hover:bg-gray-200 transition-colors"><ArrowRightIcon className="w-5 h-5" /></button>
          </div>
          <div className="col-start-2 flex justify-center">
            <button onClick={() => handlePanButtonClick('down')} className="p-2 rounded hover:bg-gray-200 transition-colors"><ArrowDownIcon className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex flex-col bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-lg">
            <button onClick={handleZoomIn} className="p-2 rounded hover:bg-gray-200 transition-colors" aria-label="Zoom In"><PlusIcon className="w-5 h-5" /></button>
            <button onClick={handleZoomOut} className="p-2 rounded hover:bg-gray-200 transition-colors" aria-label="Zoom Out"><MinusIcon className="w-5 h-5" /></button>
            <button onClick={handleResetZoom} className="p-2 rounded hover:bg-gray-200 transition-colors" aria-label="Reset Zoom"><FitScreenIcon className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
};

export default App;