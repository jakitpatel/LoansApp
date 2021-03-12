import React from "react";
import "./LoanDetailForm.css";
import ReactTooltip from 'react-tooltip';
import { useSelector } from 'react-redux';
import {StatusOptions, brokerOverrideOptions, MentorAssignedOptions, 
  ReviewerAssignedOptions, TeamBAssignedOptions} from './../../../commonVar.js';
import SelectInput from './SelectInput';
import TextAreaInput from './TextAreaInput';
import TextInput from './TextInput';

function LoanDetailForm(props) {
  const { isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });
  let loanDetailsObj = props.custstate;
  let loadDtOrdObj = loanDetailsObj;
  var brokerVal = loadDtOrdObj.broker;
  if(isInternalUser){
    loadDtOrdObj = {
      "broker": loanDetailsObj.broker,
      "brokerOverride":loanDetailsObj.brokerOverride,
      "businessName": loanDetailsObj.businessName,
      "R2_TaxID": loanDetailsObj.R2_TaxID,
      "createDate": loanDetailsObj.createDate,
      "R2_LoanApplicationNumber": loanDetailsObj.R2_LoanApplicationNumber,
      "R2_LoanAmount": loanDetailsObj.R2_LoanAmount,
      "PrimaryBorrower": loanDetailsObj.PrimaryBorrower,
      "Address1": loanDetailsObj.Address1,
      "Address2": loanDetailsObj.Address2,
      "ReviewerAssigned": loanDetailsObj.ReviewerAssigned,
      "MentorAssigned": loanDetailsObj.MentorAssigned,
      "MentorEmail": loanDetailsObj.MentorEmail,
      "MentorPhone": loanDetailsObj.MentorPhone,
      "statusIndication": loanDetailsObj.statusIndication,
      "LastModifyDate": loanDetailsObj.LastModifyDate,
      "teambmember":loanDetailsObj.teambmember,
      "brokerComments":loanDetailsObj.brokerComments,
      "StatusAComments": loanDetailsObj.StatusAComments,
      "StatusBComments": loanDetailsObj.StatusBComments,
      "StatusCComments": loanDetailsObj.StatusCComments,
      "StatusDComments": loanDetailsObj.StatusDComments,
      "businessIndication": loanDetailsObj.businessIndication,
      "personalIndication": loanDetailsObj.personalIndication,
      "ownershipIndication": loanDetailsObj.ownershipIndication,
      "documentIndication": loanDetailsObj.documentIndication,
      "finacialSeachIndication": loanDetailsObj.finacialSeachIndication,
      "AdobeSigned147": loanDetailsObj.AdobeSigned147,
      "AdobeSigned147Date": loanDetailsObj.AdobeSigned147Date,
      "AdobeSigned2483": loanDetailsObj.AdobeSigned2483,
      "AdobeSigned2483Date": loanDetailsObj.AdobeSigned2483Date,
      "AdobeSigned2484":loanDetailsObj.AdobeSigned2484,
      "AdobeSigned2484Date": loanDetailsObj.AdobeSigned2484Date,
      "ApplicationAutoImported": loanDetailsObj.ApplicationAutoImported,
      "ApplicationCreatedDate": loanDetailsObj.ApplicationCreatedDate,
      "ApplicationImportedDate": loanDetailsObj.ApplicationImportedDate,
      "R2_ApplicationStatus": loanDetailsObj.R2_ApplicationStatus,
      "AuthorizedSigner1": loanDetailsObj.AuthorizedSigner1,
      "AuthorizedSignerEmail1": loanDetailsObj.AuthorizedSignerEmail1,
      "AuthorizedSigner2": loanDetailsObj.AuthorizedSigner2,
      "AuthorizedSignerEmail2": loanDetailsObj.AuthorizedSignerEmail2,
      "AuthorizedSigner3": loanDetailsObj.AuthorizedSigner3,
      "AuthorizedSignerEmail3": loanDetailsObj.AuthorizedSignerEmail3,
      "Branch": loanDetailsObj.Branch,
      "City": loanDetailsObj.City,
      "DateBusinessEstablished": loanDetailsObj.DateBusinessEstablished,
      "Email": loanDetailsObj.Email,
      "ExportStatus": loanDetailsObj.ExportStatus,
      "FirstDrawLoanAmount": loanDetailsObj.FirstDrawLoanAmount,
      "FirstDrawSbaLoanNumber": loanDetailsObj.FirstDrawSbaLoanNumber,
      "FranchiseNumber": loanDetailsObj.FranchiseNumber,
      "HasExportErrors": loanDetailsObj.HasExportErrors,
      "IndustryCode": loanDetailsObj.IndustryCode,
      "Is_TaxID_SSN": loanDetailsObj.Is_TaxID_SSN,
      "IsFranchiseCorporation": loanDetailsObj.IsFranchiseCorporation,
      "IsSecondDrawLoan": loanDetailsObj.IsSecondDrawLoan,
      "R2_LoanOfficer": loanDetailsObj.R2_LoanOfficer,
      "LoanStatus": loanDetailsObj.LoanStatus,
      "NumberOfEmployees": loanDetailsObj.NumberOfEmployees,
      "OutstandingEIDL": loanDetailsObj.OutstandingEIDL,
      "PayrollMonthlyAverageAmount": loanDetailsObj.PayrollMonthlyAverageAmount,
      "Phone": loanDetailsObj.Phone,
      "PostalCode": loanDetailsObj.PostalCode,
      "PrimaryContactFirstName": loanDetailsObj.PrimaryContactFirstName,
      "PrimaryContactLastName": loanDetailsObj.PrimaryContactLastName,
      "Revenue2020": loanDetailsObj.Revenue2020,
      "RevenueReferenceQuarter": loanDetailsObj.RevenueReferenceQuarter,
      "RevenueReduction": loanDetailsObj.RevenueReduction,
      "SBAApplicationNumber":loanDetailsObj.SBAApplicationNumber,
      "SBAApprovalDate": loanDetailsObj.SBAApprovalDate,
      "SBALoanNumber": loanDetailsObj.SBALoanNumber,
      "SBAStatus": loanDetailsObj.SBAStatus,
      "State": loanDetailsObj.State,
      "WFtaxID": loanDetailsObj.WFtaxID,
      "UseOfProceedsForSupplierCosts": loanDetailsObj.UseOfProceedsForSupplierCosts,
      "ASE_LoanApplicationNumber": loanDetailsObj.ASE_LoanApplicationNumber,
      "Borrower": loanDetailsObj.Borrower,
      "LoanAmount": loanDetailsObj.LoanAmount,
      "ASE_Status": loanDetailsObj.ASE_Status,
      "ErrorMessage": loanDetailsObj.ErrorMessage,
      "LoanApplicationNumber": loanDetailsObj.LoanApplicationNumber,
      "StartDate"   : loanDetailsObj.StartDate,
      "LastUpdated" : loanDetailsObj.LastUpdated,
      "Origin"      : loanDetailsObj.Origin,
      "ApplicationCategory": loanDetailsObj.ApplicationCategory,
      "PrimaryBorrowers": loanDetailsObj.PrimaryBorrowers,
      "TotalRequest"    : loanDetailsObj.TotalRequest,
      "PPL_Broker"      : loanDetailsObj.PPL_Broker,
      "ApplicationStatus": loanDetailsObj.ApplicationStatus,
      "ImportStatus": loanDetailsObj.ImportStatus,
      "LoanOfficer": loanDetailsObj.LoanOfficer,
      "FirstLoanName": loanDetailsObj.FirstLoanName,
      "FirstLoanStatus": loanDetailsObj.FirstLoanStatus,
      "FirstLoanAmount": loanDetailsObj.FirstLoanAmount,
      "FirstLoanTerm":loanDetailsObj.FirstLoanTerm,
      "Person":loanDetailsObj.Person,
      "Business": loanDetailsObj.Business,
      "DocumentsSent": loanDetailsObj.DocumentsSent,
      "DocumentsRequired": loanDetailsObj.DocumentsRequired,
      "Purpose":loanDetailsObj.Purpose,
      "TaxID": loanDetailsObj.TaxID,
      "ALD_ID": loanDetailsObj.ALD_ID,
      "ALDLoanApplicationNumberOnly": loanDetailsObj.ALDLoanApplicationNumberOnly,
      "userName": loanDetailsObj.userName
    };
  }
  
  return (
    <React.Fragment>
      <ReactTooltip delayShow={200} id='wireDetailForm' place="right" className="tooltipcls" textColor="#000000" backgroundColor="#f4f4f4" effect="float" multiline={true} />
      <div className="sm-vert-form form-row">
        { 
          Object.entries(loadDtOrdObj).map(([key, value]) => {
            let str = "userName row_num";
            let readOnlyVal = true;
            if(!str.includes(key)){
              if(isInternalUser){
                if(isInternalUser && (key==="ReviewerAssigned" || key==="MentorAssigned" || key==="StatusAComments" || key==="StatusBComments" || key==="StatusCComments" || key==="StatusDComments" || key==="statusIndication" || key==="businessIndication" || key==="personalIndication" || key==="ownershipIndication" || key==="documentIndication" || key==="finacialSeachIndication" || key==="teambmember")){
                  readOnlyVal = false;
                }
                if(key==="statusIndication"){
                  if(value===null){
                    value = "";
                  }
                  return (
                    <React.Fragment key={key}>
                      <SelectInput
                        placeholdertext={key}
                        labelText={key}
                        nameref={key}
                        inputchange={props.oncustinputchange}
                        val={value}
                        wireDtObj={loadDtOrdObj}
                        readOnlyValue={readOnlyVal}
                        optionList={StatusOptions}
                      />
                    </React.Fragment>
                  )
                } else if(key==="brokerOverride"){
                  if(value===null){
                    value = "";
                  }
                  if(brokerVal === null || brokerVal === ""){
                    readOnlyVal = false;
                  }
                  return (
                    <React.Fragment key={key}>
                      <SelectInput
                        placeholdertext={key}
                        labelText={key}
                        nameref={key}
                        inputchange={props.oncustinputchange}
                        val={value}
                        wireDtObj={loadDtOrdObj}
                        readOnlyValue={readOnlyVal}
                        optionList={brokerOverrideOptions}
                      />
                    </React.Fragment>
                  )
                } else if(key==="MentorAssigned" || key==="ReviewerAssigned" || key==="teambmember"){
                  if(value===null){
                    value = "";
                  }
                  let assignedOptions;
                  if(key==="MentorAssigned"){
                    assignedOptions = MentorAssignedOptions;
                  } else if(key==="ReviewerAssigned") {
                    assignedOptions = ReviewerAssignedOptions;
                  } else if(key==="teambmember") {
                    assignedOptions = TeamBAssignedOptions;
                  }
                  return (
                    <React.Fragment key={key}>
                      <SelectInput
                        placeholdertext={key}
                        labelText={key}
                        nameref={key}
                        inputchange={props.oncustinputchange}
                        val={value}
                        wireDtObj={loadDtOrdObj}
                        readOnlyValue={readOnlyVal}
                        optionList={assignedOptions}
                      />
                    </React.Fragment>
                  )
                } else if (key==="StatusAComments" || key==="StatusBComments" || key==="StatusCComments" || key==="StatusDComments" || key==="ErrorMessage" || key==="businessIndication" || key==="personalIndication" || key==="ownershipIndication" || key==="documentIndication" || key==="finacialSeachIndication" || key==="brokerComments"){
                  return (
                    <React.Fragment key={key}>
                      <TextAreaInput
                        placeholdertext={key}
                        labelText={key}
                        nameref={key}
                        inputchange={props.oncustinputchange}
                        val={value}
                        wireDtObj={loadDtOrdObj}
                        readOnlyValue={readOnlyVal}
                      />
                    </React.Fragment>
                  )
                } else {
                  return (
                    <React.Fragment key={key}>
                      <TextInput
                        placeholdertext={key}
                        labelText={key}
                        nameref={key}
                        inputchange={props.oncustinputchange}
                        val={value}
                        wireDtObj={loadDtOrdObj}
                        readOnlyValue={readOnlyVal}
                      />
                    </React.Fragment>
                  )
                }
              } else {
                //let fiedls_exist = "ALDLoanApplicationNumberOnly PrimaryBorrowers R2_LoanAmount SBAStatus ErrorMessage MentorAssigned MentorEmail MentorPhone LastModifyDate SBALoanNumber statusIndication businessIndication personalIndication documentIndication finacialSeachIndication";
                let fiedls_exist = "ApplicationCreatedDate businessName ALDLoanApplicationNumberOnly MentorAssigned MentorPhone MentorEmail LastModifyDate AdobeSigned2483Date LoanStatus FirstDrawLoanAmount FirstDrawSbaLoanNumber IsSecondDrawLoan SBALoanNumber SBAApprovalDate SBAStatus ErrorMessage statusIndication businessIndication personalIndication ownershipIndication documentIndication financialSearchIndication PrimaryContactFirstName PrimaryContactLastName Phone Email StatusAComments StatusBComments StatusCComments brokerRep brokerComments";
                let labelText = key;
                if(key==="PrimaryBorrowers" && value===null){
                  value = loadDtOrdObj.businessName;
                } else if((key==="R2_LoanAmount" || key==="FirstDrawLoanAmount") && value!==null){
                    value = new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(value);
                }
                
                let fieldArr = fiedls_exist.split(" ");
                let found = false;
                for(var j=0; j<fieldArr.length;j++){
                  if(fieldArr[j] === key){
                    found = true;
                  }
                }
                if ((key==="brokerRep" || key==="brokerComments") && (brokerVal!== null && brokerVal!== "")){
                  readOnlyVal = false;
                }
                if(found === true){
                  if (key==="StatusAComments" || key==="StatusBComments" || key==="StatusCComments" || key==="StatusDComments" || key==="ErrorMessage" || key==="businessIndication" || key==="personalIndication" || key==="ownershipIndication" || key==="documentIndication" || key==="finacialSeachIndication"){
                    return (
                      <React.Fragment key={key}>
                        <TextAreaInput
                          placeholdertext={key}
                          labelText={labelText}
                          nameref={key}
                          inputchange={props.oncustinputchange}
                          val={value}
                          wireDtObj={loadDtOrdObj}
                          readOnlyValue={readOnlyVal}
                        />
                      </React.Fragment>
                    )
                  }/* else if(key==="statusIndication"){
                    if(value===null){
                      value = "";
                    }
                    return (
                      <React.Fragment key={key}>
                        <SelectInput
                          placeholdertext={key}
                          labelText={key}
                          nameref={key}
                          inputchange={props.oncustinputchange}
                          val={value}
                          wireDtObj={loadDtOrdObj}
                          readOnlyValue={readOnlyVal}
                          optionList={StatusOptions}
                        />
                      </React.Fragment>
                    )
                  } */else {
                    return (
                      <React.Fragment key={key}>
                        <TextInput
                          placeholdertext={key}
                          labelText={labelText}
                          nameref={key}
                          inputchange={props.oncustinputchange}
                          val={value}
                          wireDtObj={loadDtOrdObj}
                          readOnlyValue={readOnlyVal}
                        />
                      </React.Fragment>
                    )
                  }
                } else {
                  return null;
                }
              }
            } else {
              return null;
            }
          })
        }
        </div>
    </React.Fragment>
  );
}

export default LoanDetailForm;
