import produce from 'immer';
import { Statement } from 'jscodeshift';
import { ActionType } from '../action-types';
import { Action } from '../actions';

// Interface to define structure of state that will be returned from reducer
// An object with key of cell id. Value object with properties loading, code
// and err. Loading describes whether we are currently bundling code
interface BundlesState {
  [key: string]: {
    loading: boolean;
    code: string;
    err: string;
  };
}

// Initialize initial state object as empty object
const initialState: BundlesState = {};

// Wrap reducer with Immer produce() method to enable modifying state directly
// Set default state to initialState and annotate return type as BundlesState
// for clarity for Typescript so it does not give possibility of returning
// undefined
const reducer = produce(
  (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      // Lookup cell with specified 'id' and overwrite its value
      // Reset any existing code and err with empty string
      case ActionType.BUNDLE_START:
        state[action.payload.cellId] = {
          loading: true,
          code: '',
          err: '',
        };
        return state;

      // When bundling is complete overwrite cell's value with bundled code
      // and possible error
      case ActionType.BUNDLE_COMPLETE:
        state[action.payload.cellId] = {
          loading: false,
          code: action.payload.bundle.code,
          err: action.payload.bundle.err,
        };
        return state;

      default:
        return state;
    }
  }
);

export default reducer;
