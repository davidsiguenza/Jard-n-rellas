
import React, { useState, useEffect } from 'react';
import { Tree, TreeStatus, TreeSize, DiffTree, TreeDiffStatus } from '../types';
import { TREE_NAMES } from '../constants';
import { CloseIcon } from './icons';

interface TreeInfoModalProps {
  tree: Tree | DiffTree | null;
  onClose: () => void;
  isEditMode: boolean;
  onSave: (updatedTree: Tree) => void;
  onDelete: (treeUuid: string) => void;
  onMoveRequest: (treeUuid: string) => void;
  isCompareMode: boolean;
}

const TreeInfoModal: React.FC<TreeInfoModalProps> = ({ tree, onClose, isEditMode, onSave, onDelete, onMoveRequest, isCompareMode }) => {
  const [formData, setFormData] = useState<Tree | null>(null);

  useEffect(() => {
    setFormData(tree);
  }, [tree]);

  if (!tree || !formData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'id') {
        const id = parseInt(value, 10);
        const treeName = TREE_NAMES.get(id) || 'Unknown';
        setFormData({ ...formData, id, name: treeName });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    onDelete(formData.uuid);
    onClose();
  }

  const handleMoveRequest = () => {
    onMoveRequest(formData.uuid);
  }

  const isNewTree = tree.name === 'New Tree';
  const diffTree = tree as DiffTree;
  const diffStatus = diffTree.diffStatus;
  const hasChanges = diffStatus === TreeDiffStatus.Changed || diffStatus === TreeDiffStatus.Moved;

  const renderStatus = (s: TreeStatus) => s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const getModalTitle = () => {
    if (isEditMode) return 'Edit Tree';
    if (isCompareMode) {
      switch(diffStatus) {
        case TreeDiffStatus.Added: return 'Added Tree Details';
        case TreeDiffStatus.Removed: return 'Removed Tree Details';
        case TreeDiffStatus.Moved:
        case TreeDiffStatus.Changed: return 'Tree Change Details';
        default: return 'Tree Details';
      }
    }
    return 'Tree Details';
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md m-4 relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <CloseIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">{getModalTitle()}</h2>

        {isCompareMode && hasChanges && diffTree.previous && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md mb-4 text-sm">
             <h3 className="font-bold text-blue-800 mb-2">Changes:</h3>
             <div className="grid grid-cols-2 gap-x-4">
                <div className="font-semibold">Property</div>
                <div className="font-semibold">Change</div>
                <div className="col-span-2 border-b my-1"></div>
                
                {diffTree.previous.name !== diffTree.name && <><div>Name</div><div className="truncate"><s>{diffTree.previous.name}</s> &rarr; {diffTree.name}</div></>}
                {diffTree.previous.status !== diffTree.status && <><div>Status</div><div><s>{renderStatus(diffTree.previous.status)}</s> &rarr; {renderStatus(diffTree.status)}</div></>}
                {diffTree.previous.size !== diffTree.size && <><div>Size</div><div><s>{diffTree.previous.size.toUpperCase()}</s> &rarr; {diffTree.size.toUpperCase()}</div></>}
                {diffStatus === TreeDiffStatus.Moved && <><div>Position</div><div>Moved</div></>}
             </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            {isEditMode ? (
              <select
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value={0}>Unknown/Unlisted</option>
                {Array.from(TREE_NAMES.entries()).map(([id, name]) => (
                    <option key={id} value={id}>{`${id} - ${name}`}</option>
                ))}
              </select>
            ) : (
              <p className="mt-1 text-lg text-gray-900 bg-gray-50 p-2 rounded-md">{`${tree.id > 0 ? tree.id + ' - ' : ''}${tree.name}`}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            {isEditMode ? (
               <select
                 name="status"
                 value={formData.status}
                 onChange={handleInputChange}
                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
               >
                 {Object.values(TreeStatus).map(s => <option key={s} value={s}>{renderStatus(s)}</option>)}
               </select>
            ) : (
                <p className="mt-1 text-lg text-gray-900 bg-gray-50 p-2 rounded-md">{renderStatus(tree.status)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            {isEditMode ? (
               <select
                 name="size"
                 value={formData.size}
                 onChange={handleInputChange}
                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
               >
                 {Object.values(TreeSize).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
               </select>
            ) : (
                 <p className="mt-1 text-lg text-gray-900 bg-gray-50 p-2 rounded-md">{tree.size.toUpperCase()}</p>
            )}
          </div>
        </div>

        {isEditMode && (
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
              disabled={isNewTree}
            >
              Delete
            </button>
            <div className="flex items-center space-x-2">
                <button
                    onClick={handleMoveRequest}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                    disabled={isNewTree}
                >
                    Move Tree
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                    Save Changes
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeInfoModal;
