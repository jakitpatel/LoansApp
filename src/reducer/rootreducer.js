import { combineReducers } from 'redux';
import userReducer from './userReducer';
import loansReducer from './loansReducer';
import loanDetailsReducer from './loanDetailsReducer';
import MissingLoansReducer from './MissingLoansReducer';
import LoanDocsReducer from './LoanDocsReducer';

const rootReducer = combineReducers({
    userReducer,
    loansReducer,
    loanDetailsReducer,
    MissingLoansReducer,
    LoanDocsReducer
});

export default rootReducer;