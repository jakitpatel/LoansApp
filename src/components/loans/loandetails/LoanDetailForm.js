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
  let wireDetailsObj = props.custstate;
  let wireID = wireDetailsObj.WFID;
  const { LOAN_MODIFY_CREATE, isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });
  return (
    <React.Fragment>
      <ReactTooltip delayShow={200} id='wireDetailForm' place="right" className="tooltipcls" textColor="#000000" backgroundColor="#f4f4f4" effect="float" multiline={true} />
      <div className="sm-vert-form form-row">
        {
          Object.entries(wireDetailsObj).map(([key, value]) => {
            let str = "userName row_num";
            let readOnlyVal = true;
            if(!str.includes(key)){
              if(isInternalUser){
                if(isInternalUser && (key==="ReviewerAssigned" || key==="MentorAssigned" || key==="LoanApplicationNumberOnly" || key==="StatusAComments" || key==="StatusBComments" || key==="StatusCComments" || key==="StatusDComments")){
                  readOnlyVal = false;
                }
                return (
                  <React.Fragment key={key}>
                    <CustTextInput
                      placeholdertext={key}
                      labelText={key}
                      nameref={key}
                      inputchange={props.oncustinputchange}
                      val={value}
                      wireDtObj={wireDetailsObj}
                      readOnlyValue={readOnlyVal}
                    />
                  </React.Fragment>
                )
              } else {
                let fiedls_exist = "ALDLoanApplicationNumberOnly PrimaryBorrowers R2_LoanAmount SBAStatus ErrorMessage MentorAssigned MentorEmail MentorPhone LastModifyDate SBALoanNumber statusIndication businessIndication personalIndication documentIndication finacialSeachIndication";
                let labelText = key;
                if(key==="PrimaryBorrowers" && value===null){
                  value = wireDetailsObj.businessName;
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
                        wireDtObj={wireDetailsObj}
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
