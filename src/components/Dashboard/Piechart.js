import React, { useState, useEffect } from "react";
import { Pie } from 'react-chartjs-2';

const PieChart = () => {
    
  const [pieData, setPieData] = React.useState([]);
  const [pieOption, setPieOption] = React.useState("By Quantity");

    useEffect(() => {
      const dataRet = [{
        "broker": "CFSB",
        "qty"   : 30,
        "amount": 25,
      },
      {
        "broker": "ABC Capital Corp.",
        "qty"   : 20,
        "amount": 25,
      },
      {
        "broker": "Asset Enhancement Solutions",
        "qty"   : 30,
        "amount": 25,
      },
      {
        "broker": "Donar Consulting",
        "qty"   : 20,
        "amount": 25,
      },
      {
        "broker": "Funding Forward",
        "qty"   : 40,
        "amount": 25,
      }];
      let labelsArr = [];
      let dataArr = [];
      let labelName = "";
      console.log("pieOption : "+pieOption);
      for(let i=0; i<dataRet.length; i++){
        labelsArr.push(dataRet[i].broker);
        if(pieOption==="By Amount"){
          dataArr.push(parseInt(dataRet[i].amount));
        } else {
          dataArr.push(parseInt(dataRet[i].qty));
        }
      }
      console.log(dataArr);
      const newData = {
        labels: labelsArr,
        datasets: [
          {
            label: '# of Votes',
            data: dataArr,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1,
          },
        ],
      }
      setPieData(newData);
    }, [pieOption]);

    const pieOptionChange = (e) => {
      console.log("pieOptionChange");
      setPieOption(e.target.value);
    }

    return (
      <>
        <div className='header'>
          <h1 className='title'>Pie Chart</h1>
          <div className="col-sm-6">
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">Type</label>
              <div className="col-sm-8">
                <select
                    className="form-control custom-select"
                    name="pieOption"
                    value={pieOption}
                    onChange={pieOptionChange}
                  >
                    <option key="1" value="By Quantity">By Quantity</option>
                    <option key="2" value="By Amount">By Amount</option>       
                </select>
              </div>
            </div>
          </div>
        </div>
        <Pie data={pieData} />
      </>
    )
}

export default PieChart;