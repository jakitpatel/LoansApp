import React from "react";
import { useSelector } from 'react-redux';
import preval from 'preval.macro';
import { useDispatch } from 'react-redux';

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
    const onChangeTeam = (e) => {
        console.log("On Change of Team Value");
        dispatch({
            type:'UPDATEUSER',
            payload:{
              teamInt: e.target.value
            }
          });
    }
    return (
        <React.Fragment>
            <div className="container">
                Hello, {name} ({userType}) {isInternalUser && (teamInt)}
                <div style={{float:"right"}}>
                    <b>App Name </b> :- {process.env.REACT_APP_NAME} <br />
                    <b>Build Version</b> :- {process.env.REACT_APP_VERSION} <br />
                    <b>Build Date</b> :- {preval`module.exports = new Date().toLocaleString();`}.
                </div>
                {isInternalUser &&
                <>
                <div style={{height:"40px"}} />
                <div className="form-group">
                    <label className="col-sm-2 col-form-label" style={{width:"90px"}}>Team</label>
                    <select
                        className="form-control custom-select col-sm-4"
                        name="teamInt"
                        value={teamInt}
                        onChange={e => { onChangeTeam(e)}}
                    >
                        <option value="teama">teama</option>
                        <option value="teamb">teamb</option>
                        <option value="teamc">teamc</option>
                    </select>
                </div>
                </>
                }
            </div>
        </React.Fragment>
    );
}

export default DashboardMain;