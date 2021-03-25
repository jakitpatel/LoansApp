import React, { useState, useEffect } from "react";
//import { useParams } from "react-router-dom";
import SummaryTableView from "./SummaryTableView.js";
//import * as Icon from "react-feather";
import "./SummaryTable.css";
import axios from 'axios';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import ToggleButtonGroupControlled from './ToggleBtnGroup.js';
import {toCurrency} from './../../Functions/functions.js';
import SelectColumnFilter from './../../Filter/SelectColumnFilter.js';
//import {API_KEY, Loans_Url, env, SetLoans_Url, Loan_Upload_Doc_Url} from './../../../const';
const {API_KEY, LoanSummary_Url} = window.constVar;

function SummaryTable(props) {
  
  // We'll start our table without any data
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);
  const [isRefresh, setIsRefresh] = useState(false);
  const [optionValue, setOptionValue] = useState([1]);
  const dispatch = useDispatch();

  const { session_token, teamInt, uid, isInternalUser } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  let todayDate = moment().format('LLLL');
  let columnDefs = [];
    
    columnDefs.push({
        Header: todayDate,
        className: 'dateHeader',
        columns:[{
            Header: ' ',
            columns: [{
                Header: 'Row Labels',
                accessor: 'broker',
                style: {
                    fontWeight: 'bolder',
                }
            }]
        }]
    },
    {
        Header: 'Bucket C - SBA Approved (Funding Stage) - Syed',
        className: 'lightGreenHeader',
        columns:[{
            Header: 'Approved By SBA',
            columns: [
                {
                  Header: '# Loans',
                  accessor: 'loanDoneCount',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  }
                },
                {
                  Header: '$ Amount',
                  accessor: 'loanDoneSum',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  },
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
                }
              ]
        }]
    },
    {
        Header: 'Bucket B - Error Team - Steve & Adiv',
        className: 'lightOrangeHeader',
        columns:[{
            Header: 'Failed Validation',
            columns: [
                {
                  Header: '# Loans',
                  accessor: 'FailedValidationCount',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  }
                },
                {
                  Header: '$ Amount',
                  accessor: 'FailedValidationSum',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  },
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
                }]
        },{
            Header: 'Further Research Required',
            columns: [
                {
                  Header: '# Loans',
                  accessor: 'FurtherResearchReqCount',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  }
                },
                {
                  Header: '$ Amount',
                  accessor: 'FurtherResearchReqSum',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  },
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
                }]
        },{
            Header: 'Not Approved by SBA',
            columns: [
                {
                  Header: '# Loans',
                  accessor: 'NotApprovedbySBACount',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  }
                },
                {
                  Header: '$ Amount',
                  accessor: 'NotApprovedbySBASum',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  },
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
                }]
        },{
            Header: 'Pending Validation',
            columns: [
                {
                  Header: '# Loans',
                  accessor: 'PendingValidationCount',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  }
                },
                {
                  Header: '$ Amount',
                  accessor: 'PendingValidationSum',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  },
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
                }]
        },{
            Header: 'Submission Failed',
            columns: [
                {
                  Header: '# Loans',
                  accessor: 'SubmissionFailedCount',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  }
                },
                {
                  Header: '$ Amount',
                  accessor: 'SubmissionFailedSum',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  },
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
                }]
        },{
            Header: 'Under Review',
            columns: [
                {
                  Header: '# Loans',
                  accessor: 'UnderReviewCount',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  }
                },
                {
                  Header: '$ Amount',
                  accessor: 'UnderReviewSum',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  },
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
                }]
        }]
    },
    {
        Header: 'Bucket A - Initial Deal Reviews - Denice',
        className: 'lightBlueHeader',
        columns:[{
            Header: '(blank)',
            columns: [
                {
                  Header: '# Loans',
                  accessor: 'BlankCount',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  }
                },
                {
                  Header: '$ Amount',
                  accessor: 'BlankSum',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  },
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
                }
              ]
        }]
    },
    {
        Header: ' ',
        columns:[{
            Header: 'Total',
            columns: [
                {
                  Header: '# Loans',
                  accessor: 'TotalCount',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  }
                },
                {
                  Header: '$ Amount',
                  accessor: 'TotalSum',
                  className: 'user',
                  style: {
                    fontWeight: 'bolder',
                  },
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
                }
              ]
        }]
    });
  
  const fetchData = React.useCallback(() => {
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

      let url = LoanSummary_Url;
      if(optionValue===2){
        url += "?filter=yesterday";
      } else if(optionValue===3){
        url += "?filter=delta";
      }
      let res = await axios.get(url, options);
      let dataVal = res.data.resource;
      let newData = [];
      console.log(res.data.resource);
      let totalObj = {};
      for(let i=0; i<dataVal.length; i++){
        let tmpObj = dataVal[i];
        if(dataVal[i].broker === "GrandTotal"){
            totalObj = tmpObj;
        } else {
            newData.push(tmpObj);
        }
      }
      newData.push(totalObj);
      setData(newData);
      //console.log(res.data);
      //setLoading(false);
    }
    // Only update the data if this is the latest fetch
    if (fetchId === fetchIdRef.current) {
      fetchLoanList();
    }
  }, [ dispatch, session_token, optionValue]);

  let disCmp =
    /*loading === true ? (
      <h3> LOADING... </h3>
    ) :*/ (
      <SummaryTableView
        data={data}
        columnDefs={columnDefs}
        fetchData={fetchData}
        loading={loading}
        isRefresh={isRefresh}
        setIsRefresh={setIsRefresh}
      />
    );

  /*
     * The second argument that will be passed to
     * `handleChange` from `ToggleButtonGroup`
     * is the SyntheticEvent object, but we are
     * not using it in this example so we will omit it.
     */
  const handleChangeOption = (val) => {
    console.log("Change Toggle Option");
    setOptionValue(val);
    setIsRefresh(!isRefresh);
  }

  return (
    <React.Fragment>
      <div className="container" style={{marginLeft:"0px", width:"100%", maxWidth:"100%"}}>
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <div style={{paddingLeft: "1rem"}}>
              <ToggleButtonGroupControlled optionValue={optionValue} setOptionValue={setOptionValue} handleChangeOption={handleChangeOption} />
            </div>
            {disCmp}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default SummaryTable;
