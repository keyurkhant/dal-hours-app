import user from './user/reducer';

const {combineReducers} = require('redux');

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
