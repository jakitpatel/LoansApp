import { combineReducers } from 'redux';
import userReducer from './userReducer';
import loansReducer from './loansReducer';
import loanDetailsReducer from './loanDetailsReducer';

const rootReducer = combineReducers({
    userReducer,
    loansReducer,
    loanDetailsReducer
});

export default rootReducer;