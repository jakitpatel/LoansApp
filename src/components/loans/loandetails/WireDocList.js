import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Listview from "./../../Listview/Listview";
import * as Icon from "react-feather";
import "./WireDetailForm.css";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {WireDocList_Url} from './../../../const';
import {API_KEY} from './../../../const';

function WireDocList(props) {
  //let history = useHistory();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { session_token } = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  const { wireDocList } = useSelector(state => {
    return {
        ...state.wireDocReducer
    }
  });

  let { wireID } = props;
  console.log("wireID : "+wireID);

  const columnDefs = [
    /*{
      Header: "View",
      show : true, 
      width: 40,
      id: 'colView',
      accessor: row => row.attrbuiteName,
      filterable: false, // Overrides the table option
      Cell: obj => {
        //console.log("Edit");
        //console.log(obj.row);
        let achAddendaRecordObj = obj.row.original;
        return (
          <Link
            to={{
              pathname: `${process.env.PUBLIC_URL}/ACHDetails/${achAddendaRecordObj.entryDetailID}`,
              state: obj.row.original
            }}
          >
            <Icon.Edit />
          </Link>
        );
      }
    },*/
    {
      headerName: "wireRemittanceDocID",
      field: "wireRemittanceDocID",
      Header: "wireRemittanceDocID",
      accessor: "wireRemittanceDocID"
    },
    {
      headerName: "primaryDocumentTypeCode",
      field: "primaryDocumentTypeCode",
      Header: "primaryDocumentTypeCode",
      accessor: "primaryDocumentTypeCode"
    },
    {
      name: "primaryDocumentProprietary",
      field: "primaryDocumentProprietary",
      Header: "primaryDocumentProprietary",
      accessor: "primaryDocumentProprietary"
    },
    {
      name: "primaryDocumentID",
      field: "primaryDocumentID",
      Header: "primaryDocumentID",
      accessor: "primaryDocumentID"
    },
    {
      headerName: "primaryDocumentIssuer",
      field: "primaryDocumentIssuer",
      Header: "primaryDocumentIssuer",
      accessor: "primaryDocumentIssuer"
    },
    {
      name: "actualPaidCurrency",
      field: "actualPaidCurrency",
      Header: "actualPaidCurrency",
      accessor: "actualPaidCurrency"
    },
    {
      name: "actualPaidAmount",
      field: "actualPaidAmount",
      Header: "actualPaidAmount",
      accessor: "actualPaidAmount"
    },
    {
      name: "grossAmountCurrency",
      field: "grossAmountCurrency",
      Header: "grossAmountCurrency",
      accessor: "grossAmountCurrency"
    },
    {
      name: "grossAmountAmount",
      field: "grossAmountAmount",
      Header: "grossAmountAmount",
      accessor: "grossAmountAmount"
    },
    {
      name: "discountCurrency",
      field: "discountCurrency",
      Header: "discountCurrency",
      accessor: "discountCurrency"
    },
    {
      name: "discountAmount",
      field: "discountAmount",
      Header: "discountAmount",
      accessor: "discountAmount"
    },
    {
      name: "adjustmentReason",
      field: "adjustmentReason",
      Header: "adjustmentReason",
      accessor: "adjustmentReason"
    },
    {
      name: "creditDebit",
      field: "creditDebit",
      Header: "creditDebit",
      accessor: "creditDebit"
    },
    {
      name: "adjustmentCurrency",
      field: "adjustmentCurrency",
      Header: "adjustmentCurrency",
      accessor: "adjustmentCurrency"
    },
    {
      name: "adjustmentAmount",
      field: "adjustmentAmount",
      Header: "adjustmentAmount",
      accessor: "adjustmentAmount"
    },
    {
      name: "adjustmentInfo",
      field: "adjustmentInfo",
      Header: "adjustmentInfo",
      accessor: "adjustmentInfo"
    },
    {
      name: "remitanceDate",
      field: "remitanceDate",
      Header: "remitanceDate",
      accessor: "remitanceDate"
    },
    {
      name: "secondaryDocumentTypeCode",
      field: "secondaryDocumentTypeCode",
      Header: "secondaryDocumentTypeCode",
      accessor: "secondaryDocumentTypeCode"
    },
    {
      name: "secondaryDocumentProprietary",
      field: "secondaryDocumentProprietary",
      Header: "secondaryDocumentProprietary",
      accessor: "secondaryDocumentProprietary"
    },
    {
      name: "secondaryDocumentID",
      field: "secondaryDocumentID",
      Header: "secondaryDocumentID",
      accessor: "secondaryDocumentID"
    },
    {
      name: "secondaryDocumentIssuer",
      field: "secondaryDocumentIssuer",
      Header: "secondaryDocumentIssuer",
      accessor: "secondaryDocumentIssuer"
    },
    {
      name: "freeText1",
      field: "freeText1",
      Header: "freeText1",
      accessor: "freeText1"
    },
    {
      name: "freeText2",
      field: "freeText2",
      Header: "freeText2",
      accessor: "freeText2"
    },
    {
      name: "freeText3",
      field: "freeText3",
      Header: "freeText3",
      accessor: "freeText3"
    }
  ];
  
  /*
  useEffect(() => {
    console.log("Wire Doc List UseEffect");
    let ignore = false;
    async function fetchWireDocList() {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': session_token
        }
      };
      //let res = await axios.get(WireDocList_Url, options);
      let res = await axios.get(WireDocList_Url+ "wireID='"+wireID+"'", options);
      //console.log(res.data);
      console.log(res.data.resource);
      let wireDocList = res.data.resource;
      console.log(wireDocList);
      dispatch({
        type:'SETWireDocList',
        payload:wireDocList
      });
      setLoading(false);
      //setAchdetailentry(achDetailEntryArray);
    }
    fetchWireDocList();
    return () => { ignore = true };
  }, [wireID, dispatch, session_token]);
  */

  console.log("Properties", props);
  const initialSortState = {}; 
  let disCmp =
    loading === true ? (
      <h3> LOADING... </h3>
    ) : (
      <Listview
        items={wireDocList}
        columnDefs={columnDefs}
        sortBy={initialSortState}
      />
    );
  
  return (
    <React.Fragment>
        {wireDocList.length !== 0 ? (
          <div className="container" style={{marginLeft:"0px", paddingLeft: "0px", paddingRight: "0px"}}>
            <div className="row">
              <div className="col-md-offset-3">
                <h3 className="title-center">WireDoc List</h3>
                {disCmp}
              </div>
            </div>
          </div>
          ) : null
      }
    </React.Fragment>
  );
}

export default WireDocList;
