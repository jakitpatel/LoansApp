import React, { useState, useEffect } from "react";
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

const {API_KEY, LoanSummary_Url} = window.constVar;

const PieChart = () => {
    
  const [pieData, setPieData] = React.useState([]);
  const [pieOption, setPieOption] = React.useState("By Quantity");

  const { session_token} = useSelector(state => {
      return {
          ...state.userReducer
      }
  });
    useEffect(() => {
      console.log("ACHFileRecord UseEffect");
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
        //console.log(res.data.resource);
        let dataRet = res.data.resource;
        //console.log(achFileRecArray);
        //setLoading(false);
        /*const dataRet = [{
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
        */
        let labelsArr = [];
        let dataArr = [];
        let preDefColorArr = ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)',
                              'rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)',
                              'rgba(153, 102, 255, 0.2)','rgba(153, 90, 255, 0.2)',
                              'rgba(90, 102, 255, 0.2)','rgba(123, 90, 255, 0.2)',
                              'rgba(100, 80, 255, 0.2)','rgba(150, 100, 255, 0.2)'];
        let colorArr = [];
        let labelName = "";
        console.log("pieOption : "+pieOption);
        for(let i=0; i<dataRet.length; i++){
          labelsArr.push(dataRet[i].broker);
          if(pieOption==="By Amount"){
            dataArr.push(parseInt(dataRet[i].Sum));
          } else {
            dataArr.push(parseInt(dataRet[i].Count));
          }
          colorArr.push(preDefColorArr[i]);
        }
        console.log(dataArr);
        const newData = {
          labels: labelsArr,
          datasets: [
            {
              label: '# of Votes',
              data: dataArr,
              backgroundColor: colorArr,
              borderColor: colorArr,
              borderWidth: 1,
            },
          ],
          /*options: {
            responsive: true,
            maintainAspectRatio: false
          }*/
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
                    <option key="1" value="By Quantity">By Quantity</option>
                    <option key="2" value="By Amount">By Amount</option>       
                </select>
              </div>
            </div>
          </div>
        </div>
        <div style={{height: "300px"}}>
          <Pie data={pieData} height={100} />
        </div>
      </>
    )
}

export default PieChart;