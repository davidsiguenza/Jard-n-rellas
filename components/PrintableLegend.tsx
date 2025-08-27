import React from 'react';
// FIX: Updated icon import path to point to the correct module index file.
import { CloseIcon, PlumIcon, AppleIcon, PearIcon, HollyIcon, MapleIcon, CherryIcon, CameliaIcon, PrunusPendulaIcon, MagnoliaIcon, LiquidambarIcon, PeachIcon, OakIcon, QuinceIcon, WalnutIcon, ChestnutIcon, CorkOakIcon, OrangeIcon, LemonIcon, CedarOfLebanonIcon, MimosaIcon, AraucariaIcon, CercisIcon, GinkgoIcon, OliveIcon, BambooIcon, AlbiziaIcon, MadronoIcon, CornusFloridaIcon, RhododendronIcon, WisteriaIcon, GrevilleaIcon, GooseberryIcon } from './icons/index';
import { useLanguage } from '../i18n/LanguageContext';
import { TreeStatus } from '../types';

interface PrintableLegendProps {
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
        <div className="flex items-center space-x-2 p-1 border border-gray-200 rounded-md">
            <div className="w-6 h-6 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">
                {Icon ? <Icon className="w-4 h-4 text-white" /> : <span className="text-white text-xs font-bold">{id}</span>}
            </div>
            <span className="text-gray-800">{name}</span>
        </div>
    );
};


const PrintableLegend: React.FC<PrintableLegendProps> = ({ selectedDate, treeTypes }) => {
    const { t } = useLanguage();

    return (
        <div style={{ width: '800px', background: 'white', color: 'black' }} className="p-8 font-sans">
            <h1 className="text-3xl font-bold mb-6 border-b pb-2">{t('legendTitle')}: {selectedDate}</h1>
            
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">{t('status')}</h2>
                <div className="flex flex-col space-y-3">
                    {Object.values(TreeStatus).map(status => (
                        <div key={status} className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full border-2 ${statusInfo[status].class}`} />
                            <span className="text-lg">{t(statusInfo[status].labelKey)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-3">{t('treeTypes')}</h2>
                <div className="grid grid-cols-3 gap-x-6 gap-y-3 text-base">
                    {treeTypes.species.map(({ id, name }) => (
                        <TreeTypeItem key={`species-${id}`} id={id} name={name} />
                    ))}
                    {Array.from(treeTypes.genera.entries()).map(([genusName, speciesList]) => (
                        <React.Fragment key={genusName}>
                             <div className="col-span-3 mt-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-600">{genusName}</h3>
                            </div>
                            {speciesList.map(({ id, name }) => (
                                <TreeTypeItem key={`species-${id}`} id={id} name={name} />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PrintableLegend;