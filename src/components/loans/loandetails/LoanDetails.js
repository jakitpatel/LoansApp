import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import LoanDetailForm from "./LoanDetailForm";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {API_KEY, WireDictionary_Url, Wire_tbl_Url, WireDetails_Url, env} from './../../../const';

function LoanDetails(props) {
  let history = useHistory();

  const [loading, setLoading] = useState(true);
  const [wireText, setWireText] = useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [modWireDtObj, setModWireDtObj] = useState({});
  const dispatch = useDispatch();

  const { session_token } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  const { loanDetailsObj } = useSelector(state => {
    return {
        ...state.loanDetailsReducer
    }
  });

  let { WFID } = useParams();
  let loanRec = props.loanRec;
  console.log(loanRec);
  useEffect(() => {
    console.log("WFID : "+WFID);
    let ignore = false;
    dispatch({
      type:'SETLOANDETAILS',
      payload:loanRec
    });
    return () => { ignore = true };
  }, []);

  function handleChange(e) {
    console.log("On Handle Change : "+ e.target.name);
    /*
    let targetVal = "";
    if(e.target.type === "checkbox"){
      targetVal = e.target.checked;
    } else {
      targetVal = e.target.value;
    }
    dispatch({
      type:'UPDATEWIREDETAILSFORM',
      payload:{ ...wireDetailsObj, [e.target.name]: targetVal }
    });
    setModWireDtObj({ ...modWireDtObj, [e.target.name]: targetVal });
    */
  }

  function getTitle() {
    //console.log("Get Title : " + props.disType);
    switch ("view") {
      case "add":
        return "Add New Customer";
      case "edit":
        return "Edit Customer";
      default:
        return "Loan Details";
    }
  }

  const backToWireList = () => {
    console.log("Back To Wire List Button Click");
    dispatch({
      type:'UPDATEWIRELIST',
      payload:{
        backToList:true
      }
    });
    history.goBack();
  }
  return (
    <React.Fragment>
      <div className="container" style={{marginLeft:"0px", maxWidth: "100%"}}>
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <h3 className="text-center">{getTitle()} - Loan {WFID}</h3>
            <div className="btnCls">
              <button style={{ float: "left" }} type="button" onClick={backToWireList} className="btn btn-primary btn-sm">
                Back
              </button>
              <div style={{ clear:"both"}}></div>
            </div>
            <div className="col-sm-12">
              <LoanDetailForm formMode={props.disType} custstate={loanDetailsObj} oncustinputchange={handleChange} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default LoanDetails;