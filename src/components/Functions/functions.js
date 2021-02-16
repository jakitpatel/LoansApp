const buildSortByUrl = (sortArr) => {
    let sortUrl = "";
    sortArr.forEach(function(sortObj) {
      let sortDir = "ASC";
      if(sortObj.desc){
        sortDir = "DESC";
      }
      sortUrl += "&order="+sortObj.id+" "+sortDir;
    });
    return sortUrl;
 }

 const buildFilterUrl = (filterArr) => {
  let filterUrl = "";
  filterArr.forEach(function(filterObj) {
    let filterOpr = "=";
    filterOpr = "like";
    let filterClm = filterObj.id;
    let filterVal = filterObj.value;
    if(Array.isArray(filterVal) && filterVal.length > 0){
      let multifilterOpr = "IN";
      let isNullFlag = false;
      let selOptionSt = Array.from(filterVal).map(o => { 
        if(o.value==="is NULL"){
          isNullFlag = true;
        } else {
          return ("'"+o.value+"'");
        }
      }).filter(Boolean).join(",");
      if(selOptionSt.length > 0){
        filterUrl += " and ("+filterClm+" "+multifilterOpr+" ("+selOptionSt+"))";
      }
      if(isNullFlag===true && selOptionSt.length > 0){
        filterUrl += " or ("+filterClm+" is null)";
      }
      if(isNullFlag===true && selOptionSt.length == 0){
        filterUrl += " and ("+filterClm+" is null)";
      }
    } else {
      if(filterClm==="ALDLoanApplicationNumberOnly"){
        filterOpr = "=";
        filterUrl += " and ("+filterClm+" "+filterOpr+" "+filterVal+")";
      } else {
        filterUrl += " and ("+filterClm+" "+filterOpr+" %"+filterVal+"%)";
      }
    }
  });
  if(filterUrl.length>0){
    filterUrl = filterUrl.substring(5);
  }
  filterUrl = encodeURIComponent(filterUrl);
  console.log("filterUrl : "+filterUrl);
  return filterUrl;
}

 const buildPageUrl = (pageSize, pageIndex) => {
    let pageUrl = "";
    //let startRow = (pageSize * pageIndex) + 1;
    let startRow = pageSize * pageIndex;
    //const endRow = startRow + pageSize;
    pageUrl += "?limit="+pageSize;
    pageUrl += "&offset="+startRow;
    return pageUrl;
 }

 const buildExternalLoanExportDetailList = (loanArray) => {
  let newDetailArray = loanArray.map((data) => {
      let amt = data.R2_LoanAmount;
      if(amt!==null) {
        amt = new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(amt);
      }
      return {
        'ALDLoanApplicationNumberOnly' : data.ALDLoanApplicationNumberOnly,
        'BusinessName' : data.PrimaryBorrower,
        'R2_LoanAmount': amt,
        'applicationStatus' : data.applicationStatus,
        'StatusAComments' : data.StatusAComments,
        'LastModifyDate' : data.LastModifyDate,
        'AdobeSigned2483':data.AdobeSigned2483,
        'SBAApprovalDate':data.SBAApprovalDate,
        'SBALoanNumber': data.SBALoanNumber,
        'SBAStatus' : data.SBAStatus,
        'ErrorMessage' : data.ErrorMessage,
        'AdobeSigned147':data.AdobeSigned147,
        'FirstDrawLoanAmount':data.FirstDrawLoanAmount,
        'FirstDrawSbaLoanNumber':data.FirstDrawSbaLoanNumber,
        'ReviewerAssigned' : data.ReviewerAssigned,
        'MentorAssigned'   : data.MentorAssigned,
        'broker'      : data.broker,
        'R2_LoanOfficer' : data.R2_LoanOfficer,
        'Phone' : data.Phone,
        'Email' : data.Email,
        'brokerRep'      : data.brokerRep,
        'brokerComments' : data.brokerComments
      }
  });
  return newDetailArray;
 }

 export { buildSortByUrl, buildPageUrl, buildFilterUrl, buildExternalLoanExportDetailList } ; 