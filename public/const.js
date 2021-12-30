//let env = "DEVLOCAL";
let env = "DEV";
//let env = "PROD";
 
let API_URL = "";
let API_CONTRIB_URL = "";

if (env === 'DEV') {
    API_URL   = "https://3gl57cxtbj.execute-api.us-east-1.amazonaws.com/cfsb_ppp1/";  // For Production Env via aws GW
    API_CONTRIB_URL = "https://8ty30aj3ki.execute-api.us-east-1.amazonaws.com/cfsb_contrib/";
} else if(env === 'PROD'){
    API_URL   = "https://gqqfj8a5u7.execute-api.us-east-1.amazonaws.com/cfsb-ppp-prod/";  // For Production Env via aws GW
    API_CONTRIB_URL = "https://8ty30aj3ki.execute-api.us-east-1.amazonaws.com/cfsb_contrib/";
} else if(env === 'DEVLOCAL'){
    API_URL = "http://localhost:3001/";  // For Local Env, Don't Modify
    API_CONTRIB_URL = "http://localhost:3001/";  // For Local Env, Don't Modify
}

window.constVar = {
    env       : env,
    API_URL   : API_URL,
    API_KEY   : "1171aab5665fc0afdb0a9e580e6fba236e9ed45e6944d63dc1aaa67e3e3f8bf9",
    Login_Url : API_URL+"brokersession",
    Internal_Login_Url : API_URL+"internalsession",
    Loans_Url    : API_URL+"getppp",
    LoansD_Url   : API_URL+"getforgivness",
    SetLoans_Url : API_URL+"setloanstatus",
    SetLoansForgive_Url : API_URL+"setforgivness",
    Loan_Upload_Doc_Url  : API_CONTRIB_URL+"contrib",
    //Loan_Upload_Doc_Url  : API_CONTRIB_URL+"contrib.json",
    LoanDetails_Url      : API_URL+"getLoanDetails?filter=",
    MissingLoans_Url     : API_URL+"getassociates",
    SetMissingLoans_Url  : API_URL+"setwebform",
    Forgivnesslist_Url   : API_URL+"getExternalForgivness",  
    Usr_Permission_Url   : API_URL+"ppploans/permission?filter=",
    LoanSummary_Url      : API_URL+"getsummary",
    LoansDocs_Url        : API_URL+"getdocuments",
    LoanDetails_Url_DEV      : API_URL+"getLoanDetails",  // For Local Env, Don't Modify
    Usr_Permission_Url_DEV   : API_URL+"wireAppPermission",  // For Local Env, Don't Modify
    DocReader_Url        : API_CONTRIB_URL+"getdoc"
}