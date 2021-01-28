import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import WireDetailForm from "./WireDetailForm";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {API_KEY, WireDictionary_Url, Wire_tbl_Url, WireDetails_Url, env} from './../../../const';
import { CSVLink } from "react-csv";
//import DownloadExcel from "./ExcelDownload";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalTitle from "react-bootstrap/ModalTitle";

function WireDetails(props) {
  let history = useHistory();

  const [downloadexcel, setDownloadexcel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wireText, setWireText] = useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [modWireDtObj, setModWireDtObj] = useState({});
  const dispatch = useDispatch();

  const { session_token } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  const { wiredict, wireDetailsObj } = useSelector(state => {
    return {
        ...state.wireDictReducer,
        ...state.wireDetailsReducer
    }
  });

  let { wireID } = useParams();
  /*
  useEffect(() => {
    if (downloadexcel) {
      setDownloadexcel(false);
    }
  }, [downloadexcel]);
  */

  useEffect(() => {
    console.log("WireId : "+wireID);
    let ignore = false;
    async function fetchWireDictionary() {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': session_token
        }
      };
      let res = await axios.get(WireDictionary_Url, options);
      //console.log(res.data);
      //console.log(res.data.resource);
      let dict = res.data.resource[0].dict;
      //console.log(dict);
      var dictObj = JSON.parse(dict);
      console.log(dictObj);
      dispatch({
        type:'SETWIREDICTIONARY',
        payload:dictObj
      });
      buildWireTagValue();
    }
    //// Start Code for Wire To Tag Value /////
    function buildWireTagValue(){
      let tagValSt = "";
      for(var i = 0; i < wiredict.length; i++) {
        var obj = wiredict[i];
        if(obj.tag !== "6500"){
          let elementArr = obj.elements;
          let tagVal = "";
          for(var j = 0; j < elementArr.length; j++) {
            var objElement = elementArr[j];
            //console.log(objElement.name);
            let fieldName = objElement.name;
            let val = wireDetailsObj[fieldName];
            if(val!==null && val!=="" && val!=="undefined" && val!==undefined){
              console.log(obj.tag+"--"+fieldName+"--"+val);
              if(typeof val == "string"){
                //val = val.trim();
              }
              if(fieldName.includes("sendersChargesAmount")){
                val = val.toString().replace(".", ",");
              }
              tagVal += val;
              if((val.length < objElement.length) || (objElement.delimiter === "*")){
                tagVal += "*";
              }
            }
          }
          if(tagVal!==null && tagVal!==""){
            tagValSt += "{"+obj.tag+"}"+tagVal;
          }
        }
      }
      console.log(tagValSt);
      setWireText(tagValSt);
    }
    
    //// Fetch Wire Details
    async function fetchWireDetails() {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': session_token
        }
      };
      let url = WireDetails_Url+ "wireID='"+wireID+"'";
      if(env==="DEV"){
        url = WireDetails_Url;
      }
      let res = await axios.get(url, options);
      //console.log(res.data.resource);
      let wireDetailsArr = res.data.resource;
      console.log(wireDetailsArr);
      dispatch({
        type:'SETWIREDETAILS',
        payload:wireDetailsArr[0]
      });
      dispatch({
        type:'SETWIREREMITTANCEDETAILS',
        payload:wireDetailsArr[0].wireRemittance_by_wireID
      });
      /*
      if(wireDetails.length>0){
        setWireDetailsObj(wireDetails[0]);
      }*/
      /// Load Dictionary & build tag value
      if(wiredict.length === 0){
        fetchWireDictionary();
      } else {
        buildWireTagValue();
      }
    }
    fetchWireDetails();
    ////// Ends
    return () => { ignore = true };
  }, []);

  function handleChange(e) {
    console.log("On Handle Change : "+ e.target.name);
    /*
    let targetVal = "";
    if(e.target.type === "checkbox"){
      targetVal = e.target.checked;
    } else {
      targetVal = e.target.value;
    }
    dispatch({
      type:'UPDATEWIREDETAILSFORM',
      payload:{ ...wireDetailsObj, [e.target.name]: targetVal }
    });
    setModWireDtObj({ ...modWireDtObj, [e.target.name]: targetVal });
    */
  }

  const handleWireSave = async () => {
    console.log("Handle Wire Save");
    console.log(modWireDtObj);
    try {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': session_token
        }
      };
      let tmpWireObj = modWireDtObj;
      tmpWireObj.wireID = wireID;
      //tmpCustObj.LastUpdateUser = uid;
      //tmpCustObj.LastUpdateDate = moment().format('YYYY-MM-DD');
      let res = await axios.put(Wire_tbl_Url+"/"+wireID, tmpWireObj, options);
      console.log(res);
      alert("Data saved successfully!");
      //setToCustomer(true);
    } catch (error) {
      console.log(error.response);
      if (401 === error.response.status) {
          // handle error: inform user, go to login, etc
          let res = error.response.data;
          alert(res.error.message);
      } else {
        alert(error);
      }
    }
  }

  const handleWireRestore = () => {
    console.log("Handle Wire Restore");
  }

  function getTitle() {
    //console.log("Get Title : " + props.disType);
    switch ("view") {
      case "add":
        return "Add New Customer";
      case "edit":
        return "Edit Customer";
      default:
        return "Wire Details";
    }
  }

  let csvArray = [];
  csvArray.push(wireDetailsObj);
  //let csvFileName = "wire-"+wireID+".csv";
  let txtFileName = "wire-"+wireID+".txt";
  let excelFileName = "wire-"+wireID;

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  function wireStatusChange(){
    console.log("Wire Status Changed to Done.");
    hideModal();
    handleWireStatusChange();
  }

  async function handleWireStatusChange() {
    try {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': session_token
        }
      };
      console.log(wireDetailsObj);
      //let tmpWireObj = wireDetailsObj;
      let tmpWireObj = {};
      tmpWireObj.status = 3;
      tmpWireObj.wireID = wireDetailsObj.wireID;
      
      var d = new Date();
      var yr = d.getFullYear();
      var month = d.getMonth()+1;
      var hh = d.getHours();
      var mm = d.getMinutes();
      var ss = d.getSeconds();
      var dt = d.getDate();
      var datefull = month+"/"+dt+"/"+yr + " "+ hh +":" + mm + ":" + ss;
      tmpWireObj.completeDateTime = datefull;

      let res = await axios.put(Wire_tbl_Url+"/"+wireDetailsObj.wireID, tmpWireObj, options);
      console.log(res);
      alert("Status updated successfully!");
      history.goBack();
    } catch (error) {
      console.log(error.response);
      if (401 === error.response.status) {
          // handle error: inform user, go to login, etc
          let res = error.response.data;
          alert(res.error.message);
      } else {
        alert(error);
      }
    }
  }

  let showDoneBtn = false;
  /*
  if(wireDetailsObj.subtypeCode==="02" && wireDetailsObj.status!=="DONE"){
    showDoneBtn = true;
  }*/
  let showExportBtn = false;
  /*
  if(WIRE_EXPORT===true){
    if((wireDetailsObj.subtypeCode==="00" || wireDetailsObj.subtypeCode==="08") && wireDetailsObj.status!=="DONE"){
      showExportBtn = true;
    }
  }
  */
  const backToWireList = () => {
    console.log("Back To Wire List Button Click");
    dispatch({
      type:'UPDATEWIRELIST',
      payload:{
        backToList:true
      }
    });
    history.goBack();
  }
  return (
    <React.Fragment>
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <Modal.Title>Alert!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to change the wire status to done?</Modal.Body>
        <Modal.Footer>
          <button style={{ width:"70px" }} className="btn btn-primary btn-sm" onClick={() => { wireStatusChange();}}>Ok</button>
          <button style={{ width:"70px" }} className="btn btn-primary btn-sm" onClick={hideModal}>Cancel</button>
        </Modal.Footer>
      </Modal>
      <div className="container" style={{marginLeft:"0px", maxWidth: "100%"}}>
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <h3 className="text-center">{getTitle()} - Wire {wireID}</h3>
            <div className="btnCls">
              <button style={{ float: "left" }} type="button" onClick={backToWireList} className="btn btn-primary btn-sm">
                Back
              </button>
              {/*
              <button disabled={WIRE_MODIFY_CREATE===false} style={{ float: "right", marginLeft:"10px" }} type="button" onClick={handleWireSave} className="btn btn-primary btn-sm">
                Save
              </button>
              <button disabled={WIRE_MODIFY_CREATE===false} style={{ float: "right", marginLeft:"10px" }} type="button" onClick={handleWireRestore} className="btn btn-primary btn-sm">
                Restore
              </button>
              
              {showDoneBtn &&
                <button disabled={wireDetailsObj.status==="DONE"} style={{ float: "right", marginLeft:"10px" }} type="button" onClick={() => { showModal();}} className="btn btn-primary btn-sm">
                  Done
                </button>
              }
              {showExportBtn &&
                <React.Fragment>
                  <CSVLink
                        data={wireText}
                        filename={txtFileName}
                        className="btn btn-primary btn-sm"
                        style={{ float: "right" }}
                        target="_blank"
                        onClick={() => { onWireExport();}}
                      >Export</CSVLink>
                </React.Fragment>
              }
              {downloadexcel
                ? <DownloadExcel data={csvArray} excelFile={excelFileName} />
                : null
              }
              */}
              <div style={{ clear:"both"}}></div>
            </div>
            <div className="col-sm-12">
              <WireDetailForm formMode={props.disType} custstate={wireDetailsObj} oncustinputchange={handleChange} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default WireDetails;
