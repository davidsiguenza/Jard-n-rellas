
import React from 'react';
import { Tree } from '../types';
import TreeMarker from './components/TreeMarker';
import MapOverlay from './components/MapOverlay';

interface GardenMapProps {
  trees: Tree[];
  isEditMode: boolean;
  onTreeClick: (tree: Tree) => void;
}

const GardenMap: React.FC<GardenMapProps> = ({
  trees,
  isEditMode,
  onTreeClick,
}) => {
  return (
    <div className="relative w-full h-full select-none" id="garden-map-container">
      <MapOverlay />
      <div className="absolute inset-0">
        {trees.map((tree) => (
          <TreeMarker
            key={tree.uuid}
            tree={tree}
            onClick={onTreeClick}
            isEditMode={isEditMode}
          />
        ))}
      </div>
    </div>
  );
};

export default GardenMap;