import React from "react";
import "./WireDetailForm.css";
import ReactTooltip from 'react-tooltip';
import { useSelector } from 'react-redux';
import WireRemittanceList from './WireRemittanceList';

function CustTextInput(props) {

  const { wiredict } = useSelector(state => {
    return {
        ...state.wireDictReducer
    }
  });

  let fieldName = props.nameref;
  let fieldClass = "form-control";
  let errorMsg = props.wireDtObj.errorMsg;
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
    <div className="col-sm-4">
      <div className="form-group row">
        <label data-for='wireDetailForm' data-tip={labelTooltip} className="col-sm-5 col-form-label">{props.labelText}</label>
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
            //readOnly={props.readOnlyValue}
          />
        </div>
      </div>
    </div>
  );
}

function WireDetailForm(props) {
  let wireDetailsObj = props.custstate;
  let wireID = wireDetailsObj.wireID;
  const { WIRE_MODIFY_CREATE } = useSelector(state => {
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
            let str = "wireID wireBatchID wireDoc_by_wireID derivedErrorMsg wireRemittance_by_wireID";
            if(!str.includes(key)){
              if(key==="errorMsg"){
                return (
                    <div key={key} className="col-sm-12">
                      <WireRemittanceList wireID={wireID} />
                      <div className="form-group row">
                        <label className="col-sm-2 col-form-label">errorMsg</label>
                        <div className="col-sm-10">
                            <textarea 
                            className="form-control" 
                            rows="3" 
                            name="errorMsg"
                            value={value}
                            //readOnly
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
                          //readOnly
                          ></textarea>
                      </div>
                    </div>
                  </div>
                )
              } else {
                let readOnlyVal = !WIRE_MODIFY_CREATE;
                if(key==="status" || key==="wireType"){
                  readOnlyVal = true;
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

export default WireDetailForm;
