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
      let selOptionSt = Array.from(filterVal).map(o => { return ("'"+o.value+"'")}).filter(Boolean).join(",");
      filterUrl += " and ("+filterClm+" "+multifilterOpr+" ("+selOptionSt+"))";
    } else {
      filterUrl += " and ("+filterClm+" "+filterOpr+" %"+filterVal+"%)";
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

 export { buildSortByUrl, buildPageUrl, buildFilterUrl } ; 