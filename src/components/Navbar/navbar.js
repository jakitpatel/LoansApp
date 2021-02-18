import React from "react";
import { useDispatch, useSelector } from 'react-redux';

// Stateless Function Component
export default function NavBar(props) {

  const { name, isInternalUser, teamInt } = useSelector(state => {
    return {
        ...state.userReducer
    }
  });
  const dispatch = useDispatch();

  const onChangeTeam = (e) => {
    console.log("On Change of Team Value");
    dispatch({
        type:'UPDATEUSER',
        payload:{
          teamInt: e.target.value
        }
      });
    dispatch({
      type:'UPDATELOANLIST',
      payload:{
        filtersB : [],
        filtersA : [],
        filtersC : [],
        filters : []
      }
    });
  }

  return (
    <nav className="navbar navbar-dark fixed-top bg-light flex-md-nowrap p-0 shadow">
      <div style={{textAlign:"center", width: "100%", fontWeight: "bold", fontSize: "x-large"}}>CFSB LOAN APP</div>
      {isInternalUser &&
      <>     
      <ul className="navbar-nav px-2">
        <li className="nav-item text-nowrap">
          <div className="form-group" style={{marginTop:"0rem", marginBottom:"0rem", width:"200px"}}>
              <label className="col-sm-4 col-form-label" style={{width:"90px"}}>Team</label>
              <select
                  className="form-control custom-select col-sm-8"
                  style={{padding:"0.10rem 0.5rem"}}
                  name="teamInt"
                  value={teamInt}
                  onChange={e => { onChangeTeam(e)}}
              >
                  <option value="teama">teama</option>
                  <option value="teamb">teamb</option>
                  <option value="teamc">teamc</option>
              </select>
          </div>
        </li>
      </ul>
      </>
      }
      <ul className="navbar-nav px-2">
        <li className="nav-item text-nowrap">
          <button
            className="btn btn-primary"
            onClick={() => props.onHandleLogout()}
          >
            Sign out
          </button>
          {/*<a className="nav-link" href="#" onClick={() => props.onHandleLogout}>
            Sign out
  </a>*/}
        </li>
      </ul>
    </nav>
  );
}
