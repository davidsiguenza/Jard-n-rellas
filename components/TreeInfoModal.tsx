
import React, { useState, useEffect } from 'react';
import { Tree, TreeStatus, TreeSize } from '../types';
import { TREE_NAMES } from '../constants';
import { CloseIcon } from './icons';

interface TreeInfoModalProps {
  tree: Tree | null;
  onClose: () => void;
  isEditMode: boolean;
  onSave: (updatedTree: Tree) => void;
  onDelete: (treeUuid: string) => void;
  onMoveRequest: (treeUuid: string) => void;
}

const TreeInfoModal: React.FC<TreeInfoModalProps> = ({ tree, onClose, isEditMode, onSave, onDelete, onMoveRequest }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md m-4 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <CloseIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">{isEditMode ? 'Edit Tree' : 'Tree Details'}</h2>

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
                 {Object.values(TreeStatus).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
               </select>
            ) : (
                <p className="mt-1 text-lg text-gray-900 bg-gray-50 p-2 rounded-md">{tree.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
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