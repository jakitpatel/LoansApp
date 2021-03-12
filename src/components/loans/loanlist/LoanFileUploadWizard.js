import React from 'react';
import Modal from "react-bootstrap/Modal";
import DropZone from "./dropzone/DropZone.js";

function LoanFileUploadWizard (props) {
    const {isOpen, hideModal, selLoanObj, setDocData, showDocRetModal} = props;

    return (
      <>
      <Modal show={isOpen} onHide={hideModal} size="lg" dialogClassName="modal-90w" aria-labelledby="example-custom-modal-styling-title">
          <DropZone hideModal={hideModal} selLoanObj={selLoanObj} setDocData={setDocData} showDocRetModal={showDocRetModal} />
      </Modal>
    </>
    );
}

export default LoanFileUploadWizard;