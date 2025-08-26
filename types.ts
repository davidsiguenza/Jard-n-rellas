
export enum TreeStatus {
  Identified = 'identified',
  Unidentified = 'unidentified',
  ToBeCut = 'to_be_cut',
}

export enum TreeSize {
  XS = 'xs',
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl',
}

export interface Tree {
  id: number;
  uuid: string;
  name: string; // Stored primarily in Spanish for data consistency
  position: {
    x: number;
    y: number;
  };
  status: TreeStatus;
  size: TreeSize;
}

export interface GardenState {
  date: string;
  trees: Tree[];
}

export enum TreeDiffStatus {
  Added = 'added',
  Removed = 'removed',
  Moved = 'moved',
  Changed = 'changed',
  Unchanged = 'unchanged',
}

export interface DiffTree extends Tree {
  diffStatus: TreeDiffStatus;
  previous?: Tree; // To store old state for moved/changed trees
}

export type Language = 'es' | 'gl';
