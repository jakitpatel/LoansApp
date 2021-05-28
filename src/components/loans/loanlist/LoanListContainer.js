import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import Loanlist from "./Loanlist.js";
import LoanlistD from "./teamd/LoanlistD.js";

function LoanListContainer(props) {
    const { session_token, teamInt,teamChangeFlag, uid, isInternalUser } = useSelector(state => {
        return {
            ...state.userReducer
        }
    });
    console.log("teamInt : "+teamInt);
    return (
        <div>
            {teamInt==="teamd"
                ? <LoanlistD loanRec={props.loanRec} />
                : <Loanlist loanRec={props.loanRec} />
            }
        </div>
    );
}

export default LoanListContainer;