import React, { useState, useEffect } from "react";
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const {API_KEY, LoanSummary_Url} = window.constVar;

const PieChart = () => {
    
  const [pieData, setPieData] = React.useState([]);
  const [pieOption, setPieOption] = React.useState("NULLCount");
  const [pieOptionList, setPieOptionList] = React.useState([]);

  const { session_token} = useSelector(state => {
      return {
          ...state.userReducer
      }
  });
    useEffect(() => {
      let ignore = false;
      async function fetchLoanSummary() {
        const options = {
          headers: {
            'X-DreamFactory-API-Key': API_KEY,
            'X-DreamFactory-Session-Token': session_token
          }
        };
        let res = await axios.get(LoanSummary_Url, options);
        console.log(res.data);
        let dataRet = res.data.resource;
        if(dataRet.length>0){
          let obj = dataRet[0];
          const keys = Object.keys(obj);
          let typeListArr = [];
          for (const key of keys) {
            //console.log(key)
            let pieOptionListObj = { value: key,     label: key };
            typeListArr.push(pieOptionListObj);
          }
          setPieOptionList(typeListArr);
        }
        //console.log(pieOptionList);
        //setLoading(false);
        let labelsArr = [];
        let dataArr = [];
        let preDefColorArr = ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)',
                              'rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)',
                              'rgba(153, 102, 255, 0.2)','rgba(153, 90, 255, 0.2)',
                              'rgba(90, 102, 255, 0.2)','rgba(123, 90, 255, 0.2)',
                              'rgba(100, 80, 25, 0.2)','rgba(150, 100, 60, 0.2)',
                              'rgba(190, 99, 140, 0.2)','rgba(250, 100, 255, 0.2)',
                              'rgba(230, 99, 20, 0.2)','rgba(150, 50, 100, 0.2)',
                              'rgba(60, 99, 200, 0.2)','rgba(55, 120, 80, 0.2)'];
        let preDefborderColorArr = ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)','rgba(153, 90, 255, 1)',
                                    'rgba(90, 102, 255, 1)','rgba(123, 90, 255, 1)',
                                    'rgba(100, 80, 25, 1)','rgba(150, 100, 60, 1)',
                                    'rgba(190, 99, 140, 1)','rgba(250, 100, 255, 1)',
                                    'rgba(230, 99, 20, 1)','rgba(150, 50, 100, 1)',
                                    'rgba(60, 99, 200, 1)','rgba(55, 120, 80, 1)'];
        let colorArr = [];
        let borderColorArr = [];
        let labelName = "";
        console.log("pieOption : "+pieOption);
        for(let i=0; i<dataRet.length; i++){
          let tmpObj = dataRet[i];
          for (const [key, value] of Object.entries(tmpObj)) {
            //console.log(`${key}: ${value}`);
            if(key==pieOption){
              dataArr.push(parseInt(value));
            }
          }
          labelsArr.push(tmpObj.broker);
          colorArr.push(preDefColorArr[i]);
          borderColorArr.push(preDefborderColorArr[i]);
        }
        console.log(dataArr);
        const newData = {
          labels: labelsArr,
          datasets: [
            {
              label: '# of Votes',
              data: dataArr,
              backgroundColor: colorArr,
              borderColor: borderColorArr,
              borderWidth: 1,
            },
          ],
          options: {
            //responsive: true,
            //maintainAspectRatio: false
            /*
            tooltips: {
              callbacks: {
                  label: function(tooltipItem, data) {
                      var label = data.datasets[tooltipItem.datasetIndex].label || '';
  
                      if (label) {
                          label += ': ';
                      }
                      label += Math.round(tooltipItem.yLabel * 100) / 100;
                      return "demo";//label;
                  }
              }
            }
            */
          }
        }
        setPieData(newData);
      }
      fetchLoanSummary();
      return () => { ignore = true };
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
                    {pieOptionList.map((option, i) => {
                      if(option.label!=="userName" && option.label!=="broker"){
                        return (
                          <option key={i} value={option.value}>
                            {option.label}
                          </option>
                        )
                      } else {
                        return null;
                      }
                    })}   
                </select>
              </div>
            </div>
          </div>
        </div>
        <Pie data={pieData} height={100} />
      </>
    )
}

export default PieChart;