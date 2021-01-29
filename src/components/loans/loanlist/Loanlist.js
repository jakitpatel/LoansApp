import React, { useState, useEffect, useRef } from "react";
import { Redirect, useParams, useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
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

  // We'll start our table without any data
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

  const { session_token, uid } = useSelector(state => {
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

  const columnDefs = [
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
        return (
          <Link
            to={{
              pathname: `${process.env.PUBLIC_URL}/loandetails/${loanObj.WFID}`,
              state: obj.row.original
            }}
          >
            <Icon.Edit />
          </Link>
        );
      }
    },
    {
      field: "WFID",
      Header: "WFID",
      accessor: "WFID",
      disableFilters: true
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
    {
      name: "WFtaxID",
      field: "WFtaxID",
      Header: "WFtaxID",
      accessor: "WFtaxID"
    },
    {
      field: "createDate",
      Header: "createDate",
      accessor: "createDate"
    },
    {
      field: "R2ID",
      Header: "R2ID",
      accessor: "R2ID"
    },
    {
      field: "LoanApplicationNumber",
      Header: "LoanApplicationNumber",
      accessor: "LoanApplicationNumber",
      disableFilters: true,
    },
    {
      field: "LoanAmount",
      Header: "LoanAmount",
      accessor: "LoanAmount",
      disableFilters: true,
    },
    {
      field: "PrimaryBorrower",
      Header: "PrimaryBorrower",
      accessor: "PrimaryBorrower",
      disableFilters: true
    },
    {
      field: "Address1",
      Header: "Address1",
      accessor: "Address1",
      disableFilters: true,
    },
    {
      field: "Address2",
      Header: "Address2",
      accessor: "Address2",
      disableFilters: true
    }/*,
    {
      field: "brokerList",
      Header: "brokerList",
      accessor: "brokerList"
    }*/
  ];
  
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
  return (
    <React.Fragment>
      <div className="container" style={{marginLeft:"0px", width:"100%", maxWidth:"100%"}}>
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <h3 className="title-center">{headerTitle}</h3>
            <div className="btnCls">
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
