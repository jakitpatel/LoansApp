import { combineReducers } from 'redux';
import userReducer from './userReducer';
import loansReducer from './loansReducer';
import wireDetailsReducer from './wireDetailsReducer';

const rootReducer = combineReducers({
    userReducer,
    loansReducer,
    wireDetailsReducer
});

export default rootReducer;