import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import "./dashboard.css";
import Loanlist from "./../loans/loanlist/Loanlist.js";
import LoanDetails from "./../loans/loandetails/LoanDetails.js";
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
  }/*,
  {
    path: "/wireslist/:batchId",
    main: WireListWrap
  }*/,
  {
    path: "/loandetails/:ALDLoanApplicationNumberOnly",
    exact: true,
    main: LoanDetailsWrap
  }
];

function DashboardContainer(props) {
  const [mainpage, setMainpage] = useState(true);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  
  const { session_token } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });
  const dispatch = useDispatch();
  
  if (redirectToLogin === true) {
    return <Redirect to={`${process.env.PUBLIC_URL}/login`} />;
  }
 
  if (session_token === null) {
    //User Not Logged In
    alert("Please login first");
    setRedirectToLogin(true);
    return null;
  }
  //alert("Dashboard Container");
  function handleLogout() {
    console.log("Handle Logout & Redirect to Login");
    dispatch({
      type:'UPDATELOANLIST',
      payload:{
        pageIndex:0,
        pageSize:10,
        sortBy : [],
        filters : [],
        loans:[]
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
