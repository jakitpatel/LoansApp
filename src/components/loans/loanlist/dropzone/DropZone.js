import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Modal from "react-bootstrap/Modal";
import { useSelector, useDispatch } from 'react-redux';
import { ContribDocTypeOptions} from './../../../../commonVar.js';
import { PDFDocument } from 'pdf-lib'
import './DropZone.css';

const {API_KEY, Loan_Upload_Doc_Url} = window.constVar;

function Dropzone (props) {
    const fileInputRef = useRef();
    const progressRef = useRef();
    const uploadRef = useRef();
    const uploadModalRef = useRef();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [validFiles, setValidFiles] = useState([]);
    const [unsupportedFiles, setUnsupportedFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const {hideModal, selLoanObj, setDocData, showDocRetModal} = props;

    const { session_token } = useSelector(state => {
        return {
            ...state.userReducer
        }
    });

    useEffect(() => {
        let filteredArr = selectedFiles.reduce((acc, current) => {
            const x = acc.find(item => item.name === current.name);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
        }, []);
        setValidFiles([...filteredArr]);
        
    }, [selectedFiles]);

    const preventDefault = (e) => {
        e.preventDefault();
        // e.stopPropagation();
    }

    const dragOver = (e) => {
        preventDefault(e);
    }

    const dragEnter = (e) => {
        preventDefault(e);
    }

    const dragLeave = (e) => {
        preventDefault(e);
    }

    const fileDrop = (e) => {
        preventDefault(e);
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    }

    const filesSelected = () => {
        if (fileInputRef.current.files.length) {
            handleFiles(fileInputRef.current.files);
        }
    }

    const fileInputClicked = () => {
        fileInputRef.current.click();
    }

    const handleFiles = (files) => {
        for(let i = 0; i < files.length; i++) {
            if (validateFile(files[i])) {
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
            } else {
                files[i]['invalid'] = true;
                setSelectedFiles(prevArray => [...prevArray, files[i]]);
                setErrorMessage('File type not permitted');
                setUnsupportedFiles(prevArray => [...prevArray, files[i]]);
            }
        }
    }

    const validateFile = (file) => {
        console.log(file);
        let ext = fileType(file.name);
        console.log(ext);
        //const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/x-icon'];
        const validTypes = ['image/heic', 'image/heic-sequence', 'image/heif'];
        if (validTypes.indexOf(file.type) !== -1) {
            return false;
        }
        if(ext=== 'heic' || ext==='heif'){
            return false;
        }
        return true;
    }

    const fileSize = (size) => {
        if (size === 0) {
          return '0 Bytes';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const fileType = (fileName) => {
        return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
    }

    const removeFile = (name) => {
        const index = validFiles.findIndex(e => e.name === name);
        const index2 = selectedFiles.findIndex(e => e.name === name);
        const index3 = unsupportedFiles.findIndex(e => e.name === name);
        validFiles.splice(index, 1);
        selectedFiles.splice(index2, 1);
        setValidFiles([...validFiles]);
        setSelectedFiles([...selectedFiles]);
        if (index3 !== -1) {
            unsupportedFiles.splice(index3, 1);
            setUnsupportedFiles([...unsupportedFiles]);
        }
    }

    const handleDocTypeChange = (data, e) => {
        let name = data.name;
        const index = validFiles.findIndex(e => e.name === name);
        const index2 = selectedFiles.findIndex(e => e.name === name);
        const index3 = unsupportedFiles.findIndex(e => e.name === name);
        validFiles[index]['docType'] = e.target.value;
        selectedFiles[index2]['docType'] = e.target.value;
        
        setValidFiles(prevArray => [...prevArray, validFiles[index]]);
        setSelectedFiles(prevArray => [...prevArray, selectedFiles[index2]]);
        if (index3 !== -1) {
            unsupportedFiles[index3]['docType'] = e.target.value;
            setUnsupportedFiles(prevArray => [...prevArray, unsupportedFiles[index3]]);
        }
    }

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
    
    const uploadFiles = async () => {
        //uploadModalRef.current.style.display = 'block';
        //uploadRef.current.innerHTML = 'File(s) Uploading...';
        const options = {
            headers: {
                'X-DreamFactory-API-Key': API_KEY,
                'X-DreamFactory-Session-Token': session_token
            }
        };
        let docRetArr = [];
        for (let i = 0; i < validFiles.length; i++) {
            let base64 = await convertBase64(validFiles[i]);

            /// For PDF Convert from 1.3 to 1.7
            //console.log(validFiles[i]);
            //console.log(validFiles[i].type);
            let ext = fileType(validFiles[i].name);
            //console.log(base64);
            if(validFiles[i].type==="application/pdf" || ext==="pdf"){
                const pdfDoc1 = await PDFDocument.load(base64);
                console.log(pdfDoc1);
                const pdfDoc = await PDFDocument.create();

                const [firstDonorPage] = await pdfDoc.copyPages(pdfDoc1, [0]);
                pdfDoc.addPage(firstDonorPage);
                console.log(pdfDoc);
                base64 = await pdfDoc.saveAsBase64({ dataUri: true });
                console.log("---Modified---");
                //console.log(base64);
            }
            //////////
            
            let tmpLoanObj = {};
            tmpLoanObj.description    = validFiles[i].docType;
            tmpLoanObj.name           = validFiles[i].name;
            tmpLoanObj.ProposedLoanId = selLoanObj.proposedLoanId;
            tmpLoanObj.associationCustomerId = selLoanObj.customerId;
            tmpLoanObj.content        = base64;

            let res = await axios.post(Loan_Upload_Doc_Url, tmpLoanObj/*, {
                onUploadProgress: (progressEvent) => {
                    const uploadPercentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                    progressRef.current.innerHTML = `${uploadPercentage}%`;
                    progressRef.current.style.width = `${uploadPercentage}%`;

                    if (uploadPercentage === 100) {
                        console.log("File Uploaded successfully!");
                        uploadRef.current.innerHTML = 'File(s) Uploaded';
                        validFiles.length = 0;
                        setValidFiles([...validFiles]);
                        setSelectedFiles([...validFiles]);
                        setUnsupportedFiles([...validFiles]);
                    }
                },
            }*/)
            .catch((error) => {
                //uploadRef.current.innerHTML = `<span class="error">Error Uploading File(s)</span>`;
                //progressRef.current.style.backgroundColor = 'red';
                if(error.response){
                    console.log(error.response);
                    if (401 === error.response.status) {
                        // handle error: inform user, go to login, etc
                        let res = error.response.data;
                        console.log(res.error.message);
                        //alert(res.error.message);
                    } else {
                        console.log(error);
                        //alert(error);
                    }
                } else {
                    console.log(error);
                    //alert(error);
                }
            })
            console.log(res.data);
            docRetArr.push(res.data);
        }
        console.log("File Uploaded successfully!");
        hideModal();
        setDocData(docRetArr);
        showDocRetModal();
    }

    const closeUploadModal = () => {
        uploadModalRef.current.style.display = 'none';
    }

    return (
        <>
        <Modal.Header closeButton>
            <Modal.Title>File Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="content">
            <div className="filedrop-container">
                {/*unsupportedFiles.length === 0 && validFiles.length ? <button className="file-upload-btn" onClick={() => uploadFiles()}>Upload Files</button> : ''*/} 
                {unsupportedFiles.length ? <p>Please remove all unsupported files.</p> : ''}
                <div className="drop-container"
                    onDragOver={dragOver}
                    onDragEnter={dragEnter}
                    onDragLeave={dragLeave}
                    onDrop={fileDrop}
                    onClick={fileInputClicked}
                >
                    <div className="drop-message">
                        <div className="upload-icon"></div>
                        Drag & Drop files here or click to select file(s)
                    </div>
                    <input
                        ref={fileInputRef}
                        className="file-input"
                        type="file"
                        multiple
                        onChange={filesSelected}
                    />
                </div>
                <div className="file-display-container">
                    {
                        validFiles.map((data, i) => 
                            <div className="file-status-bar" key={i}>
                                <div style={{float:"left"}}>
                                    <div className="file-type-logo"></div>
                                    <div className="file-type">{fileType(data.name)}</div>
                                    <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                                    <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                                </div>
                                <div style={{float:"right", width:"30%", marginRight:"30px"}}>
                                    <select
                                    className="form-control custom-select"
                                    name="docType"
                                    value={data.docType}
                                    onChange={(e)=>{handleDocTypeChange(data, e)}}
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
                                <div className="file-remove" onClick={() => removeFile(data.name)}>X</div>
                            </div>
                        )
                    }
                </div>
            </div>

            <div className="upload-modal" ref={uploadModalRef}>
                <div className="overlay"></div>
                <div className="close" onClick={(() => closeUploadModal())}>X</div>
                <div className="progress-container">
                    <span ref={uploadRef}></span>
                    <div className="progress">
                        <div className="progress-bar" ref={progressRef}></div>
                    </div>
                </div>
            </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button style={{ width:"110px" }} disabled={unsupportedFiles.length === 0 && validFiles.length ? false : true} className="btn btn-primary btn-sm" onClick={() => uploadFiles()}>Upload Files</button>
          <button style={{ width:"110px" }} className="btn btn-primary btn-sm" onClick={hideModal}>Cancel</button>
        </Modal.Footer>
        </>
    );
}

export default Dropzone;