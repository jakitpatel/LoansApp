import React from "react";
import "./WireDetailForm.css";
import ReactTooltip from 'react-tooltip';
import { useSelector } from 'react-redux';

function CustTextInput(props) {

  const { wiredict, wireDetailsObj } = useSelector(state => {
    return {
        ...state.wireDictReducer,
        ...state.wireDetailsReducer
    }
  });

  let fieldName = props.nameref;
  let fieldClass = "form-control";
  let errorMsg = null;
  if(wireDetailsObj){
    errorMsg = wireDetailsObj.errorMsg;
  }
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
  let fieldLabel = props.labelText;
  for(var i = 0; i < wiredict.length; i++) {
    var obj = wiredict[i];
    let elementArr = obj.elements;
    for(var j = 0; j < elementArr.length; j++) {
      var objElement = elementArr[j];
      let fieldName = objElement.name;
      if(fieldName===fieldLabel){
        labelTooltip += "Protocol Tag = "+obj.tag;
      }
    }
  }

  let fieldVal = props.val;
  if(fieldVal === null && fieldClass === "form-control" && tooltip === ""){
    return null;
  }
  if(fieldVal===null){
    fieldVal = "";
  }
  return (
    <div key={props.nameref} className="col-sm-4">
      <div className="form-group row">
        <label data-tip={labelTooltip} className="col-sm-5 col-form-label">{props.labelText}</label>
        <div className="col-sm-7">
          <input
            type="text"
            data-tip={tooltip}
            name={fieldName}
            className={fieldClass}
            //placeholder={props.placeholdertext}
            value={fieldVal}
            onChange={e => props.inputchange(e)}
            readOnly={props.readOnlyVal}
          />
        </div>
      </div>
    </div>
  );
}

function WireRemittanceDetailForm(props) {
  let wireRemittanceObj = props.wireRemittance;
  if(wireRemittanceObj){
    //let wireID = wireRemittanceObj.wireID;
    return (
      <React.Fragment>
        <ReactTooltip />
        <div className="sm-vert-form form-row">
          {
            Object.entries(wireRemittanceObj).map(([key, value]) => {
              let str = "wireID wireBatchID wireDoc_by_wireID wireRemittanceDoc_by_wireRemittanceID wireRemittance_by_wireID";
              if(!str.includes(key)){
                  return (
                    <React.Fragment key={key}>
                      <CustTextInput
                        placeholdertext={key}
                        labelText={key}
                        nameref={key}
                        inputchange={props.oncustinputchange}
                        val={value}
                        wireDtObj={wireRemittanceObj}
                      />
                    </React.Fragment>
                  )
              } else {
                return null;
              }
            })
          }
          </div>
      </React.Fragment>
    );
  } else return null;
}

export default WireRemittanceDetailForm;
