import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";

function LoanFileUpload (props) {
    const {isOpen} = props;

    return (
        <Modal show={isOpen} onHide={props.hideModal}>
        <Modal.Header>
          <Modal.Title>Alert!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to change the wire status to done?</Modal.Body>
        <Modal.Footer>
          <button style={{ width:"70px" }} className="btn btn-primary btn-sm" onClick={() => { }}>Ok</button>
          <button style={{ width:"70px" }} className="btn btn-primary btn-sm" onClick={props.hideModal()}>Cancel</button>
        </Modal.Footer>
      </Modal>
    );
}

export default LoanFileUpload;