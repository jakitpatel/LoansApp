import React from "react";
import "./LoanDetailForm.css";
import ReactTooltip from 'react-tooltip';
import { useSelector } from 'react-redux';

function CustTextInput(props) {

  let fieldName = props.nameref;
  let fieldClass = "form-control";
  let errorMsg = null;
  //let errorMsg = props.wireDtObj.derivedErrorMsg;
  //console.log("errorMsg : "+errorMsg);
  if(errorMsg !== null){
    let n = errorMsg.includes(fieldName);
    if(n === true){
      fieldClass = fieldClass+" is-invalid";
    }
  }
  let tooltip = "";
  if(errorMsg !== null){
    let errArr = errorMsg.split(";");
    for(let i=0; i<errArr.length; i++){
      let errLine = errArr[i];
      let n = errLine.includes(fieldName);
      if(n === true){
        tooltip = tooltip+errLine;
      }
    }
  }
  //// Label Tooltip
  let labelTooltip = "";
  let fieldLabel = props.labelText+":";

  let fieldVal = props.val;
  if(fieldVal === null && fieldClass === "form-control" && tooltip === ""){
    //return null;
  }
  if(fieldVal===null){
    fieldVal = "";
  }
  return (
    <div className="col-sm-4">
      <div className="form-group row">
        <label data-for='wireDetailForm' data-tip={labelTooltip} className="col-sm-4 col-form-label">{fieldLabel}</label>
        <div className="col-sm-7">
          <input
            type="text"
            data-tip={tooltip}
            data-for='wireDetailForm'
            name={fieldName}
            className={fieldClass}
            //placeholder={props.placeholdertext}
            value={fieldVal}
            onChange={e => props.inputchange(e)}
            readOnly={props.readOnlyValue}
          />
        </div>
      </div>
    </div>
  );
}

function LoanDetailForm(props) {
  const { isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });
  let loanDetailsObj = props.custstate;
  let loadDtOrdObj = loanDetailsObj;
  if(isInternalUser){
    loadDtOrdObj = {
      "broker": loanDetailsObj.broker,
      "businessName": loanDetailsObj.businessName,
      "WFtaxID": loanDetailsObj.WFtaxID,
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
      "StatusAComments": loanDetailsObj.StatusAComments,
      "StatusBComments": loanDetailsObj.StatusBComments,
      "StatusCComments": loanDetailsObj.StatusCComments,
      "StatusDComments": loanDetailsObj.StatusDComments,
      "statusIndication": loanDetailsObj.statusIndication,
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
      "R2_TaxID": loanDetailsObj.R2_TaxID,
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
      "LastModifyDate": loanDetailsObj.LastModifyDate,
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
                if(isInternalUser && (key==="ReviewerAssigned" || key==="MentorAssigned" || key==="LoanApplicationNumberOnly" || key==="StatusAComments" || key==="StatusBComments" || key==="StatusCComments" || key==="StatusDComments" || key==="statusIndication" || key==="businessIndication" || key==="personalIndication" || key==="ownershipIndication" || key==="documentIndication" || key==="finacialSeachIndication" || key==="MentorEmail" || key==="MentorPhone")){
                  readOnlyVal = false;
                }
                if(key==="statusIndication"){
                  return (
                    <React.Fragment key={key}>
                      <div className="col-sm-4">
                        <div className="form-group row">
                          <label className="col-sm-4 col-form-label">{key}:</label>
                          <div className="col-sm-7">
                            <select
                              className="form-control custom-select"
                              name={key}
                              value={value}
                              onChange={e => props.oncustinputchange(e)}
                            >
                              <option value="Untouched">Untouched</option>                
                              <option value="All OK">All OK</option>
                              <option value="Issue Identified">Issue Identified</option>
                              <option value="Issue Resolved">Issue Resolved</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  )
                } else {
                  return (
                    <React.Fragment key={key}>
                      <CustTextInput
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
                let fiedls_exist = "ALDLoanApplicationNumberOnly PrimaryBorrowers R2_LoanAmount SBAStatus ErrorMessage MentorAssigned MentorEmail MentorPhone LastModifyDate SBALoanNumber statusIndication businessIndication personalIndication documentIndication finacialSeachIndication";
                let labelText = key;
                if(key==="PrimaryBorrowers" && value===null){
                  value = loadDtOrdObj.businessName;
                } else if(key==="ALDLoanApplicationNumberOnly"){
                  labelText = "Application #";
                } else if(key==="R2_LoanAmount" && value!==null){
                    value = new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(value);
                }
                
                let fieldArr = fiedls_exist.split(" ");
                let found = false;
                for(var j=0; j<fieldArr.length;j++){
                  if(fieldArr[j] === key){
                    found = true;
                  }
                }
                if(found === true){
                  return (
                    <React.Fragment key={key}>
                      <CustTextInput
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
