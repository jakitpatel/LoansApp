import React from "react";
import { useTable, useSortBy, useAsyncDebounce } from 'react-table';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import './SummaryTableView.css';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      input.editor-field {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0rem;
  }
  .dateHeader {
    background-color: yellow;
  }
  .lightGreenHeader {
    background-color: #A0CD63;
  }
  .lightOrangeHeader {
    background-color: #F6C242;
  }
  .lightBlueHeader {
    background-color: #4CAEEA
  }
  .row1Seg {
    background-color: #9FCBDA
  }
`

// Create a default prop getter
const defaultPropGetter = () => ({})

function Table({
  getRowProps = defaultPropGetter,
  getTbdProps, 
  columns, 
  data, 
  fetchData,
  loading,
  isRefresh,
  setIsRefresh,
  teamInt,
  totalCount,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter
}) {

  const location = useLocation();

  // Use the state and functions returned from useTable to build your UI

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows, //-> we change 'rows' to 'page'
    //page,
    prepareRow,
  } = useTable({
    getTbdProps,
    columns,
    data
  },
  useSortBy)


  // Debounce our onFetchData call for 100ms
  const onFetchDataDebounced = useAsyncDebounce(fetchData, 100);

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    //fetchData({ pageIndex, pageSize });
    
    onFetchDataDebounced();
  }, [ teamInt, isRefresh, setIsRefresh, onFetchDataDebounced, location.key]);

  return (
    <>
    <div className="tableContainer">
    <table className="stickyHeaderTable" key={isRefresh} {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th className="stickyHeader" width={column.width} {...column.getHeaderProps([
                {
                  className: column.className,
                  style: column.style,
                },
                getColumnProps(column),
                getHeaderProps(column),
              ])}>
                <div>
                  <span {...column.getSortByToggleProps()}>
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                </div>
                {/* Render the columns filter UI */}
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </th>
              ))}
              {/*
              <th width={column.width} {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render('Header')}
              <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
              <div>{column.canFilter ? column.render('Filter') : null}</div>
              </th>
              ))}
              */}
          </tr>
        ))}
      </thead>
      <tbody  {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps(getRowProps(row))}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps({
                  className: cell.column.className,
                  style: cell.column.style
                })}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
    </div>
    </>
  )
}

 function SummaryTableView(props) {
   //console.log(props.items);
   //const data = React.useMemo(() => props.items, [props.items])
   const columns = React.useMemo(() => props.columnDefs,[props.columnDefs])

   let { initialState, loading, fetchData, pageCount, 
    data, isRefresh, setIsRefresh, pageState, totalCount } = props;
    
    //console.log("List Table : isRefresh :"+isRefresh);
   return (
    <Styles>
      {/*<ReactTooltip delayShow={200} id='wireListTtip' place="right" className="tooltipcls" textColor="#000000" backgroundColor="#f4f4f4" effect="float" multiline={true} />*/}
      <Table 
        columns={columns} 
        data={data}
        initialState={initialState}
        pageState={pageState}
        fetchData={fetchData}
        loading={loading}
        pageCount={pageCount}
        isRefresh={isRefresh}
        setIsRefresh={setIsRefresh}
        totalCount={totalCount}
        getHeaderProps={column => {
          //console.log(column);
          let color = null;
          if(column.Header==="Row Labels"){
            color = "#7C9148";
          } else if(column.Header==="Approved By SBA" || column.id==="loanDoneCount" || column.id==="loanDoneSum"){
            color = "#A0CD63";
          } else if(column.Header==="Failed Validation" || column.id==="FailedValidationCount" || column.id==="FailedValidationSum" || column.Header==="Not Approved by SBA" || column.id==="NotApprovedbySBACount" || column.id==="NotApprovedbySBASum"){
            color = "#EB3223";
          } else if(column.Header==="Further Research Required" || column.id==="FurtherResearchReqCount" || column.id==="FurtherResearchReqSum" 
          || column.Header==="Pending Validation" || column.id==="PendingValidationCount" || column.id==="PendingValidationSum"
          || column.Header==="Submission Failed" || column.id==="SubmissionFailedCount" || column.id==="SubmissionFailedSum"){
            color = "#F6C242";
          } else if(column.Header==="Under Review" || column.id==="UnderReviewCount" || column.id==="UnderReviewSum"){
            color = "#FFFE54";
          } else if(column.Header==="(blank)" || column.id==="BlankCount" || column.id==="BlankSum"){
            color = "#4CAEEA";
          } else if(column.Header==="Total" || column.id==="TotalCount" || column.id==="TotalSum"){
            color = "#7C9148";
          }
          if(color!==null){
              return ({
                //onClick: () => alert('Header!'),
                style: {
                  background: color
                }
              })
          } else {
            return ({
            })
          }
          }
        }
        getColumnProps={column => ({
          //onClick: () => alert('Column!'),
        })}
        getRowProps={row => {
          let color = "white";
          if(row.index===0 || row.index===1){
            color = "#9FCBDA";
          } else if(row.index===2){
            color = "#91B1DA";
          } else if(row.index===3 || row.index===4 || row.index===12){
            color = "#CAC0D8";
          } else if(row.index===5){
            color = "#D09996";
          } else if(row.index===6 || row.index===7 || row.index===8 || row.index===10 || row.index===11){
            color = "#C8D5A1";
          }else if(row.index===9){
            color = "#F6D6B8";
          } else if(row.index===13){
            color = "#E3DFEB";
          } 
          
          let fontweight = "normal";
          if(row.original.broker === "GrandTotal"){
            fontweight = "bolder";
          }
          return ({
            style: {
              fontWeight: fontweight,
              background: color
            },
          })
        }
        }
        />
    </Styles>
  )
 }

 export default SummaryTableView;