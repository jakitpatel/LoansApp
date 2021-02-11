import React, { useState, useEffect, useRef } from "react";
import { Redirect, useParams, useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
//import Listview from "./../../Listview/Listview";
import LoanListView from "./LoanListView.js";
import * as Icon from "react-feather";
import "./Loanlist.css";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import {API_KEY, Loans_Url, env} from './../../../const';
import {buildSortByUrl, buildPageUrl, buildFilterUrl} from './../../Functions/functions.js';
import SelectColumnFilter from './../../Filter/SelectColumnFilter.js';
import {SBAOptions, BrokerOptions, StatusOptions, applicationStatusOptions} from './../../../commonVar.js';


function Loanlist(props) {
  let history = useHistory();

  const listExportLink = useRef(null);
  const listDetailsExportLink = useRef(null);
  const allLoansListExportLink = useRef(null);
  
  // We'll start our table without any data
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

  const [selWireObj, setSelWireObj] = useState({});

  const dispatch = useDispatch();

  const { session_token, teamInt, uid, name, isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  const { loans, pageIndex, pageSize, sortBy, filters, backToList } = useSelector(state => {
    return {
        ...state.loansReducer
    }
  });

  let { batchId } = useParams();
  console.log("batchId : "+batchId);
  let { batchRec } = props;
  console.log("backToList : "+backToList);

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
          //Filter: SelectColumnFilter,
          //filter: 'includes'
        },
        {
          field: "MentorAssigned",
          Header: "Mentor Assigned",
          accessor: "MentorAssigned"
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
          field: "R2_TaxID",
          Header: "EIN#",
          accessor: "R2_TaxID"
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
          accessor: "MentorAssigned"
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
            accessor: "MentorAssigned"
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
                pathname: `${process.env.PUBLIC_URL}/loandetails/${loanObj.ALDLoanApplicationNumberOnly}`,
                state: obj.row.original
              }}
            >
              <Icon.Edit />
            </Link>
          );
        }
      },{
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
        options:SBAOptions
      },
      {
        field: "statusIndication",
        Header: "Overall Status",
        accessor: "statusIndication"
      });
    }
  
  useEffect(() => {
    if (downloadAllLoans) {
      setDownloadAllLoans(false);
      setTimeout(() => {
        allLoansListExportLink.current.link.click();
      }, 1000);
    }
  }, [downloadAllLoans, allLoansData]);

  
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
          return {
            'ALDLoanApplicationNumberOnly' : data.ALDLoanApplicationNumberOnly,
            'ReviewerAssigned': data.ReviewerAssigned,
            'MentorAssigned' : data.MentorAssigned,
            'ApplicationCreatedDate' : data.ApplicationCreatedDate,
            'LastModifyDate' : data.LastModifyDate,
            'Primary Borrower' : data.PrimaryBorrowers,
            'TotalRequest' : data.R2_LoanAmount,
            'StatusAComments': data.StatusAComments,
            'ApplicationStatus' : data.statusIndication,
            'SBAStatus' : data.SBAStatus,
            'Broker'    : data.broker,
            'EIN#': data.R2_TaxID,
            'Borrower Address': data.Address1,
            'DocumentsSent': data.DocumentsSent,
            'DocumentsRequired' : data.DocumentsRequired
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
      if(isInternalUser){
        setLoanDetailsData(loanArray);
      } else {
        let newDetailArray = loanArray.map((data) => {
            let amt = data.R2_LoanAmount;
            if(amt!==null) {
              amt = new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(amt);
            }
            return {
              'ALDLoanApplicationNumberOnly' : data.ALDLoanApplicationNumberOnly,
              'BusinessName' : data.PrimaryBorrower,
              'R2_LoanAmount': amt,
              'SBAStatus' : data.SBAStatus,
              'ErrorMessage' : data.ErrorMessage,
              'MentorAssigned' : data.MentorAssigned,
              'MentorEmail' : data.MentorEmail,
              'MentorPhone' : data.MentorPhone,
              'LastModifyDate' : data.LastModifyDate,
              'SBALoanNumber': data.SBALoanNumber,
              'statusIndication' : data.statusIndication,
              'businessIndication' : data.businessIndication,
              'personalIndication' : data.personalIndication,
              'ownershipIndication' : data.ownershipIndication,
              'documentIndication' : data.documentIndication,
              'finacialSeachIndication' : data.finacialSeachIndication
            }
        });
        setLoanDetailsData(newDetailArray);
      }
      dispatch({
        type:'UPDATELOANLIST',
        payload:{
          pageIndex:pageIndex,
          pageSize:pageSize,
          sortBy : sortBy,
          filters : filters,
          loans:loanArray
        }
      });
      
      // Your server could send back total page count.
      // For now we'll just fake it, too
      let totalCnt = res.data.meta.count;
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
  async function onAllLoansExportBtnClick(){
    const options = {
      headers: {
        'X-DreamFactory-API-Key': API_KEY,
        'X-DreamFactory-Session-Token': session_token
      }
    };
    let url = Loans_Url;

    url += "?include_count=true";
    if(filters.length>0){
      console.log("filters");
      console.log(filters);
      url += "&filter=";
      url += buildFilterUrl(filters);
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
    setAllLoansData(allloandata);
    setDownloadAllLoans(true);
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
  const initialState = {
    pageIndex : 0,
    //pageIndex : pageIndex,
    //pageSize : 10,
    pageSize : pageSize,
    sortBy : sortBy, //[{ id: "wireID", desc: true }],
    filters : filters,
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

  return (
    <React.Fragment>
      <div className="container" style={{marginLeft:"0px", width:"100%", maxWidth:"100%"}}>
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <h3 className="title-center">{headerTitle}</h3>
            <div className="btnCls">
            <React.Fragment>
                <button type="button" style={{ float: "right" }} onClick={onAllLoansExportBtnClick} className={`btn btn-primary btn-sm`}>
                Export All Loans
                </button>
                <button type="button" style={{ float: "right", marginRight:"5px" }} onClick={(e)=> {onLoanListExport(e,"ListDetails")}} className={`btn btn-primary btn-sm`}>
                  Export List Details
                </button>
                <button type="button" style={{ float: "right", marginRight:"5px" }} onClick={(e)=> {onLoanListExport(e,"List")}} className={`btn btn-primary btn-sm`}>
                  Export List
                </button>
                <button type="button" style={{ float: "right", marginRight:"5px" }} onClick={(e)=> {setIsRefresh(!isRefresh);}} className={`btn btn-primary btn-sm`}>
                  <Icon.RefreshCw />
                </button>
                
                <CSVLink
                      data={loanListData}
                      headers={headerName}
                      uFEFF={false}
                      ref={listExportLink}
                      filename={loanFileName}
                      className={`btn btn-primary btn-sm invisible`}
                      style={{ float: "right" }}
                      target="_blank"
                      /*onClick={(event, done) => {
                        return onWireExport(event, done);
                      }
                    }*/
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
                      /*onClick={(event, done) => {
                        return onWireExport(event, done);
                      }
                    }*/
                    >Export</CSVLink>
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
