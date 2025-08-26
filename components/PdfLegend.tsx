import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { TREE_NAMES, statusColors } from '../constants';
import { TreeStatus } from '../types';
import { PlumIcon, AppleIcon, PearIcon, HollyIcon, MapleIcon, CherryIcon, CameliaIcon, PrunusPendulaIcon, MagnoliaIcon, LiquidambarIcon, PeachIcon, OakIcon, QuinceIcon, WalnutIcon, ChestnutIcon, CorkOakIcon, OrangeIcon, LemonIcon, CedarOfLebanonIcon, MimosaIcon, AraucariaIcon, CercisIcon, GinkgoIcon, OliveIcon, BambooIcon, AlbiziaIcon, MadronoIcon, CornusFloridaIcon, RhododendronIcon, WisteriaIcon, GrevilleaIcon, GooseberryIcon } from './icons/index';

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


interface PdfLegendProps {
    selectedDate: string;
    isCompareMode: boolean;
    compareDates: { dateA: string; dateB: string };
}

const PdfLegend: React.FC<PdfLegendProps> = ({ selectedDate, isCompareMode, compareDates }) => {
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
        <div className="w-full bg-white p-4 text-sm flex-shrink-0 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Garden Map</h2>
            <div className="mb-4 bg-gray-50 p-2 rounded-md">
                <h3 className="font-semibold text-gray-700">{isCompareMode ? t('comparisonRange') : t('planDate')}</h3>
                <p className="text-gray-600">{isCompareMode ? `${compareDates.dateA} vs ${compareDates.dateB}` : selectedDate}</p>
            </div>
            
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">{t('treeTypes')}</h3>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
                        {treeTypesSorted.map(({id, displayName}) => (
                            <div key={id} className="flex items-center space-x-2 break-inside-avoid">
                                <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                                    <TreeIcon treeId={id} className="text-white w-3.5 h-3.5" />
                                </div>
                                <span className="text-gray-800">{displayName}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-x-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">{t('statusLegend')}</h3>
                        <div className="space-y-1.5 text-sm">
                            {Object.values(TreeStatus).map(status => (
                                <div key={status} className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full ${statusColors[status]} border`}></div>
                                    <span className="text-gray-800">{t(`treeStatus_${status}`)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {isCompareMode && (
                        <div className="col-span-2">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2 border-b pb-1">{t('compareLegendTitle')}</h3>
                            <div className="space-y-1.5 text-sm">
                                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-green-500 border border-green-300 mr-2"></div> {t('legendAdded')}</div>
                                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-red-500 border border-red-300 mr-2"></div> {t('legendRemoved')}</div>
                                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-blue-500 border border-blue-300 mr-2"></div> {t('legendMovedNew')}</div>
                                <div className="flex items-center"><div className="w-4 h-4 rounded-full border-2 border-dashed border-sky-400 mr-2"></div> {t('legendMovedOld')}</div>
                                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-purple-500 border border-purple-300 mr-2"></div> {t('legendModified')}</div>
                                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-gray-800 border border-gray-600 opacity-60 mr-2"></div> {t('legendUnchanged')}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PdfLegend;