import React from "react";
import "./ACHDetailForm.css";
import ReactTooltip from 'react-tooltip';

function CustTextInput(props) {
  let fieldName = props.nameref;
  let fieldClass = "form-control";
  let errorMsg = props.wireDtObj.errorMsg;
  //let errorMsg = props.wireDtObj.derivedErrorMsg;
  console.log("errorMsg : "+errorMsg);
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
  return (
    <div className="form-group row">
      <label className="col-sm-6 col-form-label">{props.labelText}</label>
      <div className="col-sm-6">
        <input
          type="text"
          data-tip={tooltip}
          name={fieldName}
          className={fieldClass}
          //placeholder={props.placeholdertext}
          value={props.val}
          onChange={e => props.inputchange(e)}
          readOnly={props.readOnlyVal}
        />
      </div>
    </div>
  );
}

function ACHDetailForm(props) {
  let wireDetailsObj = props.custstate;
  return (
    <React.Fragment>
      <ReactTooltip />
      <div className="sm-vert-form form-row">
        {
          Object.entries(wireDetailsObj).map(([key, value]) => {
            let str = "wireID wireBatchID wireDoc_by_wireID derivedErrorMsg";
            if(!str.includes(key)){
              if(key==="errorMsg"){
                return (
                  <div key={key} className="col-sm-12">
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">errorMsg</label>
                      <div className="col-sm-10">
                          <textarea 
                          className="form-control" 
                          rows="3" 
                          name="errorMsg"
                          value={value}
                          ></textarea>
                      </div>
                    </div>
                  </div>
                )
              } else if(key==="textWireMsg"){
                let valueSt = "";
                if(value !== null && value !== ""){
                  let msgArr = value.split("{");
                  for (let i = 1; i < msgArr.length; i++) {
                    msgArr[i] = "{"+msgArr[i] + "\n";
                  }
                  valueSt = msgArr.join("");
                }
                return (
                  <div key={key} className="col-sm-12">
                    <div className="form-group row">
                      <label className="col-sm-2 col-form-label">textWireMsg</label>
                      <div className="col-sm-10">
                          <textarea 
                          className="form-control" 
                          rows="3" 
                          name="textWireMsg"
                          value={valueSt}
                          ></textarea>
                      </div>
                    </div>
                  </div>
                )
              } else {
                return (
                  <div key={key} className="col-sm-4">
                    <CustTextInput
                      placeholdertext={key}
                      labelText={key}
                      nameref={key}
                      inputchange={props.oncustinputchange}
                      val={value}
                      wireDtObj={wireDetailsObj}
                    />
                  </div>
                )
              }
            }
          })
        }
        </div>
    </React.Fragment>
  );
}

export default ACHDetailForm;