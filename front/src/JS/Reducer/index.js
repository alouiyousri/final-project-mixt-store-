// redux/reducers/index.js
import { combineReducers } from 'redux';

import productReducer from './ProductReducer';
import orderReducer from './OrderReducer';
import adminReducer from './AdminReducer';
import basketReducer from './basketreducer';

const rootReducer = combineReducers({
  product: productReducer,
  order: orderReducer,
  admin: adminReducer,
  basket: basketReducer
});

export default rootReducer;
