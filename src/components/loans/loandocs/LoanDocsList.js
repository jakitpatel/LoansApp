import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import LoanDocsListView from "./LoanDocsListView.js";
import * as Icon from "react-feather";
import "./LoanDocsList.css";
import axios from 'axios';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {buildSortByUrl, buildPageUrl, buildFilterUrl} from './../../Functions/functions.js';
import mime from 'mime-types';
import SelectColumnFilter from './../../Filter/SelectColumnFilter.js';
//import {API_KEY, Loans_Url, env, SetLoans_Url, Loan_Upload_Doc_Url} from './../../../const';
const {API_KEY, SetMissingLoans_Url, LoansDocs_Url, DocReader_Url} = window.constVar;

function LoanDocsList(props) {
  let history = useHistory();
  // We'll start our table without any data
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const [filtersarr, setFiltersarr] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const [isRefresh, setIsRefresh] = useState(false);

  const dispatch = useDispatch();

  const { session_token, teamInt,teamChangeFlag, isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  const { loandocs, pageIndex, pageSize, totalCount, sortBy, filters, backToList } = useSelector(state => {
    return {
        ...state.LoanDocsReducer
    }
  });

  //console.log("backToList : "+backToList);

  const downloadDoc = async (documentID, fileName, name, typeView) => {
    console.log("Download Docuemnt Doc Id : "+documentID);
    try {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': session_token
        }
      };
      let docObj = {
        //params: {
          "DocumentId" : documentID
        //}
      }
      let res = await axios.post(DocReader_Url, docObj);
      console.log(res);
      if(res.data.content){
        //let extension = fileName.split('.').pop();
        let contentType = mime.lookup(fileName); // "application/pdf";
        console.log("contentType :- "+contentType);
        convertBase64ToBlob(contentType, res.data.content, fileName, name, typeView);
        //downloadBase64File(contentType, res.data.content, fileName);
        //alert("Data saved successfully!");
        console.log("base64 Data retrived successfully & opened pdf!");
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
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
    }
  }

  const convertBase64ToBlob = async (contentType, base64Data, fileName, name, typeView) => {
    console.log("convert Base64 To Blob");
    const base64Response = await fetch(`data:${contentType};base64,${base64Data}`);
    const blob = await base64Response.blob();
    const blobURL = window.URL.createObjectURL(blob);
    //window.open(blobURL,fileName);
    
    const a = document.createElement("a");
    a.href = blobURL;
    console.log("typeView : "+typeView);
    if(typeView === "download"){
      a.download = name;
    }
    a.target = "_blank";
    a.style = "display: none";

    //if (fileName && fileName.length) a.download = fileName;
    document.body.appendChild(a);
    a.click();
    //link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));
    //link.remove();
    setTimeout(() => {
      window.URL.revokeObjectURL(blobURL);
      document.body.removeChild(a);
    }, 0)
  }
  // Parameters:
  // contentType: The content type of your file. 
  //              its like application/pdf or application/msword or image/jpeg or
  //              image/png and so on
  // base64Data: Its your actual base64 data
  // fileName: Its the file name of the file which will be downloaded. 

  function downloadBase64File(contentType, base64Data, fileName) {
    console.log("downloadBase64File");
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  let loanRec = props.loanRec;
  console.log(loanRec);

  let columnDefs = [];
 
    columnDefs.push(
      {
        Header: "Download",
        show : true, 
        width: 55,
        //id: 'colViewWireDetail',
        accessor: row => row.attrbuiteName,
        disableFilters: true,
        //filterable: false, // Overrides the table option
        Cell: obj => {
          //console.log(obj.row);
          let loanObj = obj.row.original;
          let enableVal = false;
          if(isInternalUser){
            enableVal = true;
          }
          return (
            <button type="button" onClick={(e) => {downloadDoc(loanObj.documentID, loanObj.fileName, loanObj.name,"download")}} className={`btn btn-link btn-sm ${enableVal ? "" : "disabled"}`}>
              <Icon.Download />
            </button>
          );
        }
      },
      {
      Header: "View",
      show : true, 
      width: 55,
      //id: 'colViewWireDetail',
      accessor: row => row.attrbuiteName,
      disableFilters: true,
      //filterable: false, // Overrides the table option
      Cell: obj => {
        //console.log(obj.row);
        let loanObj = obj.row.original;
        let enableVal = false;
        if(isInternalUser){
          enableVal = true;
        }
        return (
          <button type="button" onClick={(e) => {downloadDoc(loanObj.documentID, loanObj.fileName, loanObj.name,"view")}} className={`btn btn-link btn-sm ${enableVal ? "" : "disabled"}`}>
            <Icon.Edit />
          </button>
        );
      }
    },
    {
      field: "name",
      Header: "name",
      accessor: "name"
    },
    {
      field: "customerFacingName",
      Header: "customerFacingName",
      accessor: "customerFacingName"
    },
    {
      field: "uploadDate",
      Header: "uploadDate",
      accessor: "uploadDate",
      disableFilters: true
    });

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    let oldData = loandocs;
    let modifiedRec = null;
    let newData = oldData.map((row, index) => {
      if (index === rowIndex) {
        modifiedRec = {
          ...oldData[rowIndex],
          [columnId]: value,
        };
        return modifiedRec
      }
      return row
    });
    saveLoanDetails({
      [columnId]:value,
      ID:modifiedRec.ID
    });
    //setData(newData);
    dispatch({
      type:'UPDATELOANDOCSLIST',
      payload:{
        loandocs:newData
      }
    });
  }

  const saveLoanDetails = async (obj) => {
    console.log("Save Missing Loan Details");
    console.log(obj);
    try {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': session_token
        }
      };
      let tmpLoanObj = obj;
      if(tmpLoanObj.ID === "" || tmpLoanObj.ID === null || tmpLoanObj.ID === undefined){
        //alert("ALD_ID is empty! So, can not able to save the loan.");
        console.log("ID is empty! So, can not able to save the missing loan.");
        //return false;
      } else {
        let ald_id = tmpLoanObj.ID;
        //tmpLoanObj.LastUpdateUser = uid;
        tmpLoanObj.LastModifyDate = moment().format('YYYY-MM-DD');
        let res = await axios.put(SetMissingLoans_Url+'/'+ald_id, tmpLoanObj, options);
        console.log(res);
        //alert("Data saved successfully!");
        console.log("Data saved successfully!");
      }
    } catch (error) {
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
      //backToWireList();
    }
  }

  const backToLoanList = () => {
    console.log("Back To Loan List Button Click");
    dispatch({
      type:'UPDATELOANLIST',
      payload:{
        backToList:true
      }
    });
    history.goBack();
  }

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false)
  }, [loandocs])

  const fetchData = React.useCallback(({ pageSize, pageIndex, filters, sortBy }) => {
    // This will get called when the table needs new data
    // You could fetch your data from literally anywhere,
    // even a server. But for this example, we'll just fake it.

    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current

    // Set the loading state
    //setLoading(true);

    async function fetchLoanList() {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': session_token
        }
      };

      let url = LoansDocs_Url;
      url += buildPageUrl(pageSize,pageIndex);
      
      if(filters.length>0){
        console.log("filters");
        console.log(filters);
        /*if(batchRec){
          url += " and ";
        } else {*/
          url += "&filter=";
        //}
        url += buildFilterUrl(filters);
        let starttmpUrl = " and (proposedLoanId = "+loanRec.proposedLoanId+")";
        let fullqst = encodeURIComponent(starttmpUrl);
        url += fullqst;
      } else {
        let starttmpUrl = "(proposedLoanId = "+loanRec.proposedLoanId+")";
        let fullqst = encodeURIComponent(starttmpUrl);
        url += "&filter="+fullqst;
      }
      if(sortBy.length>0){
        console.log(sortBy);
        url += buildSortByUrl(sortBy);
      }
      url += "&include_count=true";
      
      //if(env==="DEV"){
        //url = Wires_Url;
      //}
      let res = await axios.get(url, options);
      //console.log(res.data);
      //console.log(res.data.resource);
      let totalCnt = res.data.meta.count;

      dispatch({
        type:'UPDATELOANDOCSLIST',
        payload:{
          pageIndex:pageIndex,
          pageSize:pageSize,
          totalCount:totalCnt,
          sortBy : sortBy,
          filters : filters,
          loandocs:res.data.resource
        }
      });
      
      // Your server could send back total page count.
      // For now we'll just fake it, too
      let pageCnt = Math.ceil(totalCnt / pageSize);
      console.log("pageCnt : "+pageCnt);
      setPageCount(Math.ceil(totalCnt / pageSize));

      //setLoading(false);
    }
    // Only update the data if this is the latest fetch
    if (fetchId === fetchIdRef.current) {
      fetchLoanList();
    }
  }, [ dispatch, session_token]);

  let headerTitle = "Loan Document List";

  console.log("loans", loandocs);
  console.log("isRefresh", isRefresh);

  let filterStateArr = filters;
  
  const initialState = {
    //pageIndex : 0,
    pageIndex : pageIndex,
    //pageSize : 10,
    pageSize : pageSize,
    sortBy : sortBy, //[{ id: "wireID", desc: true }],
    filters : filterStateArr,
  };
  const pageState = {
    pageSize : pageSize,
    pageIndex : pageIndex,
    backToList : backToList
  };
  let disCmp =
    /*loading === true ? (
      <h3> LOADING... </h3>
    ) :*/ (
      <LoanDocsListView
        data={loandocs}
        columnDefs={columnDefs}
        initialState={initialState}
        pageState={pageState}
        filtersarr={filtersarr}
        setFiltersarr={setFiltersarr}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
        isRefresh={isRefresh}
        setIsRefresh={setIsRefresh}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        teamInt={teamInt}
        teamChangeFlag={teamChangeFlag}
        isInternalUser={isInternalUser}
        totalCount={totalCount}
      />
    );

  return (
    <React.Fragment>
      <div className="container" style={{marginLeft:"0px", width:"100%", maxWidth:"100%"}}>
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <div>
                <h3 style={{float:"left"}} className="title-center">{headerTitle}</h3>
                <div style={{float:"right"}} className="btnCls">
                <React.Fragment>
                  {/*
                    {!isInternalUser &&
                    <button type="button" style={{ float: "right", marginLeft:"10px" }} onClick={(e)=> {onAllLoansExportBtnClick(e,"allFields")}} className={`btn btn-primary btn-sm`}>
                    All Loans Export
                    </button>
                    }
                    <button type="button" style={{ float: "right" }} onClick={(e)=> {onAllLoansExportBtnClick(e,"selectedFields")}} className={`btn btn-primary btn-sm`}>
                    Export All Loans
                    </button>
                    
                    {downloadAllLoans &&
                      <ExcelExport hideEl={true} excelFile="AllloanList" sheetName="AllloanList" data={allLoansData}></ExcelExport>
                    }
                    <button onClick={(e)=> {onLoanListExport(e,"ListDetails")}} disabled={loans.length === 0 ? true : false} type="button" style={{ float: "right", marginRight:"5px" }} className={`btn btn-primary btn-sm`}>
                        Export List Details
                    </button>
                    <button onClick={(e)=> {onLoanListExport(e,"List")}} disabled={loans.length === 0 ? true : false} type="button" style={{ float: "right", marginRight:"5px" }} className={`btn btn-primary btn-sm`}>
                        Export List
                      </button>
                    {downloadStoreLoans &&
                      <ExcelExport hideEl={true} excelFile={exportFileName} sheetName={exportFileName} data={storeLoansData}></ExcelExport>
                    }
                  */}
                    <button type="button" style={{ float: "right", marginRight:"5px" }} onClick={(e)=> {setIsRefresh(!isRefresh);}} className={`btn btn-primary btn-sm`}>
                      <Icon.RefreshCw />
                    </button>
                  </React.Fragment>
                  <div style={{ clear:"both"}}></div>
                </div>
                <div style={{ clear:"both"}}></div>
            </div>
            <div className="btnCls">
              <button type="button" onClick={backToLoanList} className="btn btn-primary btn-sm">
                Back
              </button>
            </div>
            {disCmp}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default LoanDocsList;
