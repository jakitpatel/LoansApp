import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Listview from "./../../Listview/Listview";
import * as Icon from "react-feather";
import "./WireDetailForm.css";
import { useSelector } from 'react-redux';

function WireRemittanceList(props) {
  //let history = useHistory();
  const [loading, setLoading] = useState(false);

  const { wireDetailsObj, wireRemittanceList } = useSelector(state => {
    return {
        ...state.wireDetailsReducer
    }
  });
  //const [wireRemittanceList, setWireRemittanceList] = useState([]);

  let { wireID } = props;
  console.log("wireID : "+wireID);

  const columnDefs = [
    {
      Header: "View",
      show : true, 
      width: 40,
      id: 'colView',
      accessor: row => row.attrbuiteName,
      filterable: false, // Overrides the table option
      Cell: obj => {
        //console.log("Edit");
        //console.log(obj.row);
        let wireRemittanceObj = obj.row.original;
        return (
          <Link
            to={{
              pathname: `${process.env.PUBLIC_URL}/WireRemittanceDetails/${wireRemittanceObj.wireRemittanceID}`,
              state: obj.row.original
            }}
          >
            <Icon.Edit />
          </Link>
        );
      }
    },
    {
      headerName: "wireRemittanceID",
      field: "wireRemittanceID",
      Header: "wireRemittanceID",
      accessor: "wireRemittanceID"
    },
    {
      headerName: "remittanceOrignatorIDType",
      field: "remittanceOrignatorIDType",
      Header: "remittanceOrignatorIDType",
      accessor: "remittanceOrignatorIDType"
    },
    {
      name: "remittanceOrignatorIDCode",
      field: "remittanceOrignatorIDCode",
      Header: "remittanceOrignatorIDCode",
      accessor: "remittanceOrignatorIDCode"
    },
    {
      name: "remittanceOrignatorIDNumber",
      field: "remittanceOrignatorIDNumber",
      Header: "remittanceOrignatorIDNumber",
      accessor: "remittanceOrignatorIDNumber"
    },
    {
      headerName: "remittanceOrignatorIDIssuer",
      field: "remittanceOrignatorIDIssuer",
      Header: "remittanceOrignatorIDIssuer",
      accessor: "remittanceOrignatorIDIssuer"
    },
    {
      name: "remittanceOrignatorDatePlaceBirth",
      field: "remittanceOrignatorDatePlaceBirth",
      Header: "remittanceOrignatorDatePlaceBirth",
      accessor: "remittanceOrignatorDatePlaceBirth"
    }/*,
    {
      name: "remittanceOrignatorEAddress",
      field: "remittanceOrignatorEAddress",
      Header: "remittanceOrignatorEAddress",
      accessor: "remittanceOrignatorEAddress"
    },
    {
      name: "remittanceOrignatorName",
      field: "remittanceOrignatorName",
      Header: "remittanceOrignatorName",
      accessor: "remittanceOrignatorName"
    }*/
  ];
  /*
  useEffect(() => {
    console.log("Wire Remittance List UseEffect");
    let ignore = false;
    setWireRemittanceList(wireDetailsObj.wireRemittance_by_wireID);
    console.log("wireRemittanceList");
    console.log(wireRemittanceList);
    return () => { ignore = true };
  }, []);
  */
  console.log("Properties", props);
  const initialSortState = {}; 
  let disCmp =
    loading === true ? (
      <h3> LOADING... </h3>
    ) : (
      <Listview
        items={wireRemittanceList}
        columnDefs={columnDefs}
        sortBy={initialSortState}
      />
    );
  
  return (
    <React.Fragment>
        {wireRemittanceList.length !== 0 ? (
          <div className="container" style={{marginLeft:"0px", paddingLeft: "0px", paddingRight: "0px"}}>
            <div className="row">
              <div className="col-md-offset-3">
                <h3 className="title-center">WireRemittance List</h3>
                {disCmp}
              </div>
            </div>
          </div>
          ) : null
      }
    </React.Fragment>
  );
}

export default WireRemittanceList;
