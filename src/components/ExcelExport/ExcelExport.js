import React from "react";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function ExcelExport(props) {
    let {data} = props;

    const filterColumns = (data) => {
        // Get column names
        const columns = Object.keys(data[0]);

        // Remove by key (firstname)
        //const filterColsByKey = columns.filter(c => c !== 'firstname');

        // OR use the below line instead of the above if you want to filter by index
        // columns.shift()
        console.log(columns);
        return columns // OR return columns
    };

    return (
        <ExcelFile filename={props.excelFile} hideElement={true}>
            <ExcelSheet data={props.data} name={props.sheetName}>
            {
                filterColumns(props.data).map((col)=> {
                    return <ExcelColumn label={col} value={col}/>
                })
            }
            </ExcelSheet>
        </ExcelFile>
    );
}

export default ExcelExport;