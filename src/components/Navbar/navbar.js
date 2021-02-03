import React from "react";

// Stateless Function Component
export default function NavBar(props) {
  return (
    <nav className="navbar navbar-dark fixed-top bg-light flex-md-nowrap p-0 shadow">
      <div style={{textAlign:"center", width: "100%", fontWeight: "bold", fontSize: "x-large"}}>CFSB LOAN APP</div>
      <ul className="navbar-nav px-3">
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
