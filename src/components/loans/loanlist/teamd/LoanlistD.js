import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoanListView from "./LoanListDView.js";
import * as Icon from "react-feather";
import "./LoanlistD.css";
import axios from 'axios';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {buildSortByUrl, buildPageUrl, buildFilterUrl, buildExternalLoanExportDetailList, buildExternalLoanExportAllDetailList, toCurrency} from './../../../Functions/functions.js';
import SelectColumnFilter from './../../../Filter/SelectColumnFilter.js';
import ExcelExport from './../../../ExcelExport/ExcelExport';
import LoanFileUpload from './../LoanFileUpload';
import LoanFileUploadWizard from './../LoanFileUploadWizard';
import AmountRangeColumnFilter from './../../../Filter/AmountRangeColumnFilter';
//import {API_KEY, Loans_Url, env, SetLoans_Url, Loan_Upload_Doc_Url} from './../../../const';
const {API_KEY, Loans_Url, LoansD_Url, SetLoans_Url, SetLoansForgive_Url} = window.constVar;
//import {SBAOptions, BrokerOptions, StatusOptions, applicationStatusOptions, BroketTeamOptions, MentorAssignedOptions, ReviewerAssignedOptions, AkayBrokerOptions} from './../../../commonVar.js';
const {AppliedAtTeamDOptions, StatusAutoTeamDOptions, TeamDAssignedOptions, StatusTeamDOptions} = window.commonVar;

function LoanlistD(props) {
  
  // We'll start our table without any data
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const [allLoansData, setAllLoansData] = React.useState([]);
  const [storeLoansData, setStoreLoansData] = React.useState([]);
  const [filtersarr, setFiltersarr] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const [downloadAllLoans, setDownloadAllLoans] = useState(false);
  const [downloadStoreLoans, setDownloadStoreLoans] = useState(false);
  const [exportFileName, setExportFileName] = React.useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  //const [selectedRows, setSelectedRows] = useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selLoanObj, setSelLoanObj] = useState({});
  const [isOpenDocRet, setIsOpenDocRet] = React.useState(false);
  const [docData, setDocData] = React.useState([]);

  const dispatch = useDispatch();

  const { session_token, teamInt,teamChangeFlag, uid, isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  const { loans, pageIndex, pageSize, totalCount, sortBy, filters, backToList } = useSelector(state => {
    return {
        ...state.loansReducer
    }
  });

  //let { batchId } = useParams();
  //console.log("batchId : "+batchId);
  //let { batchRec } = props;
  console.log("backToList : "+backToList);

  const onLoanContribBtnClick = (e,obj) =>{
    console.log("onLoanContribBtnClick");
    setSelLoanObj(obj);
    setIsOpen(true);
  }

  let contribBtn = {
    Header: "Contrib",
    show : true, 
    width: 55,
    //id: 'colViewWireDetail',
    accessor: row => row.attrbuiteName,
    disableFilters: true,
    //filterable: false, // Overrides the table option
    Cell: obj => {
      //console.log(obj.row);
      let loanObj = obj.row.original;
      let enableVal = true;
      if(loanObj.proposedLoanId==null || loanObj.proposedLoanId===0 || loanObj.customerId==null || loanObj.customerId===0){
        enableVal = false;
      }
      return (
        <button type="button" onClick={(e)=>{onLoanContribBtnClick(e, loanObj)}} className={`btn btn-link btn-sm ${enableVal ? "" : "disabled"}`}>
          <Icon.Upload />
        </button>
      );
    }
  };

  let loanDocsBtn = {
    Header: "LoanDocs",
    show : true, 
    width: 55,
    //id: 'colViewWireDetail',
    accessor: row => row.attrbuiteName,
    disableFilters: true,
    //filterable: false, // Overrides the table option
    Cell: obj => {
      //console.log(obj.row);
      let loanObj = obj.row.original;
      let enableVal = true;
      /*
      if(loanObj.proposedLoanId==null || loanObj.proposedLoanId===0 || loanObj.customerId==null || loanObj.customerId===0){
        enableVal = false;
      }
      */
      return (
        <Link
          to={{
            pathname: `${process.env.PUBLIC_URL}/loandocs/${loanObj.proposedLoanId}`,
            state: obj.row.original
          }}
        >
          <Icon.Book />
        </Link>
      );
    }
  };

  let editableContent = false;
  if(pageSize<1000){
    editableContent = true;
  }

  let columnDefs = [];
    if(isInternalUser){
      columnDefs.push({
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
          return (
            <Link
              to={{
                pathname: `${process.env.PUBLIC_URL}/loandetails/${loanObj.Loan_Account_Number}`,
                state: obj.row.original
              }}
            >
              <Icon.Edit />
            </Link>
          );
        }
      });
      console.log("Internal Team : "+teamInt);
      if(teamInt==="teamd"){
        columnDefs.push({
          field: "PrimaryBorrowers",
          Header: "Borrower Name",
          accessor: "PrimaryBorrowers"
        },{
          field: "sba_number",
          Header: "SBA Number",
          accessor: "sba_number"
        },
        {
          field: "OriginalLoanAmount",
          Header: "Original Loan Amount",
          accessor: "OriginalLoanAmount",
          //disableFilters: true,
          Filter: AmountRangeColumnFilter,
          /*options: [
            { value: '=',     label: '=' },
            { value: '>',     label: '>' },
            { value: '<',     label: '<' },
            { value: '><',    label: '><' }
          ],*/
          Cell: props => {
            if(props.value===null || props.value===undefined) {
              return null;
            }
            return (
              <div style={{textAlign: "right"}}>
                {toCurrency(props.value)}
              </div>
            )
          }
        },
        {
          field: "status",
          Header: "Status",
          accessor: "status",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:StatusAutoTeamDOptions
          //columnType:'list',
          //columnOptions:StatusTeamDOptions
        },
        {
          field: "DisbursementDate",
          Header: "Disbursement Date",
          accessor: "DisbursementDate",
          disableFilters: true
        },
        {
          field: "EndofCoveredPeriod",
          Header: "End of Covered Period",
          accessor: "EndofCoveredPeriod",
          disableFilters: true
        },
        {
          field: "TeamDmember",
          Header: "Team D Member",
          accessor: "TeamDmember",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:TeamDAssignedOptions,
          editable:true,
          columnType:'list',
          columnOptions:TeamDAssignedOptions
        },
        {
          field: "callernotes",
          Header: "Caller Notes",
          accessor: "callernotes",
          editable: editableContent,
          columnType:'textarea'
        },
        {
          field: "comment",
          Header: "Comment",
          accessor: "comment",
          editable: editableContent,
          columnType:'textarea'
        },
        {
          field: "statusIndication",
          Header: "Manual Status",
          accessor: "statusIndication",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:StatusTeamDOptions,
          editable:true,
          columnType:'list',
          columnOptions:StatusTeamDOptions
        },
        {
          field: "AppliedAt",
          Header: "Applied At",
          accessor: "AppliedAt",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:AppliedAtTeamDOptions
        },
        {
          field: "Email",
          Header: "Email",
          accessor: "Email",
          Cell: obj => {
            //console.log(obj.row);
            let loanObj = obj.row.original;
            let emailVal = loanObj.Email;
            return (
              <a href={'mailto:'+emailVal}>
                {loanObj.Email}
              </a>
            );
          }
        });
      } 
    } 
  
  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    let oldData = loans;
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
      sba_number:modifiedRec.sba_number
    });
    //setData(newData);
    dispatch({
      type:'UPDATELOANLIST',
      payload:{
        loans:newData
      }
    });
  }

  const saveLoanDetails = async (obj) => {
    console.log("Save Loan Details");
    console.log(obj);
    try {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': session_token
        }
      };
      let tmpLoanObj = obj;
      if(tmpLoanObj.sba_number === "" || tmpLoanObj.sba_number === null || tmpLoanObj.sba_number === undefined){
        //alert("ALD_ID is empty! So, can not able to save the loan.");
        console.log("sba_number is empty! So, can not able to save the loan.");
        //return false;
      } else {
        let ald_id = tmpLoanObj.sba_number;
        //tmpLoanObj.LastUpdateUser = uid;
        tmpLoanObj.LastModifyDate = moment().format('YYYY-MM-DD');
        let res = await axios.put(SetLoansForgive_Url+'/'+ald_id, tmpLoanObj, options);
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
  }, [loans])

  useEffect(() => {
    if (downloadAllLoans) {
      setDownloadAllLoans(!downloadAllLoans);
    }
  }, [downloadAllLoans]);

  useEffect(() => {
    if (downloadStoreLoans) {
      setDownloadStoreLoans(!downloadStoreLoans);
    }
  }, [downloadStoreLoans]);
  
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

      let url = LoansD_Url;
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
        if(isInternalUser && teamInt==="teamc"){
          let starttmpUrl = " and (SBALoanNumber > 1)";
          let fullqst = encodeURIComponent(starttmpUrl);
          url += fullqst;
        }
      } else {
        if(isInternalUser && teamInt==="teamc"){
          let starttmpUrl = "(SBALoanNumber > 1)";
          let fullqst = encodeURIComponent(starttmpUrl);
          url += "&filter="+fullqst;
        }
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
        type:'UPDATELOANLIST',
        payload:{
          pageIndex:pageIndex,
          pageSize:pageSize,
          totalCount:totalCnt,
          sortBy : sortBy,
          filters : filters,
          loans:res.data.resource
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
  }, [ dispatch, session_token, teamInt]);

  //// Start Code for Wire To OFAC Value /////
  const onAllLoansExportBtnClick = async (e,exportType) => {
    const options = {
      headers: {
        'X-DreamFactory-API-Key': API_KEY,
        'X-DreamFactory-Session-Token': session_token
      }
    };
    let url = Loans_Url;
    if(isInternalUser && teamInt==="teamd"){
      url = LoansD_Url;
    }
    url += "?include_count=true";
    let filtersTemp = filters;
    if(filtersTemp.length>0){
      console.log("filters");
      console.log(filtersTemp);
      url += "&filter=";
      url += buildFilterUrl(filtersTemp);
    }
    if(sortBy.length>0){
      console.log(sortBy);
      url += buildSortByUrl(sortBy);
    }

    let tmpPageSize = 1000;
    let tmpPageIndex = 0;
    let totalRetRecCount = 0;
    let totalRecCount = 1000;
  
    let allloandata = [];
    url += "&limit="+tmpPageSize;
    url += "&offset=0";
    let lastOffset = 0;

    let flag = true;
    while(parseInt(totalRetRecCount) < parseInt(totalRecCount)){
      //console.log("At Start");
      console.log("totalRetRecCount : "+totalRetRecCount);
      console.log("totalRecCount : "+totalRecCount);
      try {
        let res = await axios.get(url, options);
        //console.log(res.data.resource);
        let loanArrData = res.data.resource;
        totalRetRecCount +=  loanArrData.length;
        //allloandata = loanArrData; ///merge array
        allloandata = allloandata.concat(loanArrData);
        totalRecCount = parseInt(res.data.meta.count);
        tmpPageIndex++;

        /// If Next is not equal to length+Offset then break out of it
        if(res.data.meta.next){
          let nextOffsetRecCnt = parseInt(res.data.meta.next);
          console.log("nextOffsetRecCnt : "+nextOffsetRecCnt);
          console.log("rec Cnt : "+loanArrData.length);
          console.log("lastOffset : "+lastOffset);
          if((loanArrData.length + lastOffset) !== nextOffsetRecCnt){
            flag = false;
            console.log("Next is not equal to length+Offset then break out of it");
            break;
          }
        }

        let offset = tmpPageSize * tmpPageIndex;
        url = url.substr(0, url.lastIndexOf("=") + 1);
        url += offset;
        console.log("At End While");
        console.log("totalRetRecCount : "+totalRetRecCount);
        console.log("totalRecCount : "+totalRecCount);
        console.log("totalRetRecCount < totalRecCount");
        lastOffset = offset;

        if(totalRetRecCount < totalRecCount){
          console.log("Continue with one more request offset: "+offset);
        } else {
          console.log("Done Break out of loop");
          //break;
        }
      } catch (err) {
        // Error handling here
        //throw new Error('Unable to get a token.')
        console.log("Something went wrong with the request!");
        alert("Something went wrong  with the request!");
      }
    }
    if(allloandata==null){
      allloandata = [];
    }
    if(!isInternalUser) {
      if(exportType !== "allFields"){
        allloandata = buildExternalLoanExportDetailList(allloandata);
      } else {
        allloandata = buildExternalLoanExportAllDetailList(allloandata);
      }
    }
    if(flag){
      alert("Downloaded "+allloandata.length+" record completed successfully. Upon ok writing to excel will still take around a minute.");
      setAllLoansData(allloandata);
      setDownloadAllLoans(!downloadAllLoans);
    } else {
      console.log("Something went wrong! File has not been created");
      alert("Something went wrong! File has not been created.");
    }
  }

  let headerTitle = "Loan List";

  console.log("loans", loans);
  console.log("isRefresh", isRefresh);
  
  if(isInternalUser && sortBy.length===0 && teamInt!=="teamd"){
    dispatch({
      type:'UPDATELOANLIST',
      payload:{
        sortBy : [{ id: "ALDLoanApplicationNumberOnly", desc: true }]
      }
    });
  }

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
      <LoanListView
        data={loans}
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
    if(loans.length > 0){
      console.log(dataType);
      let newArray = [],exportFileNameVal="";
      if(dataType==="List"){
        exportFileNameVal = "LoanList";
        newArray = loans.map((data) => {
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
            } else if(teamInt==="teamd"){
              return {
                'SBA_Account_Number': data.SBA_Account_Number,
                'Loan_Account_Number' : data.Loan_Account_Number,
                'Business_Legal_Name' : data.Business_Legal_Name,
                'status'    : data.status,
                'original_loan_amount' : data.original_loan_amount,
                'forgive_amount' : data.forgive_amount,
                'created'        : data.created,
                'SBAfunding_date' : data.SBAfunding_date,
                'Loan_Status'     : data.Loan_Status,
                'Forgiveness_Status' : data.Forgiveness_Status,
                'Next_Payment_Due_Date'        : data.Next_Payment_Due_Date,
                'comment'     : data.comment,
                'TeamDmember' : data.TeamDmember,
                'statusIndication' : data.statusIndication
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
          newArray = loans;
        } else {
          newArray = buildExternalLoanExportDetailList(loans);
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

  const showModal = () => {
      setIsOpen(true);
  };

  const hideModal = () => {
      setIsOpen(false);
  };

  const showDocRetModal = () => {
      setIsOpenDocRet(true);
  };

  const hideDocRetModal = () => {
      setIsOpenDocRet(false);
  };

  return (
    <React.Fragment>
      <LoanFileUpload isOpenRet={isOpenDocRet} selLoanObj={selLoanObj} docRetData={docData} hideRetModal={hideDocRetModal} isRefresh={isRefresh} setIsRefresh={setIsRefresh} />
      <LoanFileUploadWizard isOpen={isOpen} hideModal={hideModal} selLoanObj={selLoanObj} 
      setDocData={setDocData} showDocRetModal={showDocRetModal} />
      <div className="container" style={{marginLeft:"0px", width:"100%", maxWidth:"100%"}}>
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <div>
                <h3 style={{float:"left"}} className="title-center">{headerTitle}</h3>
                <div style={{float:"right"}} className="btnCls">
                <React.Fragment>
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

export default LoanlistD;
