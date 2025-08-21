
import React from 'react';
import { Tree, TreeStatus, TreeSize, DiffTree, TreeDiffStatus } from '../types';

interface TreeMarkerProps {
  tree: Tree | DiffTree;
  onClick: (tree: Tree | DiffTree) => void;
  isEditMode: boolean;
  isCompareMode?: boolean;
}

const statusColors: Record<TreeStatus, string> = {
  [TreeStatus.Identified]: 'bg-yellow-900 border-yellow-700',
  [TreeStatus.Unidentified]: 'bg-red-700 border-red-500',
  [TreeStatus.ToBeCut]: 'bg-gray-500 border-gray-400',
};

const diffClasses: Record<TreeDiffStatus, string> = {
  [TreeDiffStatus.Added]: 'bg-green-500 border-green-300 ring-2 ring-offset-1 ring-green-400',
  [TreeDiffStatus.Removed]: 'bg-red-500 border-red-300 ring-2 ring-offset-1 ring-red-400',
  [TreeDiffStatus.Moved]: 'bg-blue-500 border-blue-300',
  [TreeDiffStatus.Changed]: 'bg-purple-500 border-purple-300 ring-2 ring-offset-1 ring-purple-400',
  [TreeDiffStatus.Unchanged]: 'bg-gray-800 border-gray-600 opacity-60',
};

const sizeDimensions: Record<TreeSize, string> = {
  [TreeSize.XS]: 'w-1.5 h-1.5 text-[6px]',
  [TreeSize.S]: 'w-2 h-2 text-[7px]',
  [TreeSize.M]: 'w-2.5 h-2.5 text-[7px]',
  [TreeSize.L]: 'w-3 h-3 text-[8px]',
  [TreeSize.XL]: 'w-3.5 h-3.5 text-[8px]',
};

const TreeMarker: React.FC<TreeMarkerProps> = ({ tree, onClick, isEditMode, isCompareMode }) => {
  const baseClasses = 'absolute rounded-full flex items-center justify-center text-white border transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200';
  
  const diffStatus = (tree as DiffTree).diffStatus;
  const inDiffModeWithStatus = isCompareMode && diffStatus;

  const interactionClasses = isEditMode
    ? 'cursor-pointer hover:scale-125 hover:shadow-lg'
    : inDiffModeWithStatus
    ? 'cursor-pointer hover:scale-125 hover:shadow-lg'
    : 'cursor-pointer hover:scale-110 hover:shadow-md';
  
  const color = inDiffModeWithStatus ? diffClasses[diffStatus] : statusColors[tree.status];
  const dimensions = sizeDimensions[tree.size];

  return (
    <div
      className={`tree-marker ${baseClasses} ${interactionClasses} ${color} ${dimensions}`}
      style={{ top: `${tree.position.y}%`, left: `${tree.position.x}%` }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(tree);
      }}
      aria-label={`Tree ${tree.id > 0 ? tree.id : '?'} - ${tree.name}`}
    >
      <span>{tree.id > 0 ? tree.id : '?'}</span>
    </div>
  );
};

export default TreeMarker;
