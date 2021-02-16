import React from "react";
import TextareaAutosize from 'react-textarea-autosize';

function TextAreaInput(props) {

    let fieldName = props.nameref;
    let fieldClass = "form-control";
    //// Label Tooltip
    let labelTooltip = "";
    let fieldLabel = props.labelText+":";
  
    let fieldVal = props.val;
    if(fieldVal === null && fieldClass === "form-control"){
      //return null;
    }
    if(fieldVal===null){
      fieldVal = "";
    }
    return (
      <div className="col-sm-12">
        <div className="form-group row">
          <label data-for='wireDetailForm' style={{flex: "0 0 11.3%", maxWidth: "11.3%"}} data-tip={labelTooltip} className="col-sm-1 col-form-label">{fieldLabel}</label>
          <div className="col-sm-11" style={{flex: "0 0 86%", maxWidth: "86%"}}>
          <TextareaAutosize 
              className={fieldClass}
              minRows={1}
              name={fieldName}
              value={fieldVal}
              onChange={e => props.inputchange(e)}
              readOnly={props.readOnlyValue}
          />
          {/*
          <textarea 
              className={fieldClass}
              rows="2" 
              name={fieldName}
              value={fieldVal}
              onChange={e => props.inputchange(e)}
              readOnly={props.readOnlyValue}
          ></textarea>
          */}
          </div>
        </div>
      </div>
    );
  }

  export default TextAreaInput;