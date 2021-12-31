import React, { useState } from "react";
import ForgivnessListView from "./ForgivnessListView.js";
import * as Icon from "react-feather";
import "./ForgivnessList.css";
import axios from 'axios';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import {buildSortByUrl, buildPageUrl, buildFilterUrl, toCurrency} from './../Functions/functions.js';
import SelectColumnFilter from './../Filter/SelectColumnFilter.js';
//import {API_KEY, Loans_Url, env, SetLoans_Url, Loan_Upload_Doc_Url} from './../../../const';
const {API_KEY, Forgivnesslist_Url, SetMissingLoans_Url} = window.constVar;
//import { BrokerOptions, UnAssocLoanStatusOptions} from './../../../commonVar.js';
const { FrgvStatusOptions} = window.commonVar;

function ForgivnessList(props) {
  
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

  const { forgivnesslist, pageIndex, pageSize, totalCount, sortBy, filters, backToList } = useSelector(state => {
    return {
        ...state.ForgivnessReducer
    }
  });

  //console.log("backToList : "+backToList);

  let columnDefs = [];
  columnDefs.push(
  {
    field: "sba_number",
    Header: "sba_number",
    accessor: "sba_number"
  },
  {
    field: "borrower_name",
    Header: "borrower_name",
    accessor: "borrower_name"
  },
  {
    field: "OriginalLoanAmount",
    Header: "OriginalLoanAmount",
    accessor: "OriginalLoanAmount",
    disableFilters: true,
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
    options:FrgvStatusOptions,
    //editable:true,
    columnType:'list',
    columnOptions:FrgvStatusOptions
  },
  {
    field: "DisbursementDate",
    Header: "DisbursementDate",
    accessor: "DisbursementDate"
    //disableFilters: true,
  },
  {
    field: "EndofCoveredPeriod",
    Header: "EndofCoveredPeriod",
    accessor: "EndofCoveredPeriod"
    //disableFilters: true,
  },
  {
    field: "callernotes",
    Header: "callernotes",
    accessor: "callernotes",
    //editable:true,
    columnType:'text'
  });

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    let oldData = forgivnesslist;
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
      type:'UPDATEFORGIVNESSLIST',
      payload:{
        forgivnesslist:newData
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
  }, [forgivnesslist])

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

      let url = Forgivnesslist_Url;
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
        type:'UPDATEFORGIVNESSLIST',
        payload:{
          pageIndex:pageIndex,
          pageSize:pageSize,
          totalCount:totalCnt,
          sortBy : sortBy,
          filters : filters,
          forgivnesslist:res.data.resource
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

  let headerTitle = "Forgivness List";

  console.log("loans", forgivnesslist);
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
      <ForgivnessListView
        data={forgivnesslist}
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

export default ForgivnessList;
