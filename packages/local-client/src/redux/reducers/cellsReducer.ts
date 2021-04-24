import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

// Interface to define exact output of this reducer
// Data is object with key cell id and value the actual Cell
interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

// Define initial state that this reducer outputs to redux store on initialization
const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

// Define the actual reducer with arguments state with default value of
// initialState and action. Return value satisfies CellsState interface
// Reducers always return new state object, not modify previous state object to
// prevent accidentally referencing the old object

// Wrap our reducer with Immer produce method to create new state more easily
// Immer allows to make direct updates to state and produces new state based
// on those updates
const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    // If error while saving cells list then state.err will be the error message
    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload;
      return state;

    // When fetching cells set loading true and error null to reset any previous
    // errors
    case ActionType.FETCH_CELLS:
      state.loading = true;
      state.error = null;
      return state;

    // Response we got back is an array of Cell objects. New state.order array
    // is created by mapping over response array and returning 'id' string
    // of each Cell object in correct order.
    // reduce() is similar to map() but rather than creating a new array it
    // will iterate over each item and run callback on each to add in new
    // data.
    // New state.data is created using reduce().
    // accumulator or acc initial value is empty object of type CellsState 'data'
    // property so {} as CellsState['data']
    // Iterate over each cell in cells array from action.payload. For each cell
    // create a new key:value pair inside the acc object with cell.id as key
    // and the Cell object as value just like defined in interface CellsState.data
    // return acc object. This new object with key:values of cells is updated
    // redux store state.data
    case ActionType.FETCH_CELLS_COMPLETE:
      state.order = action.payload.map((cell) => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState['data']);

      return state;

    // No longer loading, error set to err.message we got from response and
    // and which is in action.payload of FETCH_CELLS_ERROR action type
    case ActionType.FETCH_CELLS_ERROR:
      state.loading = false;
      state.error = action.payload;
      return state;

    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      // Immer allows to directly modify state object and automatically returns
      // new state object
      // Find cell with id we want to update from previous redux state and
      // update its content property with new content from action.payload
      // Add return state. Immer returns the state automatically so this is
      // not strictly necessary but if we do not add return state, Typescript will
      // otherwise infer possible return type as undefined.
      state.data[id].content = content;
      return state;

    // Delete cell from data object with id of action.payload
    // Filter state.order array and create new array containing all other id's
    // except the one id we want to delete
    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter((id) => id !== action.payload);
      return state;

    // Iterate over all id's in array and return index of id we are looking for
    // If direction is 'up' then decrease 1 from index, otherwise add 1
    // Check that target index is not out of bounds
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }

      // Move 'id' from targetIndex to index
      state.order[index] = state.order[targetIndex];
      // Move 'id' of action.payload ie the cell id we want to move to targetIndex
      state.order[targetIndex] = action.payload.id;

      return state;

    // Create a new cell of type 'code' or 'text' before cell with given 'id'
    // If 'id' null then add new cell to end of list
    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        content: '',
        type: action.payload.type,
        id: randomId(),
      };

      // Assign new key to data property of id we just generated
      state.data[cell.id] = cell;

      // Find id of cell we want to insert new cell before
      // If not found return -1
      const foundIndex = state.order.findIndex(
        (id) => id === action.payload.id
      );

      // If found index null then we add the new cell at the start of array
      // Else add new cell after index at foundIndex
      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }

      return state;

    default:
      return state;
  }
});

// Generate a random number. Convert it into a string filled with numbers and
// letters. toString(36) means base 36 so it can be any number from 0-9 and
// letter from A-Z.
// Take a portion of the string we get back with substring from index 2-5
const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;
