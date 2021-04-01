import React from 'react';
import Modal from "react-bootstrap/Modal";
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
const {API_KEY, SetLoans_Url} = window.constVar;

function LoanFileUpload (props) {
    const {isOpenRet, docRetData, hideRetModal, selLoanObj, isRefresh, setIsRefresh} = props;

    const { session_token, isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
    });

    const saveLoanDetails = async (e) => {
      console.log("Save Loan Details");
      //console.log(e);
      //console.log(e.target.innerHTML);
      //console.log(selLoanObj);
      try {
        const options = {
          headers: {
            'X-DreamFactory-API-Key': API_KEY,
            'X-DreamFactory-Session-Token': session_token
          }
        };
        let tmpLoanObj = {};
        if(isInternalUser){
          let statusVal = selLoanObj.statusIndication;
          if(statusVal===""){
            statusVal = null;
          }
          console.log("StatusCComments : "+selLoanObj.StatusCComments);
          if(selLoanObj.StatusCComments !== "" && selLoanObj.StatusCComments !== null){
            let resSt = selLoanObj.StatusCComments.toLowerCase();
            if(resSt === "funded"){
              statusVal = "Funded";
            }
          }
          console.log("statusVal : "+statusVal);
          let brokerOverrideVal = selLoanObj.brokerOverride;
          if(brokerOverrideVal===""){
            brokerOverrideVal = null;
          }
          tmpLoanObj = {
            //ALDLoanApplicationNumberOnly : selLoanObj.ALDLoanApplicationNumberOnly,
            ReviewerAssigned : selLoanObj.ReviewerAssigned,
            MentorAssigned   : selLoanObj.MentorAssigned,
            //LastModifyDate   : selLoanObj.LastModifyDate,
            StatusAComments  : selLoanObj.StatusAComments,
            StatusBComments  : selLoanObj.StatusBComments,
            StatusCComments  : selLoanObj.StatusCComments,
            StatusDComments  : selLoanObj.StatusDComments,
            MentorEmail      : selLoanObj.MentorEmail,
            MentorPhone      : selLoanObj.MentorPhone,
            statusIndication : statusVal,
            businessIndication  : selLoanObj.businessIndication,
            personalIndication  : selLoanObj.personalIndication,
            ownershipIndication : selLoanObj.ownershipIndication,
            documentIndication  : selLoanObj.documentIndication,
            finacialSeachIndication  : selLoanObj.finacialSeachIndication,
            brokerOverride : brokerOverrideVal,
            teambmember    : selLoanObj.teambmember
          };
        } else {
          if(e.target.innerHTML === "Save"){
            tmpLoanObj = {
              brokerRep : selLoanObj.brokerRep,
              brokerComments : selLoanObj.brokerComments
            };
          } else if(e.target.innerHTML === "Cancelled"){
            tmpLoanObj = {
              statusIndication : "Cancelled",
            };
          } else {
            tmpLoanObj = {
              statusIndication : "Resolved",
            };
          }
        }
        if(selLoanObj.ALD_ID === "" || selLoanObj.ALD_ID === null){
          alert("ALD_ID is empty! So, can not able to save the loan.");
          return false;
        }
        let ald_id = selLoanObj.ALD_ID;
        //tmpLoanObj.LastUpdateUser = uid;
        tmpLoanObj.LastModifyDate = moment().format('YYYY-MM-DD');
        let res = await axios.put(SetLoans_Url+'/'+ald_id, tmpLoanObj, options);
        console.log(res);
        setIsRefresh(!isRefresh);
        alert("Data saved successfully!");
        hideRetModal();
        //backToLoanList();
      } catch (error) {
        console.log(error.response);
        //setIsRefresh(!isRefresh);
        //hideRetModal();
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
    if(selLoanObj.statusIndication==="Resolved" || selLoanObj.statusIndication==="" || selLoanObj.statusIndication===null){
      showResolvedIssueBtn = false;
    }
    return (
      <>
        <Modal size="lg" show={isOpenRet} onHide={hideRetModal}>
        <Modal.Header>
          <Modal.Title>Uploaded Document Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table width="100%">
            <thead> 
              <tr>
                <th>ID</th>
                <th>Document ID</th>
                <th>Object Id</th>
                <th>Object Type</th>
              </tr>
            </thead>
            <tbody> 
            {docRetData.length > 0 && docRetData.map((data) => {
              //if(data!==null){
                return (
                  <tr key={data.id}> 
                    <td>{data.id}</td>
                    <td>{data.documentId}</td>
                    <td>{data.objectId}</td>
                    <td>{data.objectType}</td>
                  </tr>
                )
              /*} else {
                return null;
              }*/
            }
            )}
            </tbody> 
          </table>
        </Modal.Body>
        <Modal.Footer>
          {showResolvedIssueBtn &&
            <button type="button" style={{ float: "right", marginRight:"10px" }} onClick={saveLoanDetails} className={`btn btn-primary btn-sm`}>
              Resolve Issue
            </button>
          }
          <button style={{ width:"70px" }} className="btn btn-primary btn-sm" onClick={hideRetModal}>Ok</button>
        </Modal.Footer>
      </Modal>
    </>
    );
}

export default LoanFileUpload;