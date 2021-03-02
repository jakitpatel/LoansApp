export const API_KEY = "1171aab5665fc0afdb0a9e580e6fba236e9ed45e6944d63dc1aaa67e3e3f8bf9";

let env = "DEV";
//let env = "PROD";
console.log(process.env.NODE_ENV);
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    env = "DEV";
} else {
    // production code
    env = "PROD";
}

let API_URL = "http://localhost:3001/";  // For Local Env
let API_CONTRIB_URL = "http://localhost:3001/";  // For Local Env

let Login_Url = API_URL+"login"; // For Local Env
let Internal_Login_Url = API_URL+"login";  // For Production Env
//let Loans_Url = API_URL+"v_fullReport";  // For Local Env
let Loans_Url = API_URL+"getppp";  // For Local Env
let SetLoans_Url = API_URL+"setloanstatus";

let LoanDetails_Url     = API_URL+"getLoanDetails";  // For Local Env
let Usr_Permission_Url  = API_URL+"wireAppPermission";  // For Local Env
let Loan_Upload_Doc_Url = API_CONTRIB_URL+"contrib"; // For Local Env

if(env==="PROD"){
    API_URL   = "https://3gl57cxtbj.execute-api.us-east-1.amazonaws.com/cfsb_ppp1/";  // For Production Env via aws GW
    API_CONTRIB_URL = "https://8ty30aj3ki.execute-api.us-east-1.amazonaws.com/cfsb_contrib/";
    Login_Url = API_URL+"brokersession";  // For Production Env
    Internal_Login_Url = API_URL+"internalsession";  // For Production Env
    Loans_Url = API_URL+"getppp";
    SetLoans_Url = API_URL+"setloanstatus";
    LoanDetails_Url = API_URL+"getLoanDetails?filter=";  // For Production Env
    Usr_Permission_Url = API_URL+"ppploans/permission?filter=";  // For Production Env
    Loan_Upload_Doc_Url = API_CONTRIB_URL+"contrib";  // For Production Env
 /*
    //API_URL   = "https://api-int.cfsb.com/api/v2/";  // For Production Env
    API_URL   = "https://ixx8qndz5a.execute-api.us-east-1.amazonaws.com/csfb_ppp/";  // For Production Env via aws GW
  //API_URL   = "https://ixx8qndz5a.execute-api.us-east-1.amazonaws.com/cfsb-test/";  // For Production Env via aws GW

     //API_URL = "https://vct9b3qbf8.execute-api.us-east-1.amazonaws.com/cfsb-test/";
//https://ixx8qndz5a.execute-api.us-east-1.amazonaws.com/csfb_ppp/{proxy+}
    Login_Url = API_URL+"user/session";  // For Production Env
    Internal_Login_Url = API_URL+"user/session?service=cfsb_ldap";  // For Production Env
    
  //Login_Url = API_URL+"session";  // For Production Env
    //Loans_Url = API_URL+"cfsb_sqlPPPserver/_table/v_fullReport"; 
    Loans_Url = API_URL+"getPPP"; 
   // For Local Env
   //  Loans_Url = API_URL+"ppploans/loans";  // For Local Env

    SetLoans_Url = API_URL+"setloandata";    

    LoanDetails_Url = API_URL+"getLoanDetails?filter=";  // For Production Env
    Usr_Permission_Url = API_URL+"ppploans/permission?filter=";  // For Production Env
*/
}    

export { API_URL, Login_Url, Internal_Login_Url, Loans_Url, LoanDetails_Url, Usr_Permission_Url, SetLoans_Url, 
         Loan_Upload_Doc_Url };