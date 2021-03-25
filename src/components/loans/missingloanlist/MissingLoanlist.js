import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import MissingLoanListView from "./MissingLoanListView.js";
import * as Icon from "react-feather";
import "./MissingLoanlist.css";
import axios from 'axios';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {buildSortByUrl, buildPageUrl, buildFilterUrl, buildExternalLoanExportDetailList, toCurrency} from './../../Functions/functions.js';
import { BrokerOptions, UnAssocLoanStatusOptions} from './../../../commonVar.js';
import SelectColumnFilter from './../../Filter/SelectColumnFilter.js';
//import {API_KEY, Loans_Url, env, SetLoans_Url, Loan_Upload_Doc_Url} from './../../../const';
const {API_KEY, SetMissingLoans_Url, MissingLoans_Url} = window.constVar;

function MissingLoanlist(props) {
  
  // We'll start our table without any data
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const [allLoansData, setAllLoansData] = React.useState([]);
  const [storeLoansData, setStoreLoansData] = React.useState([]);
  //const [loanListData, setLoanListData] = React.useState([]);
  //const [loanDetailsData, setLoanDetailsData] = React.useState([]);
  const [filtersarr, setFiltersarr] = React.useState([]);
  //const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const [downloadAllLoans, setDownloadAllLoans] = useState(false);
  const [downloadStoreLoans, setDownloadStoreLoans] = useState(false);
  const [exportFileName, setExportFileName] = React.useState("");
  const [isRefresh, setIsRefresh] = useState(false);

  const dispatch = useDispatch();

  const { session_token, teamInt,teamChangeFlag, uid, isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  const { missingloans, pageIndex, pageSize, totalCount, sortBy, filters, backToList } = useSelector(state => {
    return {
        ...state.MissingLoansReducer
    }
  });

  //console.log("backToList : "+backToList);

  let columnDefs = [];
  if(isInternalUser){
    columnDefs.push({
      field: "broker",
      Header: "broker",
      accessor: "broker",
      Filter: SelectColumnFilter,
      filter: 'includes',
      options:BrokerOptions
    },
    {
      field: "businessName",
      Header: "businessName",
      accessor: "businessName"
    },
    {
      field: "taxID",
      Header: "taxID",
      accessor: "taxID"
    },
    {
      field: "unassociatedLoanStatus",
      Header: "unassociatedLoanStatus",
      accessor: "unassociatedLoanStatus",
      Filter: SelectColumnFilter,
      filter: 'includes',
      options:UnAssocLoanStatusOptions,
      editable:true,
      columnType:'list',
      columnOptions:UnAssocLoanStatusOptions
    },
    {
      field: "unassociatedLoanComments",
      Header: "unassociatedLoanComments",
      accessor: "unassociatedLoanComments",
      editable:true,
      columnType:'text'
    },
    {
      name: "LoanApplicationNumberOnly",
      field: "LoanApplicationNumberOnly",
      Header: "LoanApplicationNumberOnly",
      accessor: "LoanApplicationNumberOnly",
      editable:true,
      columnType:'text'
    });
  } else {
    columnDefs.push(
    {
      field: "businessName",
      Header: "businessName",
      accessor: "businessName"
    },
    {
      field: "unassociatedLoanStatus",
      Header: "unassociatedLoanStatus",
      accessor: "unassociatedLoanStatus",
      Filter: SelectColumnFilter,
      filter: 'includes',
      options:UnAssocLoanStatusOptions,
      editable:true,
      columnType:'list',
      columnOptions:UnAssocLoanStatusOptions
    },
    {
      field: "unassociatedLoanComments",
      Header: "unassociatedLoanComments",
      accessor: "unassociatedLoanComments",
      editable:true,
      columnType:'text'
    });
  }

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    let oldData = missingloans;
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
      type:'UPDATEMISSINGLOANLIST',
      payload:{
        missingloans:newData
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

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false)
  }, [missingloans])

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

      let url = MissingLoans_Url;
      url += buildPageUrl(pageSize,pageIndex);
      /*
      if(uid){
        let tmpUrl = "(userName%20like%20%27%"+uid+"%%27)";
        let starttmpUrl = "(userName like %";
        let val = uid;
        let endst = "%)";
        let fullqst = encodeURIComponent(starttmpUrl)+val+encodeURIComponent(endst);
        url += "&filter="+fullqst;
      }
      */
      if(filters.length>0){
        console.log("filters");
        console.log(filters);
        /*if(batchRec){
          url += " and ";
        } else {*/
          url += "&filter=";
        //}
        url += buildFilterUrl(filters);
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
        type:'UPDATEMISSINGLOANLIST',
        payload:{
          pageIndex:pageIndex,
          pageSize:pageSize,
          totalCount:totalCnt,
          sortBy : sortBy,
          filters : filters,
          missingloans:res.data.resource
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

  let headerTitle = "Missing Loan List";

  console.log("loans", missingloans);
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
      <MissingLoanListView
        data={missingloans}
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

  const onLoanListExport = (event, dataType) => {
    console.log("On Loan List Export Button Click");
    if(missingloans.length > 0){
      console.log(dataType);
      let newArray = [],exportFileNameVal="";
      if(dataType==="List"){
        exportFileNameVal = "LoanList";
        newArray = missingloans.map((data) => {
          if(isInternalUser){
            if(teamInt==="teama"){
              return {
                'ALDLoanApplicationNumberOnly' : data.ALDLoanApplicationNumberOnly,
                'ReviewerAssigned': data.ReviewerAssigned,
                'MentorAssigned' : data.MentorAssigned,
                'ApplicationCreatedDate' : data.ApplicationCreatedDate,
                'LastModifyDate' : data.LastModifyDate,
                'Primary Borrower' : data.PrimaryBorrowers,
                'TotalRequest' : data.FirstLoanAmount,
                'StatusAComments': data.StatusAComments,
                'ApplicationStatus' : data.statusIndication,
                'SBAStatus' : data.SBAStatus,
                'Broker'    : data.broker,
                'EIN#': data.TaxID,
                'Borrower Address': data.Address1,
                'DocumentsSent': data.DocumentsSent,
                'DocumentsRequired' : data.DocumentsRequired
              }
            } else if(teamInt==="teamb"){
              return {
                'ReviewerAssigned': data.ReviewerAssigned,
                'ALDLoanApplicationNumberOnly' : data.ALDLoanApplicationNumberOnly,
                'Broker'    : data.broker,
                'Primary Borrower' : data.PrimaryBorrowers,
                'SBAStatus' : data.SBAStatus,
                'ErrorMessage' : data.ErrorMessage,
                'MentorAssigned' : data.MentorAssigned,
                'StatusAComments': data.StatusAComments,
                'Application Status"' : data.R2_ApplicationStatus,
                'statusIndication' : data.statusIndication,
                'teambmember' : data.teambmember
              }
            } else if(teamInt==="teamc"){
              return {
                'ReviewerAssigned': data.ReviewerAssigned,
                'ALDLoanApplicationNumberOnly' : data.ALDLoanApplicationNumberOnly,
                'Primary Borrower' : data.PrimaryBorrowers,
                'TotalRequest' : data.FirstLoanAmount,
                'SBAStatus' : data.SBAStatus,
                'MentorAssigned' : data.MentorAssigned,
                'StatusCComments': data.StatusCComments,
                'Application Status"' : data.R2_ApplicationStatus
              }
            } else {
              return null;
            }
          } else {
            let amt = data.R2_LoanAmount;
            if(amt!==null) {
              amt = toCurrency(amt);
            }
            return {
              'ApplicationCreatedDate' : data.ApplicationCreatedDate,
              'BusinessName' : data.PrimaryBorrower,
              'LoanApplicationNumber': data.ALDLoanApplicationNumberOnly,
              'TotalRequest' : data.R2_LoanAmount,
              'LastModifyDate' : data.LastModifyDate,
              'SBALoanNumber': data.SBALoanNumber,
              'SBAApprovalDate': data.SBAApprovalDate,
              'SBAStatus' : data.SBAStatus,
              'Overall Status' : data.statusIndication
            }
          }
        });
      } else {
        exportFileNameVal = "LoanListDetails";
        if(isInternalUser){
          newArray = missingloans;
        } else {
          newArray = buildExternalLoanExportDetailList(missingloans);
        }
      }
      setStoreLoansData(newArray);
      setExportFileName(exportFileNameVal);
      setDownloadStoreLoans(!downloadStoreLoans);
    } else {
      console.log("Return From Loans Export");
      alert("No Loan is present");
      return false;
    }
  }

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
            {disCmp}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MissingLoanlist;
