import React from "react";
import { useSelector } from 'react-redux';
import preval from 'preval.macro';
//import PieChart from './Piechart';
import SummaryTable from './SummaryTable/SummaryTable.js';
//import { internalUserList } from './../../commonVar';
//import {API_URL} from './../../const.js';
const { internalUserList } = window.commonVar;
const {API_URL, env} = window.constVar;

function DashboardMain(props) {
    const { name, isInternalUser, teamInt, uid } = useSelector(state => {
        return {
            ...state.userReducer
        }
    });
    console.log("name : "+name);
    let userType = "External User";
    if(isInternalUser){
        userType = "Internal User";
    }
    let colorCode = "RED";
    //if(process.env.REACT_APP_ENVIRONMENT==="DEV" || process.env.REACT_APP_ENVIRONMENT==="dev"){
    if(env==="DEV" || env==="dev"){
        colorCode = "BLUE";
    }
    let showPieChartFlag = false;
    if(isInternalUser){
        for(let i=0; i<internalUserList.length; i++){
            if(internalUserList[i].value === uid){
                showPieChartFlag = true;
            }
        }
    }

    return (
        <React.Fragment>
            <div className="container" style={{height:"108px"}}>
                Hello, {name} ({userType}) {isInternalUser && (teamInt)}
                <div style={{float:"right"}}>
                    <b>App Name </b> :- {process.env.REACT_APP_NAME} <br />
                    <b>App Server </b> :- {API_URL} <br />
                    <b>Build Version</b> :- {process.env.REACT_APP_VERSION} <br />
                    <b>Build Date</b> :- {preval`module.exports = new Date().toLocaleString();`}.<br />
                    <b>Environment</b> :- <span style={{color:colorCode}}>{env}</span> <br />
                </div>
            </div>
            {showPieChartFlag &&
            <SummaryTable />
            }
            {/*<div className="chart-container" style={{height:"600px"}}>
                <PieChart />
            </div>
            */}
        </React.Fragment>
    );
}

export default DashboardMain;