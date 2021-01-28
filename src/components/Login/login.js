import React, { useState } from "react";
import { Redirect } from "react-router-dom";
//import * as Icon from "react-feather";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {Login_Url, API_KEY, Usr_Permission_Url, env} from './../../const';

import "./login.css";
function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  const dispatch = useDispatch();

  async function handleLogin(e) {
    e.preventDefault();
    let res;
    try {
      const userCred = {
        username: email,
        password: password
      };

      res = await axios.post(Login_Url, userCred);
      console.log(res.data);
      console.log(res.data.name);
      console.log(res.data.session_token);
    } catch (error) {
      console.log(error.response);
      if(error.response){
        if (401 === error.response.status) {
            // handle error: inform user, go to login, etc
            let res = error.response.data;
            alert(res.error.message);
        } else {
          alert(error);
        }
      }
    }
    
    // Get the Permission based on UID
    let cust_enabler_val = false;
    let cust_modify_create_val = false;
    let loan_enabler_val       = true;
    let wire_modify_create_val = false;
    let wire_export_val = false;
    /*
    try {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': res.data.session_token
        }
      };
      console.log(options);
      console.log(Usr_Permission_Url);
      let url = Usr_Permission_Url + "uid='"+email+"'";
      if(env==="DEV"){
        url = Usr_Permission_Url;
      }
      let resPerm = await axios.get(url, options);
      let usrPermArray = resPerm.data.resource;
      console.log(usrPermArray);
      if(usrPermArray.length > 0) {
        if(usrPermArray[0].CUST_ENABLE_PERMISSION){
          cust_enabler_val = usrPermArray[0].CUST_ENABLE_PERMISSION;
        }
        if(usrPermArray[0].CUST_WRITE_PERMISSION){
          cust_modify_create_val = usrPermArray[0].CUST_WRITE_PERMISSION;
        }
        if(usrPermArray[0].WIRE_ENABLE_PERMISSION){
          wire_enabler_val = usrPermArray[0].WIRE_ENABLE_PERMISSION;
        }
        if(usrPermArray[0].WIRE_WRITE_PERMISSION){
          wire_modify_create_val = usrPermArray[0].WIRE_WRITE_PERMISSION;
        }
        if(usrPermArray[0].WIRE_EXPORT_PERMISSION){
          wire_export_val = usrPermArray[0].WIRE_EXPORT_PERMISSION;
        }
        if(usrPermArray[0].ACH_ENABLE_PERMISSION){
          ach_enabler_val = usrPermArray[0].ACH_ENABLE_PERMISSION;
        }
        if(usrPermArray[0].DEPOSIT_ENABLE_PERMISSION){
          deposits_enabler_val = usrPermArray[0].DEPOSIT_ENABLE_PERMISSION;
        }
      }
    } catch (error) {
      console.log(error.response);
      if(error.response){
        if (401 === error.response.status) {
            // handle error: inform user, go to login, etc
            let res = error.response.data;
            console.log(res.error.message);
        } else {
          console.log(error);
        }
      }
    }
    */
    console.log("cust_modify_create_val" +cust_modify_create_val);
    console.log("cust_enabler_val" +cust_enabler_val);
    console.log("loan_enabler_val" +loan_enabler_val);
    console.log("wire_modify_create_val" +wire_modify_create_val);
    console.log("wire_export_val" +wire_export_val);
    
    dispatch({
      type:'UPDATEUSER',
      payload:{
        session_token : res.data.session_token,
        session_id : res.data.session_id,  
        id  : res.data.id,
        uid : email, 
        name: res.data.name,
        first_name : res.data.first_name,
        last_name  : res.data.last_name,
        email : res.data.email,
        is_sys_admin : res.data.is_sys_admin,
        host : res.data.host,
        CUSTOMER_ENABLER       : cust_enabler_val, 
        CUSTOMER_MODIFY_CREATE : cust_modify_create_val,
        LOAN_ENABLER           : loan_enabler_val,
        WIRE_MODIFY_CREATE     : wire_modify_create_val,
        WIRE_EXPORT            : wire_export_val
      }
    });
    setRedirectToDashboard(true);

  }

  if (redirectToDashboard === true) {
    console.log("Redirect to Dashboard");
    return <Redirect to={`${process.env.PUBLIC_URL}/dashboard`} />;
  }
  return (
    <React.Fragment>
      <div className="form-container">
        <div className="form-signin">
          <h1 className="h3 mb-3 font-weight-normal text-center">Sign In</h1>
          {error ? <div>{error.message}</div> : null}
          <div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="text"
                  name="email"
                  autoFocus
                  placeholder="Email"
                  value={email}
                  className="form-control"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  className="form-control"
                  onChange={e => setPassword(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      handleLogin(e);
                    }
                  }}
                />
              </div>

              <div className="form-group">
                <button
                  type="button"
                  style={{ width: "100%" }}
                  onClick={handleLogin}
                  className="btn btn-primary"
                >
                  Sign In
                </button>
              </div>
              {/*}
              <div className="form-group">
                <NavLink exact to="/Signup">
                  <button style={{ width: "100%" }} className="btn btn-primary">
                    Sign Up
                  </button>
                </NavLink>
              </div>
              */}
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default Login;
