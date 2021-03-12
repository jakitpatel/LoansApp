import React from 'react';
import Modal from "react-bootstrap/Modal";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import DropZone from "./dropzone/DropZone.js";
import { ContribDocTypeOptions} from './../../../commonVar.js';
const {API_KEY, Loans_Url, SetLoans_Url, Loan_Upload_Doc_Url} = window.constVar;

function LoanFileUploadWizard (props) {
    const {isOpen, hideModal, selLoanObj, setDocData, showDocRetModal} = props;

    const [selectedFile, setSelectedFile] = React.useState(null);
    const [docTypeVal, setDocTypeVal] = React.useState("");

    const { session_token } = useSelector(state => {
        return {
            ...state.userReducer
        }
    });

    const handleDocTypeChange = (e) =>{
      setDocTypeVal(e.target.value);
    }

    // On file select (from the pop up)
    const onFileChange = (event) => {
      // Update the state
      setSelectedFile(event.target.files[0]);  
    };

    const convertBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          resolve(fileReader.result);
        }
        fileReader.onerror = (error) => {
          reject(error);
        }
      })
    }

    const onLoanFileUpload = async () => {
    
      // Details of the uploaded file
      console.log(selectedFile);
      if(selectedFile===null){
        alert("Please upload file.");
        return false;
      }
      const base64 = await convertBase64(selectedFile);
      console.log(base64);
      try {
        const options = {
          headers: {
            'X-DreamFactory-API-Key': API_KEY,
            'X-DreamFactory-Session-Token': session_token
          }
        };
        let tmpLoanObj = {};
        tmpLoanObj.description    = docTypeVal;
        tmpLoanObj.name           = selectedFile.name;
        tmpLoanObj.ProposedLoanId = selLoanObj.proposedLoanId;
        tmpLoanObj.associationCustomerId = selLoanObj.customerId;
        tmpLoanObj.content        = base64;
        let res = await axios.post(Loan_Upload_Doc_Url, tmpLoanObj);
        console.log(res);
        //alert("Data saved successfully!");
        console.log("File Uploaded successfully!");
        hideModal();
        let docDataInfo = res.data; //res.data.resource;
        console.log(docDataInfo);
        let tmpArr = [];
        tmpArr.push(docDataInfo);
        setDocData(tmpArr);
        showDocRetModal();
      } catch (error) {
        if(error.response){
          console.log(error.response);
          if (401 === error.response.status) {
              // handle error: inform user, go to login, etc
              let res = error.response.data;
              console.log(res.error.message);
              alert(res.error.message);
          } else {
            console.log(error);
            alert(error);
          }
        } else {
          console.log(error);
          alert(error);
        }
      }
    };

    return (
      <>
      <Modal show={isOpen} onHide={hideModal} size="lg" dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
        <Modal.Header closeButton>
          <Modal.Title>File Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
              <div className="content">
                  <DropZone selLoanObj={selLoanObj} />
              </div>
          </div>
        {/*
        <div className="form-group row">
          <label data-for='' className="col-sm-3 col-form-label">Doc Type</label>
          <div className="col-sm-9">
            <select
              className="form-control custom-select"
              name="docType"
              value={docTypeVal}
              onChange={handleDocTypeChange}
            >
              <option value=""></option>
              {ContribDocTypeOptions.map((option, i) => {
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
        <div className="form-group row">
          <label data-for='' className="col-sm-3 col-form-label">Select File</label>
          <div className="col-sm-9">
              <input type="file" onChange={onFileChange} />
          </div>
        </div>
            */}
        </Modal.Body>
        <Modal.Footer>
          <button style={{ width:"70px" }} className="btn btn-primary btn-sm" onClick={onLoanFileUpload}>Upload</button>
          <button style={{ width:"70px" }} className="btn btn-primary btn-sm" onClick={hideModal}>Cancel</button>
        </Modal.Footer>
      </Modal>
    </>
    );
}

export default LoanFileUploadWizard;