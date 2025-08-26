import React, { useState, useEffect } from 'react';
import { Tree, TreeStatus, TreeSize, DiffTree, TreeDiffStatus, Language } from '../types';
import { TREE_NAMES, TreeInfo } from '../constants';
import { CloseIcon, InformationCircleIcon, ChevronDownIcon, CameraIcon } from './icons/index';
import { GoogleGenAI, Type } from "@google/genai";
import { useLanguage } from '../i18n/LanguageContext';
import { supportedLngs } from '../i18n/config';
import CameraCapture from './CameraCapture';

interface TreeInfoModalProps {
  tree: Tree | DiffTree | null;
  onClose: () => void;
  isEditMode: boolean;
  onSave: (updatedTree: Tree) => void;
  onDelete: (treeUuid: string) => void;
  onMoveRequest: (treeUuid: string) => void;
  isCompareMode: boolean;
}

interface GenerativeInfo {
    summary: string;
    characteristics: string;
    leaves: string;
    fruit: string;
    care: string;
    funFact: string;
}

// Module-level cache to store fetched tree information
const treeInfoCache = new Map<string, GenerativeInfo>();

const getTreeDisplayName = (treeData: Tree | DiffTree, t: (key: string) => string, lang: Language) => {
    const treeInfo = TREE_NAMES.get(treeData.id);
    if (!treeInfo) {
      if (treeData.name === 'New Tree') return t('newTree');
      if (treeData.name === '???') return t('unknownTreeQuestion');
      return treeData.name;
    }
    
    const commonName = treeInfo.common[lang];
    const genusName = treeInfo.genus?.[lang];

    if (genusName && genusName !== commonName) {
        return `${genusName} - ${commonName}`;
    }
    return commonName;
};

const TreeInfoModal: React.FC<TreeInfoModalProps> = ({ tree, onClose, isEditMode, onSave, onDelete, onMoveRequest, isCompareMode }) => {
  const { lng, t } = useLanguage();
  const [formData, setFormData] = useState<Tree | null>(null);
  const [generativeInfo, setGenerativeInfo] = useState<GenerativeInfo | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState<boolean>(false);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // New states for camera/AI feature
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);


  useEffect(() => {
    setFormData(tree);
    setGenerativeInfo(null);
    setIsExpanded(false);
    setInfoError(null);
    setIsLoadingInfo(false);
    // Reset new states when tree changes
    setIsCameraOpen(false);
    setIsAnalyzing(false);
    setAnalysisError(null);
  }, [tree]);

  if (!tree || !formData) return null;

  const fetchTreeInfo = async () => {
    if (!tree || tree.id === 0 || tree.name === 'New Tree' || isEditMode) {
        return;
    }

    const cacheKey = `${tree.name}-${lng}`;
    const scientificName = TREE_NAMES.get(tree.id)?.scientific;

    if (treeInfoCache.has(cacheKey)) {
        setGenerativeInfo(treeInfoCache.get(cacheKey)!);
        setIsExpanded(true);
        return;
    }

    setIsLoadingInfo(true);
    setInfoError(null);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const languageName = supportedLngs[lng];
        const treeNameForPrompt = getTreeDisplayName(tree, t, 'es'); // Use Spanish name for consistency
        
        const schema = {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: `Un resumen breve y atractivo sobre el árbol, de unas 2-3 frases, en ${languageName}.` },
            characteristics: { type: Type.STRING, description: `Características principales del árbol (ej. tamaño, forma, corteza), en ${languageName}.` },
            leaves: { type: Type.STRING, description: `Descripción de las hojas, en ${languageName}.` },
            fruit: { type: Type.STRING, description: `Descripción del fruto. Si no produce fruto, indicarlo claramente. En ${languageName}.` },
            care: { type: Type.STRING, description: `Instrucciones básicas de cuidado (ej. suelo, sol, necesidades de agua), en ${languageName}.` },
            funFact: { type: Type.STRING, description: `Un dato curioso o interesante sobre el árbol, en ${languageName}.` },
          },
          required: ["summary", "characteristics", "leaves", "fruit", "care", "funFact"]
        };
        
        const prompt = scientificName && scientificName !== 'N/A'
            ? `Proporcióname información en ${languageName} sobre el árbol '${treeNameForPrompt}' (nombre científico: ${scientificName}). La información debe ser interesante y accesible. Estructura la respuesta en el formato JSON definido. Si el árbol no produce fruto, indícalo claramente en la descripción del fruto.`
            : `Proporcióname información en ${languageName} sobre el árbol '${treeNameForPrompt}'. La información debe ser interesante y accesible. Estructura la respuesta en el formato JSON definido. Si el árbol no produce fruto, indícalo claramente en la descripción del fruto.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text.trim();
        const info: GenerativeInfo = JSON.parse(jsonText);
        
        treeInfoCache.set(cacheKey, info);
        setGenerativeInfo(info);
        setIsExpanded(true);
    } catch (error) {
        console.error("Error fetching tree info from Gemini API:", error);
        setInfoError(t('infoError'));
    } finally {
        setIsLoadingInfo(false);
    }
  };

  const handleImageAnalysis = async (imageBase64: string) => {
    setIsCameraOpen(false);
    setIsAnalyzing(true);
    setAnalysisError(null);

    const treeList = Array.from(TREE_NAMES.values())
      .map(t => `${t.common['es']} (${t.scientific})`)
      .filter(name => !name.includes('N/A') && !name.includes('?'))
      .join(', ');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const languageName = supportedLngs[lng];
      
      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64.split(',')[1],
        },
      };

      const textPart = {
        text: `Identifica el árbol en esta imagen. Responde en ${languageName}. Proporciona el nombre común y el nombre científico. Intenta hacer coincidir el árbol con una de las siguientes especies conocidas en el jardín: ${treeList}. Además, proporciona instrucciones de cuidado breves y un dato curioso sobre el árbol.`
      };

      const schema = {
        type: Type.OBJECT,
        properties: {
          commonName: { type: Type.STRING, description: `El nombre común del árbol en ${languageName}.` },
          scientificName: { type: Type.STRING, description: `El nombre científico del árbol. Si coincide con uno de la lista proporcionada, usa ese. De lo contrario, el que corresponda.` },
          care: { type: Type.STRING, description: `Instrucciones de cuidado breves y concisas en ${languageName}.` },
          funFact: { type: Type.STRING, description: `Un dato curioso e interesante sobre el árbol en ${languageName}.` }
        },
        required: ["commonName", "scientificName", "care", "funFact"]
      };

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
      });

      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);

      let matchedId = 0;
      let matchedName = result.commonName;

      // Try to match with existing trees
      for (const [id, treeInfo] of TREE_NAMES.entries()) {
        const sciNameMatch = treeInfo.scientific.toLowerCase() === result.scientificName.toLowerCase();
        const commonNameEsMatch = treeInfo.common.es.toLowerCase() === result.commonName.toLowerCase();
        const commonNameGlMatch = treeInfo.common.gl.toLowerCase() === result.commonName.toLowerCase();
        
        if (sciNameMatch || commonNameEsMatch || commonNameGlMatch) {
          matchedId = id;
          matchedName = treeInfo.common['es']; // Use Spanish for data consistency
          break;
        }
      }

      const newNotes = t('notesFromAI', { care: result.care, funFact: result.funFact });

      setFormData(prev => prev ? ({
        ...prev,
        id: matchedId,
        name: matchedName,
        status: matchedId > 0 ? TreeStatus.Identified : TreeStatus.Unidentified,
        notes: newNotes,
      }) : null);

    } catch (error) {
        console.error("Error analyzing image with Gemini API:", error);
        setAnalysisError(t('analysisError'));
    } finally {
        setIsAnalyzing(false);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'id') {
        const id = parseInt(value, 10);
        const treeInfo = TREE_NAMES.get(id);
        const treeName = treeInfo ? treeInfo.common['es'] : 'Unknown';
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

  const handleToggleInfo = () => {
    if (generativeInfo) {
      setIsExpanded(!isExpanded);
    } else if (!isLoadingInfo) {
      fetchTreeInfo();
    }
  };

  const isNewTree = tree.name === 'New Tree';
  const diffTree = tree as DiffTree;
  const diffStatus = diffTree.diffStatus;
  const hasChanges = diffStatus === TreeDiffStatus.Changed || diffStatus === TreeDiffStatus.Moved;

  const renderStatus = (s: TreeStatus) => t(`treeStatus_${s}`);
  const treeInfo = tree.id > 0 ? TREE_NAMES.get(tree.id) : null;
  const scientificName = treeInfo?.scientific;


  const getModalTitle = () => {
    if (isEditMode) return t('editTreeTitle');
    if (isCompareMode) {
      switch(diffStatus) {
        case TreeDiffStatus.Added: return t('addedTreeTitle');
        case TreeDiffStatus.Removed: return t('removedTreeTitle');
        case TreeDiffStatus.Moved:
        case TreeDiffStatus.Changed: return t('changedTreeTitle');
        default: return t('treeDetailsTitle');
      }
    }
    return t('treeDetailsTitle');
  }

  const keyTranslations: { [key in keyof Omit<GenerativeInfo, 'summary'>]: string } = {
    characteristics: t('characteristics'),
    leaves: t('leaves'),
    fruit: t('fruit'),
    care: t('care'),
    funFact: t('funFact'),
  };
  
  const displayName = getTreeDisplayName(tree, t, lng);

  const renderGenerativeContent = () => {
    if (isEditMode || tree.id === 0 || tree.name === 'New Tree' || tree.name === '???') return null;

    let buttonText = t('learnMore');
    if (isLoadingInfo) {
        buttonText = t('loading');
    } else if (generativeInfo) {
        buttonText = isExpanded ? t('showLess') : t('showMore');
    }
    
    return (
        <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
                 <h3 className="text-lg font-semibold text-gray-800 flex items-center pr-4">
                    <InformationCircleIcon className="w-6 h-6 mr-2 text-blue-500 flex-shrink-0" />
                    <span>{t('learnAbout', { treeName: displayName })}</span>
                </h3>
                <button 
                  onClick={handleToggleInfo} 
                  className="flex-shrink-0 flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-wait" 
                  disabled={isLoadingInfo}
                >
                    <span>{buttonText}</span>
                    <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </div>
            
            {infoError && <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">{infoError}</p>}
            
            {generativeInfo && (
                <div className={`grid transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                   <div className="overflow-hidden pt-2">
                      <p className="text-sm text-gray-700 italic mb-3">{generativeInfo.summary}</p>
                      <dl className="space-y-3 bg-gray-50 p-3 rounded-md border">
                            {Object.entries(generativeInfo).filter(([key]) => key !== 'summary').map(([key, value]) => value && (
                                <div key={key}>
                                    <dt className="font-semibold text-gray-800 capitalize">{keyTranslations[key as keyof typeof keyTranslations] || key}</dt>
                                    <dd className="text-gray-600">{value as string}</dd>
                                </div>
                            ))}
                        </dl>
                   </div>
                </div>
            )}
        </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md m-4 relative animate-fade-in-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          
          {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex justify-center items-center z-10 rounded-lg">
                  <div className="text-center">
                      <p className="text-lg font-semibold text-gray-700 animate-pulse">{t('analyzing')}</p>
                  </div>
              </div>
          )}

          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
            <CloseIcon className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">{getModalTitle()}</h2>
          
          {analysisError && (
              <p className="my-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">{analysisError}</p>
          )}

          {isCompareMode && hasChanges && diffTree.previous && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-md mb-4 text-sm">
              <h3 className="font-bold text-blue-800 mb-2">{t('changes')}:</h3>
              <div className="grid grid-cols-[max-content,1fr] gap-x-4 gap-y-1">
                  <div className="font-semibold">{t('property')}</div>
                  <div className="font-semibold">{t('change')}</div>
                  <div className="col-span-2 border-b my-1"></div>
                  
                  {diffTree.previous.name !== diffTree.name && <><div>{t('name')}</div><div className="truncate"><s>{getTreeDisplayName(diffTree.previous, t, lng)}</s> &rarr; {getTreeDisplayName(diffTree, t, lng)}</div></>}
                  {diffTree.previous.status !== diffTree.status && <><div>{t('status')}</div><div><s>{renderStatus(diffTree.previous.status)}</s> &rarr; {renderStatus(diffTree.status)}</div></>}
                  {diffTree.previous.size !== diffTree.size && <><div>{t('size')}</div><div><s>{diffTree.previous.size.toUpperCase()}</s> &rarr; {diffTree.size.toUpperCase()}</div></>}
                  {diffStatus === TreeDiffStatus.Moved && <><div>{t('position')}</div><div>{t('moved')}</div></>}
                  {(diffTree.previous.notes || '') !== (diffTree.notes || '') && <>
                    <div>{t('treeNotes')}</div>
                    <div className="text-xs whitespace-pre-wrap bg-white p-1 rounded border">
                      <s className="text-red-500">{diffTree.previous.notes || t('noNotes')}</s>
                      <span className="text-blue-600 font-bold mx-1">&rarr;</span>
                      <span className="text-green-600">{diffTree.notes || t('noNotes')}</span>
                    </div>
                  </>}
              </div>
            </div>
          )}

          {isEditMode && isNewTree && (
            <div className="mb-4">
              <button
                onClick={() => setIsCameraOpen(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <CameraIcon className="h-5 w-5" />
                <span>{t('identifyWithCamera')}</span>
              </button>
            </div>
          )}


          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('name')}</label>
              {isEditMode ? (
                <select
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  <option value={0}>{t('unknown')}</option>
                  {Array.from(TREE_NAMES.entries()).map(([id, nameInfo]: [number, TreeInfo]) => (
                      <option key={id} value={id}>{`${id} - ${getTreeDisplayName({id, name: nameInfo.common['es']} as Tree, t, lng)}`}</option>
                  ))}
                </select>
              ) : (
                  <div className="mt-1 bg-gray-50 rounded-md">
                      <p className="text-lg text-gray-900 p-2">{`${tree.id > 0 ? tree.id + ' - ' : ''}${displayName}`}</p>
                      {scientificName && scientificName !== 'N/A' && <p className="text-sm text-gray-600 italic px-2 pb-2 -mt-1">{scientificName}</p>}
                  </div>
              )}
            </div>
            
            {!isEditMode && treeInfo && (treeInfo.origin[lng] || treeInfo.notes[lng]) && (
              <div className="space-y-4 pt-2">
                  {treeInfo.origin[lng] && (
                      <div>
                          <label className="block text-sm font-medium text-gray-700">{t('origin')}</label>
                          <p className="mt-1 text-gray-800 bg-gray-50 p-2 rounded-md text-sm">{treeInfo.origin[lng]}</p>
                      </div>
                  )}
                  {treeInfo.notes[lng] && (
                      <div>
                          <label className="block text-sm font-medium text-gray-700">{t('notes')}</label>
                          <p className="mt-1 text-gray-800 bg-gray-50 p-2 rounded-md text-sm">{treeInfo.notes[lng]}</p>
                      </div>
                  )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('status')}</label>
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
              <label className="block text-sm font-medium text-gray-700">{t('size')}</label>
              {isEditMode ? (
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  {Object.values(TreeSize).map((s: TreeSize) => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
              ) : (
                  <p className="mt-1 text-lg text-gray-900 bg-gray-50 p-2 rounded-md">{tree.size.toUpperCase()}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('treeNotes')}</label>
              {isEditMode ? (
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm h-24"
                  placeholder={t('treeNotesPlaceholder')}
                />
              ) : (
                <p className="mt-1 text-sm text-gray-800 bg-gray-50 p-2 rounded-md min-h-[40px] whitespace-pre-wrap">
                  {tree.notes || <span className="italic text-gray-500">{t('noNotes')}</span>}
                </p>
              )}
            </div>

          </div>
          
          {renderGenerativeContent()}

          {isEditMode && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                disabled={isNewTree}
              >
                {t('delete')}
              </button>
              <div className="flex items-center space-x-2">
                  <button
                      onClick={handleMoveRequest}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                      disabled={isNewTree}
                  >
                      {t('moveTree')}
                  </button>
                  <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                      {t('saveChanges')}
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isCameraOpen && (
        <CameraCapture 
            onCapture={handleImageAnalysis} 
            onClose={() => setIsCameraOpen(false)}
        />
      )}
    </>
  );
};

export default TreeInfoModal;