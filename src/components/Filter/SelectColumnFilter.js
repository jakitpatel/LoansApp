import React, { useState, useEffect } from "react";
import Select from 'react-select';
// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  /*
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])
  */
  const options = [
    { value: '',     label: 'All' },
    { value: 'NULL', label: 'NULL' },
    { value: 'Further Research Required', label: 'Further Research Required' },
    { value: 'Submission Failed', label: 'Submission Failed' },
    { value: 'Failed Validation',  label: 'Failed Validation' },
    { value: 'Pending Validation', label: 'Pending Validation' },
    { value: 'Approved by SBA', label: 'Approved by SBA' },
    { value: 'Not Approved by SBA', label: 'Not Approved by SBA' },
    { value: 'Under Review',    label: 'Under Review' }
  ]
  // Render a multi-select box
  return (
    <Select
      isMulti
      value={filterValue || ''}
      options={options}
      hideSelectedOptions={false}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={selectedOption => {
        console.log(selectedOption);
        let allFound = false;
        let allArr = null;
        for (var j = 0; j < selectedOption.length; j++){
          if(selectedOption[j].label === "All"){
            allFound = true;
            //allArr.push(selectedOption[j]);
          }
        }          
        let allValues = selectedOption;
        if(allFound === true){
          allValues = allArr;
        }
        console.log(allValues);
        //setFilter(allValues && allValues .length ? allValues : undefined);
        setFilter(allValues);
      }}
    />
    )
    {/*<select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
      */}

}

export default SelectColumnFilter;