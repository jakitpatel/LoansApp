import React from "react";
import * as Icon from "react-feather";
import Select from 'react-select';

function AmountRangeColumnFilter({
    column: { filterValue = [] , preFilteredRows, setFilter, id, options }
    }) {
    const [value, setValue] = React.useState(filterValue[0] || '');
    const [value2, setValue2] = React.useState(filterValue[1] || '');
    const [opVal, setOpVal] = React.useState(filterValue[2] || '=');
    const [showInputRange, setShowInputRange] = React.useState(false);
    return (
        <>
            <div style={{display: "flex"}}>
                <input
                value={value}
                type="text"
                onChange={(e) => {
                    const val = e.target.value;
                    console.log(val);
                    setValue(e.target.value || undefined);
                    //setFilter(e.target.value || undefined);
                    setFilter([val,value2,opVal]);
                }}
                />
                <select value={opVal} style={{width:"62px"}} className="custom-select"  onChange={(e) => {
                        const val = e.target.value;
                        console.log(val);
                        setOpVal(val);
                        if(val==="><"){
                            console.log("Show Input Range field");
                            setShowInputRange(true);
                        } else {
                            setShowInputRange(false);
                        }
                        setFilter([value,value2,val]);
                    }}>
                    <option value="=">=</option>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                    <option value="><">&gt;&lt;</option>
                </select>
                {/*<Select
                    //styles={styles}
                    //autoFocus={true}
                    //menuPosition={'fixed'}
                    //menuPortalTarget={document.body}
                    //menuIsOpen={true}
                    value={opVal || '='}
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="custom_select"
                    onChange={selectedOption => {
                        console.log(selectedOption);
                        setOpVal(selectedOption);
                        let allValues = selectedOption;
                        //setFilter(allValues && allValues .length ? allValues : undefined);
                        setFilter(allValues);
                    }}
                    />
                {/*value ?
                <button onClick={(e) => {
                    console.log("Clear Date");
                    setValue("");
                    setFilter("");
                }}><Icon.XCircle /></button>
                : null */}
            </div>
            { showInputRange ?
            <div style={{display: "flex"}}>
                <input
                value={value2}
                type="text"
                onChange={(e) => {
                    const val = e.target.value;
                    console.log(val);
                    setValue2(e.target.value || undefined);
                    //setFilter(e.target.value || undefined);
                    setFilter([value,val,opVal]);
                }}
                />
            </div>
             : null }
        </>
    );
}

export default AmountRangeColumnFilter;