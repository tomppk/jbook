import { ActionType } from '../action-types';
import { CellTypes } from '../cell';

// Define type for direction cells can move
export type Direction = 'up' | 'down';

// Define interfaces for each action
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

// Export Action which is a union of all our actions so contains all possible
// actions for Typescript to check that only these actions are allowed
export type Action =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellAfterAction
  | UpdateCellAction
  | BundleStartAction
  | BundleCompleteAction;
