import React from "react";
import { NavLink } from "react-router-dom";
import * as Icon from "react-feather";
import { useSelector } from 'react-redux';
import './Leftnavbar.css';
import DownloadProtocol from "./../protocol/DownloadProtocol";
import LoanFAQPdf from './../../Documents/FAQ.pdf';

function MenuListItem(props) {
  const components = {
    home: Icon.Home,
    camera: Icon.Camera,
    users: Icon.Users,
    useradd: Icon.UserPlus,
    trello : Icon.Trello,
    dollarSign : Icon.DollarSign
  };
  const IconCmp = components[props.iconName || "home"];
  return (
    <li className="nav-item">
      <NavLink className={`nav-link ${props.enableVal ? "" : "disabled"} `} exact to={props.routePath}>
        <IconCmp />
        <span style={{ marginLeft: 10 }}>{props.menuName}</span>
      </NavLink>
    </li>
  );
}

// Stateless Function Component
function LeftNavBar(props) {
  
  const { LOAN_ENABLER } = useSelector(state => {
    return {
        ...state.userReducer
    }
  });

  return (
    <nav className="col-md-1 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <MenuListItem
            menuName="Dashboard"
            routePath={`${process.env.PUBLIC_URL}/dashboard`}
            iconName="home"
            enableVal={true}
          />
          <MenuListItem
            menuName="Loans"
            routePath={`${process.env.PUBLIC_URL}/loans`}
            iconName="dollarSign"
            enableVal={LOAN_ENABLER}
          />
          <DownloadProtocol protocol={LoanFAQPdf} name="FAQ" />
        </ul>
      </div>
    </nav>
  );
}
export default LeftNavBar;
