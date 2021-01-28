import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import WireRemittanceDetailForm from './WireRemittanceDetailForm.js';
import WireDocList from './WireDocList';

function WireRemittanceDetails(props) {
  let history = useHistory();

  const [loading, setLoading] = useState(true);
  const [wireRemittanceObj, setWireRemittanceObj] = useState();
  const dispatch = useDispatch();

  const { wireDetailsObj, wireRemittanceList } = useSelector(state => {
    return {
        ...state.wireDetailsReducer
    }
  });

  let { wireRemittanceID } = useParams();
  
  useEffect(() => {
    let wireRemittanceObj = wireRemittanceList.find((wireRemittance) => wireRemittance.wireRemittanceID === parseInt(wireRemittanceID));
   //console.log("wireDetailsObj");
   if(wireRemittanceObj){
    console.log(wireRemittanceObj);
    setWireRemittanceObj(wireRemittanceObj);
    dispatch({
      type:'SETWireDocList',
      payload:wireRemittanceObj.wireRemittanceDoc_by_wireRemittanceID
    });
   }
   let ignore = false;
    return () => { ignore = true };
  }, []);
  
  
  function handleChange(){}

  return (
    <React.Fragment>
      <div className="container" style={{marginLeft:"0px", maxWidth: "100%"}}>
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <h3 className="text-center">WireRemittanceDetails - Remittance {wireRemittanceID}</h3>
            <div className="btnCls">
              <button style={{ float: "left" }} type="button" onClick={() => history.goBack()} className="btn btn-primary btn-sm">
                Back
              </button>
              <div style={{ clear:"both"}}></div>
            </div>
            <div className="col-sm-12">
              <WireRemittanceDetailForm formMode={props.disType} wireRemittance={wireRemittanceObj} oncustinputchange={handleChange} />
            </div>
            <div className="col-sm-12">
              <WireDocList />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default WireRemittanceDetails;
