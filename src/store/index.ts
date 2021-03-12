import { createStore } from 'redux';
import reducers from './reducers';

let store = createStore(reducers,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION__());

export default store;
