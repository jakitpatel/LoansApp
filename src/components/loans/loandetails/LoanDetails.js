import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import LoanDetailForm from "./LoanDetailForm";
import axios from 'axios';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
//import {API_KEY, SetLoans_Url} from './../../../const';
const {API_KEY, SetLoans_Url} = window.constVar;

function LoanDetails(props) {
  let history = useHistory();
  
  const [modWireDtObj, setModWireDtObj] = useState({});
  const dispatch = useDispatch();

  const { session_token, isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  const { loanDetailsObj } = useSelector(state => {
    return {
        ...state.loanDetailsReducer
    }
  });

  let { ALDLoanApplicationNumberOnly } = useParams();
  let loanRec = props.loanRec;
  console.log(loanRec);
  useEffect(() => {
    console.log("ALDLoanApplicationNumberOnly : "+ALDLoanApplicationNumberOnly);
    let ignore = false;
    dispatch({
      type:'SETLOANDETAILS',
      payload:loanRec
    });
    return () => { ignore = true };
  }, []);

  function handleChange(e) {
    console.log("On Handle Change : "+ e.target.name);
    
    let targetVal = "";
    if(e.target.type === "checkbox"){
      targetVal = e.target.checked;
    } else {
      targetVal = e.target.value;
    }
    dispatch({
      type:'UPDATELOANDETAILSFORM',
      payload:{ ...loanDetailsObj, [e.target.name]: targetVal }
    });
    //setModWireDtObj({ ...modWireDtObj, [e.target.name]: targetVal });
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

  const backToLoanList = () => {
    console.log("Back To Wire List Button Click");
    dispatch({
      type:'UPDATELOANLIST',
      payload:{
        backToList:true
      }
    });
    history.goBack();
  }

  const saveLoanDetails = async (e) => {
    console.log("Save Loan Details");
    console.log(e);
    console.log(e.target.innerHTML);
    console.log(loanDetailsObj);
    try {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': session_token
        }
      };
      let tmpLoanObj = {};
      if(isInternalUser){
        let statusVal = loanDetailsObj.statusIndication;
        if(statusVal===""){
          statusVal = null;
        }
        tmpLoanObj = {
          //ALDLoanApplicationNumberOnly : loanDetailsObj.ALDLoanApplicationNumberOnly,
          ReviewerAssigned : loanDetailsObj.ReviewerAssigned,
          MentorAssigned   : loanDetailsObj.MentorAssigned,
          //LastModifyDate   : loanDetailsObj.LastModifyDate,
          StatusAComments  : loanDetailsObj.StatusAComments,
          StatusBComments  : loanDetailsObj.StatusBComments,
          StatusCComments  : loanDetailsObj.StatusCComments,
          StatusDComments  : loanDetailsObj.StatusDComments,
          MentorEmail      : loanDetailsObj.MentorEmail,
          MentorPhone      : loanDetailsObj.MentorPhone,
          statusIndication : statusVal,
          businessIndication  : loanDetailsObj.businessIndication,
          personalIndication  : loanDetailsObj.personalIndication,
          ownershipIndication : loanDetailsObj.ownershipIndication,
          documentIndication  : loanDetailsObj.documentIndication,
          finacialSeachIndication  : loanDetailsObj.finacialSeachIndication,
          brokerOverride : loanDetailsObj.brokerOverride,
          teambmember    : loanDetailsObj.teambmember
        };
      } else {
        /*
        if(loanDetailsObj.statusIndication!=="Resolved"){
          alert("Please select Issue Resolved option to save.");
          return;
        }*/
        if(e.target.innerHTML === "Save"){
          tmpLoanObj = {
            brokerRep : loanDetailsObj.brokerRep,
            brokerComments : loanDetailsObj.brokerComments
          };
        } else {
          tmpLoanObj = {
            statusIndication : "Resolved",
          };
        }
      }
      if(loanDetailsObj.ALD_ID === "" || loanDetailsObj.ALD_ID === null){
        alert("ALD_ID is empty! So, can not able to save the loan.");
        return false;
      }
      let ald_id = loanDetailsObj.ALD_ID;
      //tmpLoanObj.LastUpdateUser = uid;
      tmpLoanObj.LastModifyDate = moment().format('YYYY-MM-DD');
      let res = await axios.put(SetLoans_Url+'/'+ald_id, tmpLoanObj, options);
      console.log(res);
      alert("Data saved successfully!");
      backToLoanList();
      //setToCustomer(true);
    } catch (error) {
      console.log(error.response);
      if (401 === error.response.status) {
          // handle error: inform user, go to login, etc
          let res = error.response.data;
          alert(res.error.message);
      } else {
        alert(error);
      }
      //backToLoanList();
    }
  }
  let showResolvedIssueBtn = true;
  if(loanDetailsObj.statusIndication==="Resolved" || loanDetailsObj.statusIndication==="" || loanDetailsObj.statusIndication===null){
    showResolvedIssueBtn = false;
  }
  if(isInternalUser){
    showResolvedIssueBtn = false;
  }

  return (
    <React.Fragment>
      <div className="container" style={{marginLeft:"0px", maxWidth: "100%"}}>
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <h3 className="text-center">{getTitle()} - Loan {ALDLoanApplicationNumberOnly}</h3>
            <div className="btnCls">
              <button style={{ float: "left" }} type="button" onClick={backToLoanList} className="btn btn-primary btn-sm">
                Back
              </button>
              {/*isInternalUser &&*/}
              <button type="button" style={{ float: "right" }} onClick={saveLoanDetails} className={`btn btn-primary btn-sm`}>
                  Save
                </button>
              {/*}*/}
              {showResolvedIssueBtn &&
              <button type="button" style={{ float: "right", marginRight:"10px" }} onClick={saveLoanDetails} className={`btn btn-primary btn-sm`}>
                  Resolve Issue
                </button>
              }
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
