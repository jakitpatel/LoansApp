import React from "react";
import Select from 'react-select';
// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, options },
}) {
  // Calculate the options for filtering
  //console.log("Getting Option");
  //console.log(filterValue);
  
  const styles = {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menu: (css) => ({
      ...css,
      width: "250px",
      zIndex: 9999
    })
  };

  // Render a multi-select box
  return (
    <Select
      isMulti
      styles={styles}
      //autoFocus={true}
      //menuPosition={'fixed'}
      //menuPortalTarget={document.body}
      //menuIsOpen={true}
      value={filterValue || ''}
      options={options}
      hideSelectedOptions={false}
      className="basic-multi-select"
      classNamePrefix="custom_select"
      onChange={selectedOption => {
        //console.log(selectedOption);
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
        //console.log(allValues);
        //setFilter(allValues && allValues .length ? allValues : undefined);
        setFilter(allValues);
      }}
    />
    )
}

export default SelectColumnFilter;