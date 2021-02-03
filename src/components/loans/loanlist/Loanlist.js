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


function Loanlist(props) {
  let history = useHistory();

  const listExportLink = useRef(null);
  const listDetailsExportLink = useRef(null);

  // We'll start our table without any data
  const [loanListData, setLoanListData] = React.useState([]);
  const [filtersarr, setFiltersarr] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const [isRefresh, setIsRefresh] = useState(false);
  const [wireText, setWireText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const [selWireObj, setSelWireObj] = useState({});

  const dispatch = useDispatch();

  const { session_token, uid, name, isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  const { loans, pageIndex, pageSize, backToList } = useSelector(state => {
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
      },{
        field: "WFtaxID",
        Header: "WFtaxID",
        accessor: "WFtaxID",
        show: false
      },
      {
        field: "broker",
        Header: "broker",
        accessor: "broker",
        //Filter: SelectColumnFilter,
        //filter: 'includes'
      },
      {
        name: "businessName",
        field: "businessName",
        Header: "businessName",
        accessor: "businessName"
      },
      /*{
        field: "createDate",
        Header: "createDate",
        accessor: "createDate"
      },*/
      {
        field: "ReviewerAssigned",
        Header: "ReviewerAssigned",
        accessor: "ReviewerAssigned"
      },
      {
        field: "MentorAssigned",
        Header: "MentorAssigned",
        accessor: "MentorAssigned"
      },
      {
        field: "LoanApplicationNumber",
        Header: "LoanApplicationNumber",
        accessor: "LoanApplicationNumber"
      },
      {
        field: "LoanAmount",
        Header: "LoanAmount",
        accessor: "LoanAmount",
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
        field: "PrimaryBorrower",
        Header: "PrimaryBorrower",
        accessor: "PrimaryBorrower"
      },
      {
        field: "TotalRequest",
        Header: "TotalRequest",
        accessor: "TotalRequest"
      },
      {
        field: "FileStatusUpdateComments",
        Header: "FileStatusUpdateComments",
        accessor: "FileStatusUpdateComments"
      },
      {
        field: "ApplicationStatus",
        Header: "ApplicationStatus",
        accessor: "ApplicationStatus"
      },
      {
        field: "ImportStatus",
        Header: "ImportStatus",
        accessor: "ImportStatus"
      },
      {
        field: "DocumentsSent",
        Header: "DocumentsSent",
        accessor: "DocumentsSent"
      },
      {
        field: "DocumentsRequired",
        Header: "DocumentsRequired",
        accessor: "DocumentsRequired"
      },
      {
        field: "ASE_Status",
        Header: "ASE_Status",
        accessor: "ASE_Status"
      },
      {
        field: "ErrorMessage",
        Header: "ErrorMessage",
        accessor: "ErrorMessage"
      });
    } else {
      columnDefs.push({
        field: "ALDLoanApplicationNumberOnly",
        Header: "LoanApplicationNumber",
        accessor: "ALDLoanApplicationNumberOnly"
        //Filter: SelectColumnFilter,
        //filter: 'includes'
      },{
        field: "PrimaryBorrower",
        Header: "PrimaryBorrower",
        accessor: "PrimaryBorrower",
        Cell: props => {
          let loanObj = props.row.original;
          if(props.value===null) {
            return loanObj.businessName;
          } else {
            return props.value;
          }
        }
        //Filter: SelectColumnFilter,
        //filter: 'includes'
      },
      {
        name: "R2_LoanAmount",
        field: "R2_LoanAmount",
        Header: "R2_LoanAmount",
        accessor: "R2_LoanAmount",
        disableFilters: true,
        // provide custom function to format props 
        Cell: props => {
          if(props.value===null) {
            return null;
          }
          return (
            <div style={{textAlign: "right"}}>
             { new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(props.value)}
            </div>
          )
          // '$100.00'
        }
      },
      {
        field: "MentorAssigned",
        Header: "BankContact",
        accessor: "MentorAssigned"
      },
      {
        field: "LastModifyDate",
        Header: "LastModifyDate",
        accessor: "LastModifyDate",
        disableFilters: true
      },
      {
        field: "SBAStatus",
        Header: "SBAStatus",
        accessor: "SBAStatus"
      },
      {
        field: "SBALoanNumber",
        Header: "SBALoanNumber",
        accessor: "SBALoanNumber"
      });
    }
  
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
        return {
          'broker' : data.broker,
          'businessName' : data.businessName,
          'ReviewerAssigned': data.ReviewerAssigned,
          'MentorAssigned' : data.MentorAssigned,
          'LoanApplicationNumber' : data.LoanApplicationNumber,
          'LoanAmount': data.LoanAmount,
          'PrimaryBorrower' : data.PrimaryBorrower,
          'TotalRequest' : data.TotalRequest,
          'FileStatusUpdateComments': data.FileStatusUpdateComments,
          'ApplicationStatus' : data.ApplicationStatus,
          'ImportStatus' : data.ImportStatus,
          'DocumentsSent': data.DocumentsSent,
          'DocumentsRequired' : data.DocumentsRequired,
          'ASE_Status' : data.ASE_Status,
          'ErrorMessage': data.ErrorMessage
        }
      });
      setLoanListData(newArray);
      dispatch({
        type:'UPDATELOANLIST',
        payload:{
          pageIndex:pageIndex,
          pageSize:pageSize,
          loans:loanArray
        }
        //type:'SETWIRES',
        //payload:wireArray
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

  let headerTitle = "Loan List";

  console.log("loans", loans);
  console.log("isRefresh", isRefresh);
  const initialState = {
    sortBy : [], //[{ id: "wireID", desc: true }],
    pageSize : 10,
    pageIndex : 0
    //pageSize : pageSize,
    //pageIndex : pageIndex
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

  let headerName = ""+{name} - {uid};
  return (
    <React.Fragment>
      <div className="container" style={{marginLeft:"0px", width:"100%", maxWidth:"100%"}}>
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <h3 className="title-center">{headerTitle}</h3>
            <div className="btnCls">
            <React.Fragment>
                <button type="button" style={{ float: "right" }} onClick={(e)=> {onLoanListExport(e,"ListDetails")}} className={`btn btn-primary btn-sm`}>
                  Export List Details
                </button>
                <button type="button" style={{ float: "right", marginRight:"5px" }} onClick={(e)=> {onLoanListExport(e,"List")}} className={`btn btn-primary btn-sm`}>
                  Export List
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
                      data={loans}
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
