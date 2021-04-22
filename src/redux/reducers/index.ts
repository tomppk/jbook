import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});

export default reducers;

// Define type RootState for Typescript and react-redux to describe
// the overall structure of the state object inside redux store
export type RootState = ReturnType<typeof reducers>;
