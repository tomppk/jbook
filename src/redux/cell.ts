// Define types a Cell can have
export type CellTypes = 'code' | 'cell';

// Define interface to describe Cell
export interface Cell {
  id: string;
  type: 'code' | 'text';
  content: string;
}
