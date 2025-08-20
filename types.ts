
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
  name: string;
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
