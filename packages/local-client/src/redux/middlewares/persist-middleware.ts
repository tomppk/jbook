import { Dispatch } from 'redux';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { saveCells } from '../action-creators';
import { RootState } from '../reducers';

// Middleware is a function that returns a function, that returns a function
// Middleware to save cells when action is dispatched that changes cells.
// Extract dispatch and getState from store, next forwards action to inner
// function
// Inner function forwards action to next middleware
// Actions just pass through this middleware. We only screen for specific
// actions that will change the order of cells and if such action passes through
// then we dispatch action to save cells as there has been a change in cells
export const persistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>;
  getState: () => RootState;
}) => {
  let timer: any;

  return (next: (action: Action) => void) => {
    return (action: Action) => {
      // Just forward to next middleware without touching it
      next(action);
      // Check to see if action type is one that we care about
      // True if action.type matches one of the types inside array
      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL,
        ].includes(action.type)
      ) {
        // Use debouncing to throttle the number of post requests when code
        // changes to once every 250ms
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          // When we call saveCells() we will get back a function
          // We are immediately invoking that function with dispatch and getState
          saveCells()(dispatch, getState);
        }, 250);
      }
    };
  };
};
