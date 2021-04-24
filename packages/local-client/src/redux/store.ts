import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

// Create redux store
// Pass in our combined reducers, empty object for initial state,
// apply redux-thunk middleware for async actions
export const store = createStore(reducers, {}, applyMiddleware(thunk));
