import React from "react";

function TextInput(props) {

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

  export default TextInput;