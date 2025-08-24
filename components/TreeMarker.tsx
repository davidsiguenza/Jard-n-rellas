
import React from 'react';
import { Tree, TreeStatus, TreeSize, DiffTree, TreeDiffStatus } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { TREE_NAMES } from '../constants';
import { PlumIcon, AppleIcon, PearIcon, HollyIcon, MapleIcon, CherryIcon, CameliaIcon, PrunusPendulaIcon, MagnoliaIcon, LiquidambarIcon, PeachIcon, OakIcon, QuinceIcon, WalnutIcon, ChestnutIcon, CorkOakIcon, OrangeIcon, LemonIcon, CedarOfLebanonIcon, MimosaIcon, AraucariaIcon, CercisIcon, GinkgoIcon, OliveIcon, BambooIcon, AlbiziaIcon, MadronoIcon, CornusFloridaIcon, RhododendronIcon, WisteriaIcon, GrevilleaIcon, GooseberryIcon } from './icons/index';

interface TreeMarkerProps {
  tree: Tree | DiffTree;
  onClick: (tree: Tree | DiffTree) => void;
  isEditMode: boolean;
  isCompareMode?: boolean;
  highlightedFilter: string;
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
  [TreeSize.XS]: 'w-2 h-2 text-[5px]',
  [TreeSize.S]: 'w-2.5 h-2.5 text-[5px]',
  [TreeSize.M]: 'w-3 h-3 text-[6px]',
  [TreeSize.L]: 'w-3.5 h-3.5 text-[6px]',
  [TreeSize.XL]: 'w-4 h-4 text-[7px]',
};

// --- Icon Size Definitions based on Visual Weight ---

// SH (Super Alto): Very high visual weight, smallest icon.
const iconSizeSuperHighVisualWeight: Record<TreeSize, string> = {
  [TreeSize.XS]: 'w-1.5 h-1.5',
  [TreeSize.S]: 'w-2 h-2',
  [TreeSize.M]: 'w-2.5 h-2.5',
  [TreeSize.L]: 'w-3 h-3',
  [TreeSize.XL]: 'w-3.5 h-3.5',
};

// A (Alto): High visual weight, smaller icon to compensate.
const iconSizeHighVisualWeight: Record<TreeSize, string> = {
  [TreeSize.XS]: 'w-2 h-2',
  [TreeSize.S]: 'w-2.5 h-2.5',
  [TreeSize.M]: 'w-3 h-3',
  [TreeSize.L]: 'w-3.5 h-3.5',
  [TreeSize.XL]: 'w-4 h-4',
};

// M (Medio): Medium visual weight, standard size.
const iconSizeMediumVisualWeight: Record<TreeSize, string> = {
  [TreeSize.XS]: 'w-2.5 h-2.5',
  [TreeSize.S]: 'w-3 h-3',
  [TreeSize.M]: 'w-3.5 h-3.5',
  [TreeSize.L]: 'w-4 h-4',
  [TreeSize.XL]: 'w-4.5 h-4.5',
};

// B (Bajo): Low visual weight, larger icon to compensate.
const iconSizeLowVisualWeight: Record<TreeSize, string> = {
  [TreeSize.XS]: 'w-3 h-3',
  [TreeSize.S]: 'w-3.5 h-3.5',
  [TreeSize.M]: 'w-4 h-4',
  [TreeSize.L]: 'w-4.5 h-4.5',
  [TreeSize.XL]: 'w-5 h-5',
};

// SB (Super Bajo): Very low visual weight, largest icon.
const iconSizeSuperLowVisualWeight: Record<TreeSize, string> = {
  [TreeSize.XS]: 'w-3.5 h-3.5',
  [TreeSize.S]: 'w-4 h-4',
  [TreeSize.M]: 'w-4.5 h-4.5',
  [TreeSize.L]: 'w-5 h-5',
  [TreeSize.XL]: 'w-6 h-6',
};


// --- Icon Visual Weight Classification ---
const SUPER_HIGH_VISUAL_WEIGHT_TREE_IDS = [
    ...OAK_TREE_IDS,
];

const HIGH_VISUAL_WEIGHT_TREE_IDS = [
    ...CAMELIA_TREE_IDS,
    ...CORK_OAK_TREE_IDS,
    ...WALNUT_TREE_IDS,
    ...PEACH_TREE_IDS,
    ...QUINCE_TREE_IDS,
    ...APPLE_TREE_IDS,
    ...ORANGE_TREE_IDS,
    ...LEMON_TREE_IDS,
    ...MIMOSA_TREE_IDS,
    ...ARAUCARIA_TREE_IDS,
    ...CERCIS_TREE_IDS,
    ...GINKGO_TREE_IDS,
    ...OLIVE_TREE_IDS,
    ...BAMBOO_TREE_IDS,
    ...PRUNUS_PENDULA_TREE_IDS,
    ...ALBIZIA_TREE_IDS,
    ...MADRONO_TREE_IDS,
    ...CORNUS_FLORIDA_TREE_IDS,
    ...WISTERIA_TREE_IDS,
    ...GREVILLEA_TREE_IDS,
    ...GOOSEBERRY_TREE_IDS,
];

const LOW_VISUAL_WEIGHT_TREE_IDS: number[] = [
    ...RHODODENDRON_TREE_IDS,
];

const SUPER_LOW_VISUAL_WEIGHT_TREE_IDS: number[] = [

];


const TreeMarker: React.FC<TreeMarkerProps> = ({ tree, onClick, isEditMode, isCompareMode, highlightedFilter = '' }) => {
  const { lng, t } = useLanguage();
  
  const diffStatus = (tree as DiffTree).diffStatus;
  const inDiffModeWithStatus = isCompareMode && diffStatus;

  const getDisplayName = () => {
    const treeInfo = TREE_NAMES.get(tree.id);
    if (!treeInfo) {
      if (tree.name === 'New Tree') return t('newTree');
      if (tree.name === '???') return t('unknownTreeQuestion');
      return tree.name;
    }
    
    const commonName = treeInfo.common[lng];
    const genusName = treeInfo.genus?.[lng];

    if (genusName && genusName !== commonName) {
        return `${genusName} - ${commonName}`;
    }
    return commonName;
  };

  const isHighlighted = (() => {
    if (!highlightedFilter) return false;
    const [type, value] = highlightedFilter.split(':');
    if (!type || !value) return false;

    const treeInfo = TREE_NAMES.get(tree.id);
    if (type === 'genus') {
      return treeInfo?.genus?.[lng] === value;
    }
    if (type === 'species') {
      return tree.id === parseInt(value, 10);
    }
    return false;
  })();

  const isFilteredOut = highlightedFilter && !isHighlighted;
  
  const interactionClasses = isEditMode
    ? 'cursor-pointer hover:scale-125 hover:shadow-lg'
    : inDiffModeWithStatus
    ? 'cursor-pointer hover:scale-125 hover:shadow-lg'
    : 'cursor-pointer hover:scale-110 hover:shadow-md';

  const isPlumTree = PLUM_TREE_IDS.includes(tree.id);
  const isAppleTree = APPLE_TREE_IDS.includes(tree.id);
  const isPearTree = PEAR_TREE_IDS.includes(tree.id);
  const isHollyTree = HOLLY_TREE_IDS.includes(tree.id);
  const isMapleTree = MAPLE_TREE_IDS.includes(tree.id);
  const isPrunusPendulaTree = PRUNUS_PENDULA_TREE_IDS.includes(tree.id);
  const isCherryTree = CHERRY_TREE_IDS.includes(tree.id);
  const isCameliaTree = CAMELIA_TREE_IDS.includes(tree.id);
  const isMagnoliaTree = MAGNOLIA_TREE_IDS.includes(tree.id);
  const isLiquidambarTree = LIQUIDAMBAR_TREE_IDS.includes(tree.id);
  const isPeachTree = PEACH_TREE_IDS.includes(tree.id);
  const isOakTree = OAK_TREE_IDS.includes(tree.id);
  const isQuinceTree = QUINCE_TREE_IDS.includes(tree.id);
  const isWalnutTree = WALNUT_TREE_IDS.includes(tree.id);
  const isChestnutTree = CHESTNUT_TREE_IDS.includes(tree.id);
  const isCorkOakTree = CORK_OAK_TREE_IDS.includes(tree.id);
  const isOrangeTree = ORANGE_TREE_IDS.includes(tree.id);
  const isLemonTree = LEMON_TREE_IDS.includes(tree.id);
  const isCedarTree = CEDAR_TREE_IDS.includes(tree.id);
  const isMimosaTree = MIMOSA_TREE_IDS.includes(tree.id);
  const isAraucariaTree = ARAUCARIA_TREE_IDS.includes(tree.id);
  const isCercisTree = CERCIS_TREE_IDS.includes(tree.id);
  const isGinkgoTree = GINKGO_TREE_IDS.includes(tree.id);
  const isOliveTree = OLIVE_TREE_IDS.includes(tree.id);
  const isBambooTree = BAMBOO_TREE_IDS.includes(tree.id);
  const isAlbiziaTree = ALBIZIA_TREE_IDS.includes(tree.id);
  const isMadronoTree = MADRONO_TREE_IDS.includes(tree.id);
  const isCornusFloridaTree = CORNUS_FLORIDA_TREE_IDS.includes(tree.id);
  const isRhododendronTree = RHODODENDRON_TREE_IDS.includes(tree.id);
  const isWisteriaTree = WISTERIA_TREE_IDS.includes(tree.id);
  const isGrevilleaTree = GREVILLEA_TREE_IDS.includes(tree.id);
  const isGooseberryTree = GOOSEBERRY_TREE_IDS.includes(tree.id);

  let iconSizeClasses = iconSizeMediumVisualWeight[tree.size];
  if (SUPER_HIGH_VISUAL_WEIGHT_TREE_IDS.includes(tree.id)) {
      iconSizeClasses = iconSizeSuperHighVisualWeight[tree.size];
  } else if (HIGH_VISUAL_WEIGHT_TREE_IDS.includes(tree.id)) {
      iconSizeClasses = iconSizeHighVisualWeight[tree.size];
  } else if (LOW_VISUAL_WEIGHT_TREE_IDS.includes(tree.id)) {
      iconSizeClasses = iconSizeLowVisualWeight[tree.size];
  } else if (SUPER_LOW_VISUAL_WEIGHT_TREE_IDS.includes(tree.id)) {
      iconSizeClasses = iconSizeSuperLowVisualWeight[tree.size];
  }

  const renderIcon = () => {
    const iconProps = { className: `text-white ${iconSizeClasses}` };
    if (isPlumTree) return <PlumIcon {...iconProps} />;
    if (isAppleTree) return <AppleIcon {...iconProps} />;
    if (isPearTree) return <PearIcon {...iconProps} />;
    if (isHollyTree) return <HollyIcon {...iconProps} />;
    if (isMapleTree) return <MapleIcon {...iconProps} />;
    if (isPrunusPendulaTree) return <PrunusPendulaIcon {...iconProps} />;
    if (isCherryTree) return <CherryIcon {...iconProps} />;
    if (isCameliaTree) return <CameliaIcon {...iconProps} />;
    if (isMagnoliaTree) return <MagnoliaIcon {...iconProps} />;
    if (isLiquidambarTree) return <LiquidambarIcon {...iconProps} />;
    if (isPeachTree) return <PeachIcon {...iconProps} />;
    if (isOakTree) return <OakIcon {...iconProps} />;
    if (isQuinceTree) return <QuinceIcon {...iconProps} />;
    if (isWalnutTree) return <WalnutIcon {...iconProps} />;
    if (isChestnutTree) return <ChestnutIcon {...iconProps} />;
    if (isCorkOakTree) return <CorkOakIcon {...iconProps} />;
    if (isOrangeTree) return <OrangeIcon {...iconProps} />;
    if (isLemonTree) return <LemonIcon {...iconProps} />;
    if (isCedarTree) return <CedarOfLebanonIcon {...iconProps} />;
    if (isMimosaTree) return <MimosaIcon {...iconProps} />;
    if (isAraucariaTree) return <AraucariaIcon {...iconProps} />;
    if (isCercisTree) return <CercisIcon {...iconProps} />;
    if (isGinkgoTree) return <GinkgoIcon {...iconProps} />;
    if (isOliveTree) return <OliveIcon {...iconProps} />;
    if (isBambooTree) return <BambooIcon {...iconProps} />;
    if (isAlbiziaTree) return <AlbiziaIcon {...iconProps} />;
    if (isMadronoTree) return <MadronoIcon {...iconProps} />;
    if (isCornusFloridaTree) return <CornusFloridaIcon {...iconProps} />;
    if (isRhododendronTree) return <RhododendronIcon {...iconProps} />;
    if (isWisteriaTree) return <WisteriaIcon {...iconProps} />;
    if (isGrevilleaTree) return <GrevilleaIcon {...iconProps} />;
    if (isGooseberryTree) return <GooseberryIcon {...iconProps} />;

    return (
      <span className="font-bold text-white leading-none">
        {tree.id > 0 ? tree.id : '?'}
      </span>
    );
  };
  
  const baseClasses = 'absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 border flex items-center justify-center transition-all duration-200';
  const colorClasses = inDiffModeWithStatus ? diffClasses[diffStatus] : statusColors[tree.status];
  const sizeClass = sizeDimensions[tree.size];
  
  let finalClassName = `${baseClasses} ${sizeClass} ${colorClasses} ${interactionClasses}`;
  
  if (isHighlighted) {
    finalClassName += ' ring-4 ring-offset-2 ring-yellow-400 scale-125 z-10';
  } else if (isFilteredOut) {
    finalClassName += ' opacity-30';
  }
  
  return (
    <div
      title={getDisplayName()}
      className={finalClassName}
      style={{ top: `${tree.position.y}%`, left: `${tree.position.x}%` }}
      onClick={() => onClick(tree)}
      role="button"
      tabIndex={0}
      aria-label={`Tree ${getDisplayName()}, Status: ${tree.status}`}
    >
      {renderIcon()}
    </div>
  );
};

export default TreeMarker;
