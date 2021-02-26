import React from 'react';
import Modal from "react-bootstrap/Modal";

function LoanFileUpload (props) {
    const {isOpenRet, docRetData, hideRetModal} = props;

    let docId = "";
    let id = "";
    let objectId = "";
    let objectType = "";
    if(docRetData.length > 0){
      id = docRetData[0].id;
      docId = docRetData[0].documentId;
      objectId = docRetData[0].objectId;
      objectType = docRetData[0].objectType;
    }
    return (
      <>
        <Modal show={isOpenRet} onHide={hideRetModal}>
        <Modal.Header>
          <Modal.Title>Uploaded Document Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group row">
            <label data-for='' className="col-sm-3 col-form-label">ID</label>
            <div className="col-sm-9">
               <input type="text" className="form-control" readOnly value={id}></input>
            </div>
          </div>
          <div className="form-group row">
            <label data-for='' className="col-sm-3 col-form-label">Document ID</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" readOnly value={docId}></input>
            </div>
          </div>
          <div className="form-group row">
            <label data-for='' className="col-sm-3 col-form-label">Object Type</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" readOnly value={objectType}></input>
            </div>
          </div>
          <div className="form-group row">
            <label data-for='' className="col-sm-3 col-form-label">Object Id</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" readOnly value={objectId}></input>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button style={{ width:"70px" }} className="btn btn-primary btn-sm" onClick={hideRetModal}>Ok</button>
        </Modal.Footer>
      </Modal>
    </>
    );
}

export default LoanFileUpload;