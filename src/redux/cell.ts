// Define types a Cell can have
export type CellTypes = 'code' | 'text';

// Define interface to describe Cell
export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}
