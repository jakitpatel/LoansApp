import { combineReducers } from 'redux';
import userReducer from './userReducer';
import loansReducer from './loansReducer';
import loanDetailsReducer from './loanDetailsReducer';
import MissingLoansReducer from './MissingLoansReducer';

const rootReducer = combineReducers({
    userReducer,
    loansReducer,
    loanDetailsReducer,
    MissingLoansReducer
});

export default rootReducer;