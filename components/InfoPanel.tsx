import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { TREE_NAMES } from '../constants';
import { TreeStatus } from '../types';
import { CloseIcon, PlumIcon, AppleIcon, PearIcon, HollyIcon, MapleIcon, CherryIcon, CameliaIcon, PrunusPendulaIcon, MagnoliaIcon, LiquidambarIcon, PeachIcon, OakIcon, QuinceIcon, WalnutIcon, ChestnutIcon, CorkOakIcon, OrangeIcon, LemonIcon, CedarOfLebanonIcon, MimosaIcon, AraucariaIcon, CercisIcon, GinkgoIcon, OliveIcon, BambooIcon, AlbiziaIcon, MadronoIcon, CornusFloridaIcon, RhododendronIcon, WisteriaIcon, GrevilleaIcon, GooseberryIcon } from './icons/index';
import { statusColors } from '../constants';


interface InfoPanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string;
    isCompareMode: boolean;
    compareDates: { dateA: string; dateB: string };
}

const PLUM_TREE_IDS = [1, 41, 42, 43, 44];
const APPLE_TREE_IDS = [33];
const PEAR_TREE_IDS = [35];
const HOLLY_TREE_IDS = [4];
const MAPLE_TREE_IDS = [11, 19, 25];
const PRUNUS_PENDULA_TREE_IDS = [7];
const CHERRY_TREE_IDS = [2, 32, 36];
const CAMELIA_TREE_IDS = [3];
const MAGNOLIA_TREE_IDS = [5, 6];
const LIQUIDAMBAR_TREE_IDS = [8];
const PEACH_TREE_IDS = [34, 39];
const OAK_TREE_IDS = [28, 29, 27];
const QUINCE_TREE_IDS = [37];
const WALNUT_TREE_IDS = [38];
const CHESTNUT_TREE_IDS = [40];
const CORK_OAK_TREE_IDS = [27];
const ORANGE_TREE_IDS = [15];
const LEMON_TREE_IDS = [12];
const CEDAR_TREE_IDS = [23];
const MIMOSA_TREE_IDS = [26];
const ARAUCARIA_TREE_IDS = [22];
const CERCIS_TREE_IDS = [24];
const GINKGO_TREE_IDS = [13];
const OLIVE_TREE_IDS = [18];
const BAMBOO_TREE_IDS = [17];
const ALBIZIA_TREE_IDS = [16];
const MADRONO_TREE_IDS = [30];
const CORNUS_FLORIDA_TREE_IDS = [14];
const RHODODENDRON_TREE_IDS = [20];
const WISTERIA_TREE_IDS = [21];
const GREVILLEA_TREE_IDS = [9];
const GOOSEBERRY_TREE_IDS = [31];

const TreeIcon: React.FC<{ treeId: number, className: string }> = ({ treeId, className }) => {
    const iconProps = { className };
    if (PLUM_TREE_IDS.includes(treeId)) return <PlumIcon {...iconProps} />;
    if (APPLE_TREE_IDS.includes(treeId)) return <AppleIcon {...iconProps} />;
    if (PEAR_TREE_IDS.includes(treeId)) return <PearIcon {...iconProps} />;
    if (HOLLY_TREE_IDS.includes(treeId)) return <HollyIcon {...iconProps} />;
    if (MAPLE_TREE_IDS.includes(treeId)) return <MapleIcon {...iconProps} />;
    if (PRUNUS_PENDULA_TREE_IDS.includes(treeId)) return <PrunusPendulaIcon {...iconProps} />;
    if (CHERRY_TREE_IDS.includes(treeId)) return <CherryIcon {...iconProps} />;
    if (CAMELIA_TREE_IDS.includes(treeId)) return <CameliaIcon {...iconProps} />;
    if (MAGNOLIA_TREE_IDS.includes(treeId)) return <MagnoliaIcon {...iconProps} />;
    if (LIQUIDAMBAR_TREE_IDS.includes(treeId)) return <LiquidambarIcon {...iconProps} />;
    if (PEACH_TREE_IDS.includes(treeId)) return <PeachIcon {...iconProps} />;
    if (OAK_TREE_IDS.includes(treeId)) return <OakIcon {...iconProps} />;
    if (QUINCE_TREE_IDS.includes(treeId)) return <QuinceIcon {...iconProps} />;
    if (WALNUT_TREE_IDS.includes(treeId)) return <WalnutIcon {...iconProps} />;
    if (CHESTNUT_TREE_IDS.includes(treeId)) return <ChestnutIcon {...iconProps} />;
    if (CORK_OAK_TREE_IDS.includes(treeId)) return <CorkOakIcon {...iconProps} />;
    if (ORANGE_TREE_IDS.includes(treeId)) return <OrangeIcon {...iconProps} />;
    if (LEMON_TREE_IDS.includes(treeId)) return <LemonIcon {...iconProps} />;
    if (CEDAR_TREE_IDS.includes(treeId)) return <CedarOfLebanonIcon {...iconProps} />;
    if (MIMOSA_TREE_IDS.includes(treeId)) return <MimosaIcon {...iconProps} />;
    if (ARAUCARIA_TREE_IDS.includes(treeId)) return <AraucariaIcon {...iconProps} />;
    if (CERCIS_TREE_IDS.includes(treeId)) return <CercisIcon {...iconProps} />;
    if (GINKGO_TREE_IDS.includes(treeId)) return <GinkgoIcon {...iconProps} />;
    if (OLIVE_TREE_IDS.includes(treeId)) return <OliveIcon {...iconProps} />;
    if (BAMBOO_TREE_IDS.includes(treeId)) return <BambooIcon {...iconProps} />;
    if (ALBIZIA_TREE_IDS.includes(treeId)) return <AlbiziaIcon {...iconProps} />;
    if (MADRONO_TREE_IDS.includes(treeId)) return <MadronoIcon {...iconProps} />;
    if (CORNUS_FLORIDA_TREE_IDS.includes(treeId)) return <CornusFloridaIcon {...iconProps} />;
    if (RHODODENDRON_TREE_IDS.includes(treeId)) return <RhododendronIcon {...iconProps} />;
    if (WISTERIA_TREE_IDS.includes(treeId)) return <WisteriaIcon {...iconProps} />;
    if (GREVILLEA_TREE_IDS.includes(treeId)) return <GrevilleaIcon {...iconProps} />;
    if (GOOSEBERRY_TREE_IDS.includes(treeId)) return <GooseberryIcon {...iconProps} />;

    return <span className="font-bold text-white leading-none text-xs">{treeId > 0 ? treeId : '?'}</span>;
};


const InfoPanel: React.FC<InfoPanelProps> = ({ isOpen, onClose, selectedDate, isCompareMode, compareDates }) => {
    const { t, lng } = useLanguage();
    
    const treeTypesSorted = Array.from(TREE_NAMES.entries())
        .filter(([id]) => id !== 10) // Exclude '???'
        .map(([id, info]) => {
            const commonName = info.common[lng];
            const genusName = info.genus?.[lng];
            const displayName = genusName && genusName !== commonName ? `${genusName} - ${commonName}` : commonName;
            return { id, displayName };
        })
        .sort((a, b) => a.displayName.localeCompare(b.displayName));


    return (
        <div className={`absolute bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm shadow-2xl rounded-t-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="p-4 max-h-[45vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{t('infoPanelTitle')}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">{isCompareMode ? t('comparisonRange') : t('planDate')}</h3>
                    <p className="text-gray-600 bg-gray-100 p-2 rounded-md">
                        {isCompareMode ? `${compareDates.dateA} - ${compareDates.dateB}` : selectedDate}
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('treeTypes')}</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {treeTypesSorted.map(({id, displayName}) => (
                                <div key={id} className="flex items-center space-x-3">
                                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                                        <TreeIcon treeId={id} className="text-white w-4 h-4" />
                                    </div>
                                    <span className="text-sm text-gray-800">{displayName}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('statusLegend')}</h3>
                        <div className="space-y-2">
                            {Object.entries(statusColors).map(([status, colorClass]) => (
                                <div key={status} className="flex items-center space-x-3">
                                    <div className={`w-5 h-5 rounded-full ${colorClass} border`}></div>
                                    <span className="text-sm text-gray-800">{t(`treeStatus_${status}`)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPanel;
