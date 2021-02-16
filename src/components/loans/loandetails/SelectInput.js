import React from "react";

function SelectInput(props) {

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
    let options = props.optionList;
    return (
      <div className="col-sm-4">
        <div className="form-group row">
          <label data-for='wireDetailForm' data-tip={labelTooltip} className="col-sm-4 col-form-label">{fieldLabel}</label>
          <div className="col-sm-7">
            <select
              className="form-control custom-select"
              readOnly={props.readOnlyVal}
              name={fieldName}
              value={fieldVal}
              onChange={e => props.inputchange(e)}
            >
              <option value=""></option>
              {options.map((option, i) => {
                if(option.label!=="All"){
                  return (
                    <option key={i} value={option.value}>
                      {option.label}
                    </option>
                  )
                }
              })}           
            </select>
          </div>
        </div>
      </div>
    );
  }

  export default SelectInput;