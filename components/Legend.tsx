import React from 'react';
// FIX: Updated icon import path to point to the correct module index file.
import { CloseIcon, PlumIcon, AppleIcon, PearIcon, HollyIcon, MapleIcon, CherryIcon, CameliaIcon, PrunusPendulaIcon, MagnoliaIcon, LiquidambarIcon, PeachIcon, OakIcon, QuinceIcon, WalnutIcon, ChestnutIcon, CorkOakIcon, OrangeIcon, LemonIcon, CedarOfLebanonIcon, MimosaIcon, AraucariaIcon, CercisIcon, GinkgoIcon, OliveIcon, BambooIcon, AlbiziaIcon, MadronoIcon, CornusFloridaIcon, RhododendronIcon, WisteriaIcon, GrevilleaIcon, GooseberryIcon } from './icons/index';
import { useLanguage } from '../i18n/LanguageContext';
import { TreeStatus } from '../types';

interface LegendProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string;
    treeTypes: { genera: Map<string, any[]>, species: any[] };
}

const statusInfo: Record<TreeStatus, { class: string; labelKey: string }> = {
  [TreeStatus.Identified]: { class: 'bg-yellow-900 border-yellow-700', labelKey: 'treeStatus_identified' },
  [TreeStatus.Unidentified]: { class: 'bg-red-700 border-red-500', labelKey: 'treeStatus_unidentified' },
  [TreeStatus.ToBeCut]: { class: 'bg-gray-500 border-gray-400', labelKey: 'treeStatus_to_be_cut' },
};

const iconMap: { [key: number]: React.FC<{className?: string}> } = {
    1: PlumIcon, 2: CherryIcon, 3: CameliaIcon, 4: HollyIcon, 5: MagnoliaIcon, 6: MagnoliaIcon, 7: PrunusPendulaIcon, 8: LiquidambarIcon, 9: GrevilleaIcon, 11: MapleIcon, 12: LemonIcon, 13: GinkgoIcon, 14: CornusFloridaIcon, 15: OrangeIcon, 16: AlbiziaIcon, 17: BambooIcon, 18: OliveIcon, 19: MapleIcon, 20: RhododendronIcon, 21: WisteriaIcon, 22: AraucariaIcon, 23: CedarOfLebanonIcon, 24: CercisIcon, 25: MapleIcon, 26: MimosaIcon, 27: CorkOakIcon, 28: OakIcon, 29: OakIcon, 30: MadronoIcon, 31: GooseberryIcon, 32: CherryIcon, 33: AppleIcon, 34: PeachIcon, 35: PearIcon, 36: CherryIcon, 37: QuinceIcon, 38: WalnutIcon, 39: PeachIcon, 40: ChestnutIcon, 41: PlumIcon, 42: PlumIcon, 43: PlumIcon, 44: PlumIcon
};

const TreeTypeItem: React.FC<{ id: number; name: string; }> = ({ id, name }) => {
    const Icon = iconMap[id];
    return (
        <div className="flex items-center space-x-2 text-sm p-1.5 bg-gray-50 rounded-md">
            <div className="w-6 h-6 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">
                {Icon ? <Icon className="w-4 h-4 text-white" /> : <span className="text-white text-xs font-bold">{id}</span>}
            </div>
            <span className="text-gray-800">{name}</span>
        </div>
    );
};

const Legend: React.FC<LegendProps> = ({ isOpen, onClose, selectedDate, treeTypes }) => {
    const { t } = useLanguage();

    return (
        <div 
            id="legend-panel" 
            className={`fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md shadow-2xl rounded-t-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="legend-title"
        >
            <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h2 id="legend-title" className="text-lg font-bold text-gray-800">{t('legendTitle')}: {selectedDate}</h2>
                <button 
                    onClick={onClose} 
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                    aria-label={t('cancel')}
                >
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[50vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">{t('status')}</h3>
                        <div className="flex flex-col space-y-2">
                            {Object.values(TreeStatus).map(status => (
                                <div key={status} className="flex items-center space-x-2">
                                    <div className={`w-4 h-4 rounded-full border ${statusInfo[status].class}`} />
                                    <span className="text-sm text-gray-700">{t(statusInfo[status].labelKey)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">{t('treeTypes')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
                            {treeTypes.species.map(({ id, name }) => (
                                <TreeTypeItem key={`species-${id}`} id={id} name={name} />
                            ))}
                            {Array.from(treeTypes.genera.entries()).map(([genusName, speciesList]) => (
                                <React.Fragment key={genusName}>
                                    {speciesList.map(({ id, name }) => (
                                        <TreeTypeItem key={`species-${id}`} id={id} name={name} />
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Legend;