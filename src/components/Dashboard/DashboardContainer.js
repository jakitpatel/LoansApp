import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import "./dashboard.css";
import Loanlist from "./../loans/loanlist/Loanlist.js";
import LoanDetails from "./../loans/loandetails/LoanDetails.js";
import MissingLoanlist from "./../loans/missingloanlist/MissingLoanlist.js";
import NavBar from "./../Navbar/navbar";
import LeftNavBar from "./../Leftnavbar/leftnavbar";
import DashboardMain from "./DashboardMain";


const LoanListWrap = props => {
  //console.log(props);
  return <Loanlist loanRec={props.location.state} />;
};

const LoanDetailsWrap = props => {
  //console.log(props);
  return <LoanDetails loanRec={props.location.state} />;
};

const MissingLoanListWrap = props => {
  //console.log(props);
  return <MissingLoanlist loanRec={props.location.state} />;
};

const routes = [
  {
    path: "/dashboard",
    exact: true,
    main: () => <DashboardMain />
  },
  {
    path: "/loans",
    exact: true,
    main: LoanListWrap
  },
  {
    path: "/missingloans",
    exact: true,
    main: MissingLoanListWrap
  },
  {
    path: "/loandetails/:ALDLoanApplicationNumberOnly",
    exact: true,
    main: LoanDetailsWrap
  }
];

function DashboardContainer(props) {
  const [mainpage, setMainpage] = useState(true);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  
  const { session_token,teamInt, isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });
  const dispatch = useDispatch();
  
  if (redirectToLogin === true) {
    return <Redirect to={`${process.env.PUBLIC_URL}/login`} />;
  }
  console.log("Session token : "+session_token);

  if (session_token === null) {
    //User Not Logged In
    console.log("Session token Not Exist So please redirect to login.");
    alert("Please login first");
    setRedirectToLogin(true);
    return null;
  } else {
    console.log("Session token Exist : "+session_token);
  }
  //alert("Dashboard Container");
  function handleLogout() {
    console.log("Handle Logout & Redirect to Login");
    let filterName = "filters";
    if(isInternalUser){
      if(teamInt==="teama"){
        filterName = "filtersA";
      } else if(teamInt==="teamb"){
        filterName = "filtersB";
      } else if(teamInt==="teamc"){
        filterName = "filtersC";
      }
    }
    dispatch({
      type:'UPDATELOANLIST',
      payload:{
        pageIndex:0,
        pageSize:10,
        sortBy : [],
        //filters : [],
        [filterName] : [],
        loans:[]
      }
    });
    dispatch({
      type:'UPDATELOANLIST',
      payload:{
        session_token:null,
        session_id:null, 
        id:null,
        uid:null,
        name:null,
        teamInt: null,
        first_name:null, 
        last_name:null,
        email:null,
        is_sys_admin:null,
        isInternalUser:null,
        host:null,
        CUSTOMER_ENABLER: false,
        CUSTOMER_MODIFY_CREATE : false,
        LOAN_ENABLER           : false,
        LOAN_MODIFY_CREATE     : false,
        WIRE_EXPORT            : false,
        DEPOSITS_ENABLER       : false
      }
    });
    setRedirectToLogin(true);
  }
  return (
    <React.Fragment>
      <Router >
        {mainpage === true ? (
          <React.Fragment>
            <NavBar onHandleLogout={handleLogout} />
            <main className="container-fluid">
              <div className="row">
                <LeftNavBar />
                <main role="main" className="col-md-9 ml-sm-auto col-lg-11">
                  <div className="App">
                    {routes.map((route, index) => (
                      // Render more <Route>s with the same paths as
                      // above, but different components this time.
                      <Route
                        key={index}
                        path={`${process.env.PUBLIC_URL}${route.path}`}
                        exact={route.exact}
                        component={route.main}
                      />
                    ))}
                    {/*<Dashboard />*/}
                  </div>
                </main>
              </div>
            </main>
          </React.Fragment>
        ) : (
          ""
        )}
      </Router>
    </React.Fragment>
  );
}

export default DashboardContainer;
