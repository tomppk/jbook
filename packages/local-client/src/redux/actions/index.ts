import { ActionType } from '../action-types';
import { Cell, CellTypes } from '../cell';

// Define type for direction cells can move
export type Direction = 'up' | 'down';

// Define interfaces for each action to describe their structure/content
// MoveCell id of cell we want to move, direction where to move
export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: Direction;
  };
}

// Payload id of cell we want to delete
export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}

// Id of cell and type of cell either code or text cell
// If null then add as first cell
export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: string | null;
    type: CellTypes;
  };
}

// Id of cell we want to update. String of content either text or code
export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  };
}

// Id of cell where bundling was started
export interface BundleStartAction {
  type: ActionType.BUNDLE_START;
  payload: {
    cellId: string;
  };
}

// Id of cell for which bundling process was completed
// Bundle output that contains bundled code and possible errors
export interface BundleCompleteAction {
  type: ActionType.BUNDLE_COMPLETE;
  payload: {
    cellId: string;
    bundle: {
      code: string;
      err: string;
    };
  };
}

// No payload as just make a fetch request
export interface FetchCellsAction {
  type: ActionType.FETCH_CELLS;
}

// Payload response we get back ie. array of Cell objects
export interface FetchCellsCompleteAction {
  type: ActionType.FETCH_CELLS_COMPLETE;
  payload: Cell[];
}

// Payload error string we get back
export interface FetchCellsErrorAction {
  type: ActionType.FETCH_CELLS_ERROR;
  payload: string;
}

// Export Action which is a union of all our actions so contains all possible
// actions for Typescript to check that only these actions are allowed
export type Action =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellAfterAction
  | UpdateCellAction
  | BundleStartAction
  | BundleCompleteAction
  | FetchCellsAction
  | FetchCellsCompleteAction
  | FetchCellsErrorAction;
