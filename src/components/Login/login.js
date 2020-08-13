import React, { useState } from "react";
import firebase from "./../Firebase/firebase";
import { NavLink, Redirect } from "react-router-dom";
//import * as Icon from "react-feather";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {API_URL} from './../../const';

import "./login.css";
function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  const dispatch = useDispatch();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const userCred = {
        username: email,
        password: password
      };
  
      
      //let loginUrl = API_URL+"session.json";
      //let res = await axios.get(loginUrl, userCred);
      let loginUrl = API_URL+"user/session?service=demo";
      let res = await axios.post(loginUrl, userCred);
      console.log(res.data);
      console.log(res.data.name);
      console.log(res.data.session_token);
      //await firebase.login(email, password);
      dispatch({
        type:'UPDATEUSER',
        payload:{
          session_token : res.data.session_token,
          session_id : res.data.session_id,  
          id  : res.data.id, 
          name: res.data.name,
          first_name : res.data.first_name,
          last_name  : res.data.last_name,
          email : res.data.email,
          is_sys_admin : res.data.is_sys_admin,
          host : res.data.host
        }
      });
      setRedirectToDashboard(true);
    } catch (error) {
      alert(error);
    }
  }

  if (redirectToDashboard === true) {
    console.log("Redirect to Dashboard");
    return <Redirect to="/dashboard" />;
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