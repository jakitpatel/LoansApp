import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import preval from 'preval.macro';
import {API_URL} from './../../const.js';

function DashboardMain(props) {
    const { name, isInternalUser, teamInt } = useSelector(state => {
        return {
            ...state.userReducer
        }
    });
    const dispatch = useDispatch();
    console.log("name : "+name);
    let userType = "External User";
    if(isInternalUser){
        userType = "Internal User";
    }
    return (
        <React.Fragment>
            <div className="container">
                Hello, {name} ({userType}) {isInternalUser && (teamInt)}
                <div style={{float:"right"}}>
                    <b>App Name </b> :- {process.env.REACT_APP_NAME} <br />
                    <b>App Server </b> :- {API_URL} <br />
                    <b>Build Version</b> :- {process.env.REACT_APP_VERSION} <br />
                    <b>Build Date</b> :- {preval`module.exports = new Date().toLocaleString();`}.
                </div>
            </div>
        </React.Fragment>
    );
}

export default DashboardMain;