import { Dispatch } from 'redux';
import { ActionType } from '../action-types';
import {
  Action,
  UpdateCellAction,
  DeleteCellAction,
  MoveCellAction,
  InsertCellAfterAction,
  Direction,
} from '../actions';
import { CellTypes } from '../cell';
import bundle from '../../bundler';

// Annotate return types for specific actions
// Take in properties, assign them to payload values and return action
export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: {
      id,
      content,
    },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const moveCell = (id: string, direction: Direction): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: {
      id,
      direction,
    },
  };
};

// Id can be null if there is no cell. Then we insert new cell at the start
// of array.
export const insertCellAfter = (
  id: string | null,
  cellType: CellTypes
): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: {
      id,
      type: cellType,
    },
  };
};

// Action creator to create bundle. cellId and input that user wrote into editor
// Async action creator so use dispatch and redux-thunk
// Can only call dispatch with a real defined Action type
export const createBundle = (cellId: string, input: string) => {
  return async (dispatch: Dispatch<Action>) => {
    // Immediately dispatch action of type bundle start with cellId we want
    // to bundle
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId,
      },
    });

    // Await the bundled result
    const result = await bundle(input);

    // After result response is received, dispatch another action of type bundle
    // complete with payload of bundled code or error
    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: {
          code: result.code,
          err: result.err,
        },
      },
    });
  };
};
