import { createStore } from 'redux';
import reducers from './reducers';

let store = createStore(reducers,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION__());

export default store;


const pointer = {
  '0-30': 'n-resize',
  '30-60': 'ne-resize',
  '60-120': 'w-resize',
  '120-150': 'nw-resize',
  '150-210': 'n-resize',
  '210-240': 'ne-resize',
  '240-300': 'e-resize',
  '301-330': 'se-resize',
  '330-359': 's-resize'
}