
import React from 'react';
import { Tree, DiffTree } from '../types';
import TreeMarker from './components/TreeMarker';
import MapOverlay from './components/MapOverlay';

interface GardenMapProps {
  trees: (Tree | DiffTree)[];
  isEditMode: boolean;
  onTreeClick: (tree: Tree | DiffTree) => void;
  isCompareMode: boolean;
  highlightedFilter: string;
}

const GardenMap: React.FC<GardenMapProps> = ({
  trees,
  isEditMode,
  onTreeClick,
  isCompareMode,
  highlightedFilter,
}) => {
  const sizeDimensions: Record<string, string> = {
    'xs': '8px', 's': '10px', 'm': '12px', 'l': '14px', 'xl': '16px',
  };

  return (
    <div className="relative w-full h-full select-none" id="garden-map-container">
      <MapOverlay />
      <div className="absolute inset-0">
        {isCompareMode && (
          <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrowhead" markerWidth="5" markerHeight="3.5" refX="4" refY="1.75" orient="auto">
                <polygon points="0 0, 5 1.75, 0 3.5" fill="#0ea5e9" />
              </marker>
            </defs>
            {(trees as DiffTree[]).map(tree => {
              if (tree.diffStatus === 'moved' && tree.previous) {
                return (
                  <line
                    key={`${tree.uuid}-line`}
                    x1={`${tree.previous.position.x}%`}
                    y1={`${tree.previous.position.y}%`}
                    x2={`${tree.position.x}%`}
                    y2={`${tree.position.y}%`}
                    stroke="#0ea5e9"
                    strokeWidth="1.5"
                    strokeDasharray="4"
                    markerEnd="url(#arrowhead)"
                  />
                );
              }
              return null;
            })}
          </svg>
        )}

        {(trees as DiffTree[]).map((tree) => {
          if (isCompareMode && tree.diffStatus === 'moved' && tree.previous) {
            return (
              <React.Fragment key={tree.uuid}>
                {/* Old position marker */}
                <div
                  title={`Previous position of ${tree.name}`}
                  className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 border border-dashed border-sky-400 opacity-70 bg-white/50"
                  style={{ 
                    top: `${tree.previous.position.y}%`, 
                    left: `${tree.previous.position.x}%`,
                    width: sizeDimensions[tree.previous.size],
                    height: sizeDimensions[tree.previous.size],
                  }}
                />
                {/* New position marker */}
                <TreeMarker tree={tree} onClick={onTreeClick} isEditMode={isEditMode} isCompareMode={isCompareMode} highlightedFilter={highlightedFilter} />
              </React.Fragment>
            );
          }
          return <TreeMarker key={tree.uuid} tree={tree} onClick={onTreeClick} isEditMode={isEditMode} isCompareMode={isCompareMode} highlightedFilter={highlightedFilter} />;
        })}
      </div>
    </div>
  );
};

export default GardenMap;
