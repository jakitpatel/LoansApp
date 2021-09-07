const toCurrency = (val) => {
  return new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(val);
}

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
    if(Array.isArray(filterVal) && filterVal.length > 0 && filterClm==="OriginalLoanAmount"){
      console.log(filterVal);
      let val1 = filterVal[0];
      let val2 = filterVal[1];
      let filterOpr = filterVal[2];
      val1 = val1.replace("$", "");
      val1 = val1.replace(",", "");
      if(filterOpr === "><"){
        val2 = val2.replace("$", "");
        val2 = val2.replace(",", "");
        if(val1!=="" && val1!==null){
          filterUrl += " and ("+filterClm+" > "+val1+")";
        }
        if(val2!=="" && val2!==null){
          filterUrl += " and ("+filterClm+" < "+val2+")";
        }
      } else {
        if(val1!=="" && val1!==null){
          filterUrl += " and ("+filterClm+" "+filterOpr+" "+val1+")";
        }
      }
    } else if(Array.isArray(filterVal) && filterVal.length > 0){
      let multifilterOpr = "IN";
      let isNullFlag = false;
      let selOptionSt = Array.from(filterVal).map(o => { 
        if(o.value==="is NULL"){
          isNullFlag = true;
        } else {
          return ("'"+o.value+"'");
        }
      }).filter(Boolean).join(",");
      if(selOptionSt.length > 0 && isNullFlag===false){
        filterUrl += " and ("+filterClm+" "+multifilterOpr+" ("+selOptionSt+"))";
      }
      ///
      if(selOptionSt.length > 0 && isNullFlag===true){
        filterUrl += " and (("+filterClm+" "+multifilterOpr+" ("+selOptionSt+"))";
        filterUrl += " or ("+filterClm+" is null))";
      }
      ////
      if(isNullFlag===true && selOptionSt.length === 0){
        filterUrl += " and ("+filterClm+" is null)";
      }
    } else {
      if(filterClm==="ALDLoanApplicationNumberOnly" || filterClm==="TaxID" || filterClm==="Loan_Account_Number"){
        filterOpr = "=";
        filterUrl += " and ("+filterClm+" "+filterOpr+" "+filterVal+")";
      } else if(filterClm==="SBALoanNumber" && filterObj.filterOpr===">" && filterObj.defFilter==="teamc"){
        filterOpr = filterObj.filterOpr;
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
        //'ReviewerAssigned' : data.ReviewerAssigned,
        //'MentorAssigned'   : data.MentorAssigned,
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

 const buildExternalLoanExportAllDetailList = (loanArray) => {
  let newDetailArray = loanArray.map((data) => {
      let amt = data.R2_LoanAmount;
      if(amt!==null) {
        amt = new Intl.NumberFormat('en-US',{ style: 'currency', currency: 'USD' }).format(amt);
        data.R2_LoanAmount = amt;
      }
      delete data.bankPayout;
      delete data.ReviewerAssigned;
      delete data.MentorAssigned;
      delete data.TaxID;
      delete data.R2_TaxID;
      delete data.WFtaxID;
      delete data.MentorEmail;
      delete data.teambmember;
      delete data.teambmember;
      return data;
  });
  return newDetailArray;
 }

 export { buildSortByUrl, buildPageUrl, buildFilterUrl, buildExternalLoanExportDetailList, toCurrency, buildExternalLoanExportAllDetailList } ; 