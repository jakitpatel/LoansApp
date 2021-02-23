import React, { useState, useEffect, useRef } from "react";
import { Redirect, useParams, useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
//import Listview from "./../../Listview/Listview";
import LoanListView from "./LoanListView.js";
import * as Icon from "react-feather";
import "./Loanlist.css";
import axios from 'axios';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import {API_KEY, Loans_Url, env, SetLoans_Url, Loan_Upload_Doc_Url} from './../../../const';
import {buildSortByUrl, buildPageUrl, buildFilterUrl, buildExternalLoanExportDetailList} from './../../Functions/functions.js';
import SelectColumnFilter from './../../Filter/SelectColumnFilter.js';
import {SBAOptions, BrokerOptions, StatusOptions, applicationStatusOptions} from './../../../commonVar.js';
import ExcelExport from './../../ExcelExport/ExcelExport';
import { MentorAssignedOptions, ReviewerAssignedOptions, ContribDocTypeOptions} from './../../../commonVar.js';
import LoanFileUpload from './LoanFileUpload';
import Modal from "react-bootstrap/Modal";

function Loanlist(props) {
  let history = useHistory();

  const listExportLink = useRef(null);
  const listDetailsExportLink = useRef(null);
  const allLoansListExportLink = useRef(null);
  
  // We'll start our table without any data
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const [allLoansData, setAllLoansData] = React.useState([]);
  const [loanListData, setLoanListData] = React.useState([]);
  const [loanDetailsData, setLoanDetailsData] = React.useState([]);
  const [filtersarr, setFiltersarr] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const [downloadAllLoans, setDownloadAllLoans] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [docTypeVal, setDocTypeVal] = React.useState("");
  const [selLoanObj, setSelLoanObj] = useState({});

  const dispatch = useDispatch();

  const { session_token, teamInt, uid, name, isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  const { loans, pageIndex, pageSize, totalCount, sortBy, filters, filtersA, filtersB, filtersC, backToList } = useSelector(state => {
    return {
        ...state.loansReducer
    }
  });

  let { batchId } = useParams();
  console.log("batchId : "+batchId);
  let { batchRec } = props;
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
      return (
        <button type="button" onClick={(e)=>{onLoanContribBtnClick(e, loanObj)}} className={`btn btn-link btn-sm`}>
          <Icon.Upload />
        </button>
      );
    }
  };

  let columnDefs = [];
    if(isInternalUser){
      columnDefs.push(contribBtn,{
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
                pathname: `${process.env.PUBLIC_URL}/loandetails/${loanObj.ALDLoanApplicationNumberOnly}`,
                state: obj.row.original
              }}
            >
              <Icon.Edit />
            </Link>
          );
        }
      });
      console.log("Internal Team : "+teamInt);
      if(teamInt==="teama"){
        columnDefs.push({
          field: "ALDLoanApplicationNumberOnly",
          Header: "Application #",
          accessor: "ALDLoanApplicationNumberOnly",
          show: false
        },
        {
          field: "broker",
          Header: "Broker",
          accessor: "broker",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:BrokerOptions
        },
        {
          field: "ReviewerAssigned",
          Header: "Reviewer Assigned",
          accessor: "ReviewerAssigned",
          editable:true,
          columnType:'list',
          columnOptions:ReviewerAssignedOptions
          //Filter: SelectColumnFilter,
          //filter: 'includes'
        },
        {
          field: "MentorAssigned",
          Header: "Mentor Assigned",
          accessor: "MentorAssigned",
          editable:true,
          columnType:'list',
          columnOptions:MentorAssignedOptions
        },
        {
          field: "ApplicationCreatedDate",
          Header: "Start Date",
          accessor: "ApplicationCreatedDate",
          disableFilters: true,
        },
        {
          field: "LastModifyDate",
          Header: "Last Update Date",
          accessor: "LastModifyDate",
          disableFilters: true,
        },
        {
          name: "PrimaryBorrowers",
          field: "PrimaryBorrowers",
          Header: "Primary Borrower",
          accessor: "PrimaryBorrowers"
        },
        {
          field: "FirstLoanAmount",
          Header: "Total Request",
          accessor: "FirstLoanAmount",
          disableFilters: true,
          Cell: props => {
            if(props.value===null || props.value===undefined) {
              return null;
            }
            return (
              <div style={{textAlign: "right"}}>
              {new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(props.value)}
              </div>
            )
            // '$100.00'
          }
        },
        {
          field: "StatusAComments",
          Header: "Loan Review Status Comments",
          accessor: "StatusAComments"
        },
        {
          field: "R2_ApplicationStatus",
          Header: "Application Status",
          accessor: "R2_ApplicationStatus",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:applicationStatusOptions
        },
        {
          field: "statusIndication",
          Header: "statusIndication",
          accessor: "statusIndication",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:StatusOptions
        },
        {
          field: "SBAStatus",
          Header: "SBA Status",
          accessor: "SBAStatus",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:SBAOptions
        },
        {
          field: "TaxID",
          Header: "EIN#",
          accessor: "TaxID"
        },
        {
          field: "Address1",
          Header: "Borrower Address",
          accessor: "Address1"
        },
        {
          field: "DocumentsSent",
          Header: "Docs Sent",
          accessor: "DocumentsSent"
        },
        {
          field: "DocumentsRequired",
          Header: "Docs Required",
          accessor: "DocumentsRequired"
        });
      } else if(teamInt==="teamb"){
        columnDefs.push({
          field: "ReviewerAssigned",
          Header: "Reviewer Assigned",
          accessor: "ReviewerAssigned",
          editable:true,
          columnType:'list',
          columnOptions:ReviewerAssignedOptions
          //Filter: SelectColumnFilter,
          //filter: 'includes'
        },
        {
          field: "ALDLoanApplicationNumberOnly",
          Header: "Application #",
          accessor: "ALDLoanApplicationNumberOnly",
          show: false
        },
        {
          field: "broker",
          Header: "Broker",
          accessor: "broker",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:BrokerOptions
        },
        {
          name: "PrimaryBorrowers",
          field: "PrimaryBorrowers",
          Header: "Primary Borrower",
          accessor: "PrimaryBorrowers"
        },
        {
          field: "SBAStatus",
          Header: "SBA Status",
          accessor: "SBAStatus",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:SBAOptions
        },
        {
          field: "ErrorMessage",
          Header: "ErrorMessage",
          accessor: "ErrorMessage"
        },
        {
          field: "StatusBComments",
          Header: "StatusBComments",
          accessor: "StatusBComments"
        },
        {
          field: "MentorAssigned",
          Header: "Mentor Assigned",
          accessor: "MentorAssigned",
          editable:true,
          columnType:'list',
          columnOptions:MentorAssignedOptions
        },
        {
          field: "StatusAComments",
          Header: "Loan Review Status Comments",
          accessor: "StatusAComments"
        },
        {
          field: "R2_ApplicationStatus",
          Header: "Application Status",
          accessor: "R2_ApplicationStatus",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:applicationStatusOptions
        },
        {
          field: "statusIndication",
          Header: "statusIndication",
          accessor: "statusIndication",
          Filter: SelectColumnFilter,
          filter: 'includes',
          options:StatusOptions
        },
        {
          field: "teambmember",
          Header: "teambmember",
          accessor: "teambmember"
        });
      } else if(teamInt==="teamc"){
        columnDefs.push({
            field: "ReviewerAssigned",
            Header: "Reviewer Assigned",
            accessor: "ReviewerAssigned",
            editable:true,
            columnType:'list',
            columnOptions:ReviewerAssignedOptions
            //Filter: SelectColumnFilter,
            //filter: 'includes'
          },
          {
            field: "ALDLoanApplicationNumberOnly",
            Header: "Application #",
            accessor: "ALDLoanApplicationNumberOnly",
            show: false
          },
          {
            name: "PrimaryBorrowers",
            field: "PrimaryBorrowers",
            Header: "Primary Borrower",
            accessor: "PrimaryBorrowers"
          },
          {
            field: "SBAStatus",
            Header: "SBA Status",
            accessor: "SBAStatus",
            Filter: SelectColumnFilter,
            filter: 'includes',
            options:SBAOptions
          },
          {
            field: "MentorAssigned",
            Header: "Mentor Assigned",
            accessor: "MentorAssigned",
            editable:true,
            columnType:'list',
            columnOptions:MentorAssignedOptions
          },
          {
            field: "StatusCComments",
            Header: "StatusCComments",
            accessor: "StatusCComments"
          },
          {
            field: "R2_ApplicationStatus",
            Header: "Application Status",
            accessor: "R2_ApplicationStatus",
            Filter: SelectColumnFilter,
            filter: 'includes',
            options:applicationStatusOptions
          });
      }
    } else {
      columnDefs.push(contribBtn,{
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
                pathname: `${process.env.PUBLIC_URL}/loandetails/${loanObj.ALDLoanApplicationNumberOnly}`,
                state: obj.row.original
              }}
            >
              <Icon.Edit />
            </Link>
          );
        }
      },
      {
        field: "ApplicationCreatedDate",
        Header: "Application Created on",
        accessor: "ApplicationCreatedDate"
        //Filter: SelectColumnFilter,
        //filter: 'includes'
      },{
        field: "businessName",
        Header: "Business Name",
        accessor: "businessName"/*,
        Cell: props => {
          let loanObj = props.row.original;
          if(props.value===null) {
            return loanObj.businessName;
          } else {
            return props.value;
          }
        }*/
        //Filter: SelectColumnFilter,
        //filter: 'includes'
      },
      {
        field: "broker",
        Header: "Broker",
        accessor: "broker",
        Filter: SelectColumnFilter,
        filter: 'includes',
        options:BrokerOptions
      },
      {
        field: "brokerRep",
        Header: "brokerRep",
        accessor: "brokerRep"
      },
      {
        field: "brokerComments",
        Header: "brokerComments",
        accessor: "brokerComments"
      },
      {
        name: "ALDLoanApplicationNumberOnly",
        field: "ALDLoanApplicationNumberOnly",
        Header: "Loan Application #",
        accessor: "ALDLoanApplicationNumberOnly"
      },
      {
        field: "R2_LoanAmount",
        Header: "Total Request",
        accessor: "R2_LoanAmount",
        disableFilters: true,
        Cell: props => {
          if(props.value===null) {
            return null;
          }
          return (
            <div style={{textAlign: "right"}}>
             {new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(props.value)}
            </div>
          )
          // '$100.00'
        }
      },
      {
        field: "MentorAssigned",
        Header: "Bank Contact",
        accessor: "MentorAssigned"
      },
      {
        field: "LastModifyDate",
        Header: "Last Modified",
        accessor: "LastModifyDate",
        disableFilters: true
      },
      {
        field: "SBALoanNumber",
        Header: "SBA Loan #",
        accessor: "SBALoanNumber"
      },
      {
        field: "SBAApprovalDate",
        Header: "SBA Approval Date",
        accessor: "SBAApprovalDate",
        disableFilters: true
      },
      {
        field: "SBAStatus",
        Header: "SBA Status",
        accessor: "SBAStatus",
        Filter: SelectColumnFilter,
        filter: 'includes',
        options:SBAOptions,
        width:190
      },
      {
        field: "statusIndication",
        Header: "Overall Status",
        accessor: "statusIndication",
        Filter: SelectColumnFilter,
        filter: 'includes',
        options:StatusOptions
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
      ALD_ID:modifiedRec.ALD_ID
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
      if(tmpLoanObj.ALD_ID === "" || tmpLoanObj.ALD_ID === null || tmpLoanObj.ALD_ID === undefined){
        //alert("ALD_ID is empty! So, can not able to save the loan.");
        console.log("ALD_ID is empty! So, can not able to save the loan.");
        //return false;
      } else {
        let ald_id = tmpLoanObj.ALD_ID;
        //tmpLoanObj.LastUpdateUser = uid;
        tmpLoanObj.LastModifyDate = moment().format('YYYY-MM-DD');
        let res = await axios.put(SetLoans_Url+'/'+ald_id, tmpLoanObj, options);
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
      /*
      setTimeout(() => {
        allLoansListExportLink.current.link.click();
      }, 1000);
      */
    }
  }, [downloadAllLoans]);
  
  function toCurrency(numberString) {
      let number = parseFloat(numberString);
      return number.toLocaleString('USD');
  }
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

      let url = Loans_Url;
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
        if(batchRec){
          url += " and ";
        } else {
          url += "&filter=";
        }
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
      console.log(res.data.resource);
      let loanArray = res.data.resource;
      //console.log(wireArray);
      //setData(wireArray);
      //let loanListExpArray = [];
      //loanListExpArray.push({});
      let newArray = loanArray.map((data) => {
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
              'SBAStatus' : data.SBAStatus,
              'MentorAssigned' : data.MentorAssigned,
              'StatusCComments': data.StatusCComments,
              'Application Status"' : data.R2_ApplicationStatus
            }
          }
        } else {
          let amt = data.R2_LoanAmount;
          if(amt!==null) {
            amt = new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(amt);
          }
          return {
            'ApplicationCreatedDate' : data.ApplicationCreatedDate,
            'BusinessName' : data.businessName,
            'LoanApplicationNumber': data.ALDLoanApplicationNumberOnly,
            'TotalRequest' : data.R2_LoanAmount,
            'MentorAssigned' : data.MentorAssigned,
            'LastModifyDate' : data.LastModifyDate,
            'SBALoanNumber': data.SBALoanNumber,
            'SBAApprovalDate': data.SBAApprovalDate,
            'SBAStatus' : data.SBAStatus,
            'Overall Status' : data.statusIndication
          }
        }
      });
      setLoanListData(newArray);
      let newDetailArray = [];
      if(isInternalUser){
        newDetailArray = loanArray;
        setLoanDetailsData(newDetailArray);
      } else {
        newDetailArray = buildExternalLoanExportDetailList(loanArray);
        setLoanDetailsData(newDetailArray);
      }
      let filterName = "filters";
      /*if(isInternalUser){
        if(teamInt==="teama"){
          filterName = "filtersA";
        } else if(teamInt==="teamb"){
          filterName = "filtersB";
        } else if(teamInt==="teamc"){
          filterName = "filtersC";
        }
      }*/
      let totalCnt = res.data.meta.count;

      dispatch({
        type:'UPDATELOANLIST',
        payload:{
          pageIndex:pageIndex,
          pageSize:pageSize,
          totalCount:totalCnt,
          sortBy : sortBy,
          //filters : filters,
          [filterName] : filters,
          loans:loanArray
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

  //// Start Code for Wire To OFAC Value /////
  const onAllLoansExportBtnClick = async (e,exportType) => {
    const options = {
      headers: {
        'X-DreamFactory-API-Key': API_KEY,
        'X-DreamFactory-Session-Token': session_token
      }
    };
    let url = Loans_Url;

    url += "?include_count=true";
    let filtersTemp = filters;
    /*if(isInternalUser){
      if(teamInt==="teama"){
        filtersTemp = filtersA;
      } else if(teamInt==="teamb"){
        filtersTemp = filtersB;
      } else if(teamInt==="teamc"){
        filtersTemp = filtersC;
      }
    }*/
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

    let res = await axios.get(url, options);
    //console.log(res.data.resource);
    let allloandata = res.data.resource;
    if(allloandata==null){
      allloandata = [];
    }
    if(isInternalUser){

    } else {
      //alert();
      if(exportType !== "allFields"){
        allloandata = buildExternalLoanExportDetailList(allloandata);
      }
    }
    setAllLoansData(allloandata);
    //setDownloadAllLoans(true);
    setDownloadAllLoans(!downloadAllLoans);
  }

  let headerTitle = "Loan List";

  console.log("loans", loans);
  console.log("isRefresh", isRefresh);
  
  if(isInternalUser && sortBy.length===0){
    dispatch({
      type:'UPDATELOANLIST',
      payload:{
        sortBy : [{ id: "ALDLoanApplicationNumberOnly", desc: true }]
      }
    });
  }
  let filterStateArr = filters;
  /*if(isInternalUser){
    if(teamInt==="teama"){
      filterStateArr = filtersA;
    } else if(teamInt==="teamb"){
      filterStateArr = filtersB;
    } else if(teamInt==="teamc"){
      filterStateArr = filtersC;
    }
  }
  //let filterStateArr = filters;
  
  if(isInternalUser && teamInt==="teamb"){
    let sbaStatusFlag = false;
    for (let i=0; i<filterStateArr.length; i++){
      if(filterStateArr[i].id==="SBAStatus"){
        sbaStatusFlag = true;
      }
    }
    if(!sbaStatusFlag){
      filterStateArr.push({
        id: "SBAStatus", 
        value: [
          { value: 'Further Research Required', label: 'Further Research Required' },
          { value: 'Submission Failed', label: 'Submission Failed' },
          { value: 'Failed Validation',  label: 'Failed Validation' },
          { value: 'Not Approved by SBA', label: 'Not Approved by SBA' }
        ]
      });
    }
  }*/
  
  const initialState = {
    pageIndex : 0,
    //pageIndex : pageIndex,
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
        //data={data}
        columnDefs={columnDefs}
        initialState={initialState}
        pageState={pageState}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        filtersarr={filtersarr}
        setFiltersarr={setFiltersarr}
        fetchData={fetchData}
        batchRec={batchRec}
        loading={loading}
        pageCount={pageCount}
        isRefresh={isRefresh}
        setIsRefresh={setIsRefresh}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        teamInt={teamInt}
        totalCount={totalCount}
      />
    );
  let loanFileName = "loanList.csv";
  let loanDetailsFileName = "loanListDetails.csv";
  let allLoanFileName = "AllloanList.csv";
  let headerName = ""+{name} - {uid};
  const onLoanListExport = (event, dataType) => {
    console.log("On Loan List Export Button Click");
    if(loans.length > 0){
      console.log(dataType);
      if(dataType==="List"){
        listExportLink.current.link.click();
      } else {
        listDetailsExportLink.current.link.click();
      }
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
    }
  };

  const handleDocTypeChange = (e) =>{
    setDocTypeVal(e.target.value);
  }

  return (
    <React.Fragment>
      <Modal show={isOpen} onHide={hideModal}>
        <Modal.Header>
          <Modal.Title>File Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <button style={{ width:"70px" }} className="btn btn-primary btn-sm" onClick={onLoanFileUpload}>Upload</button>
          <button style={{ width:"70px" }} className="btn btn-primary btn-sm" onClick={hideModal}>Cancel</button>
        </Modal.Footer>
      </Modal>
      <div className="container" style={{marginLeft:"0px", width:"100%", maxWidth:"100%"}}>
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <h3 className="title-center">{headerTitle}</h3>
            <div className="btnCls">
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
                {/*
                <button type="button" style={{ float: "right", marginRight:"5px" }} onClick={(e)=> {onLoanListExport(e,"ListDetails")}} className={`btn btn-primary btn-sm`}>
                  Export List Details
                </button>
                */}
                <ExcelExport hideEl={false} excelFile="loanListDetails" sheetName="loanListDetails" data={loanDetailsData}>
                  <button disabled={loanDetailsData.length === 0 ? true : false} type="button" style={{ float: "right", marginRight:"5px" }} className={`btn btn-primary btn-sm`}>
                    Export List Details
                  </button>
                </ExcelExport>
                <ExcelExport hideEl={false} excelFile="LoanList" sheetName="LoanList" data={loanListData}>
                  <button disabled={loanListData.length === 0 ? true : false} type="button" style={{ float: "right", marginRight:"5px" }} className={`btn btn-primary btn-sm`}>
                    Export List
                  </button>
                </ExcelExport>
                {/*
                <button type="button" style={{ float: "right", marginRight:"5px" }} onClick={(e)=> {onLoanListExport(e,"List")}} className={`btn btn-primary btn-sm`}>
                  Export List
                </button>
                */}
                <button type="button" style={{ float: "right", marginRight:"5px" }} onClick={(e)=> {setIsRefresh(!isRefresh);}} className={`btn btn-primary btn-sm`}>
                  <Icon.RefreshCw />
                </button>
                {/*
                <CSVLink
                      data={loanListData}
                      headers={headerName}
                      uFEFF={false}
                      ref={listExportLink}
                      filename={loanFileName}
                      className={`btn btn-primary btn-sm invisible`}
                      style={{ float: "right" }}
                      target="_blank"
                    >Export</CSVLink>
                <CSVLink
                      data={loanDetailsData}
                      headers={headerName}
                      uFEFF={false}
                      ref={listDetailsExportLink}
                      filename={loanDetailsFileName}
                      className={`btn btn-primary btn-sm invisible`}
                      style={{ float: "right" }}
                      target="_blank"
                    >Export</CSVLink>
                */}
                <CSVLink
                      data={allLoansData}
                      //headers={headerName}
                      uFEFF={false}
                      ref={allLoansListExportLink}
                      filename={allLoanFileName}
                      className={`btn btn-primary btn-sm invisible`}
                      style={{ float: "right" }}
                      target="_blank"
                    ></CSVLink>
              </React.Fragment>
              <div style={{ clear:"both"}}></div>
            </div>
            {disCmp}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Loanlist;
