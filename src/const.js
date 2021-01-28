export const API_KEY = "36fda24fe5588fa4285ac6c6c2fdfbdb6b6bc9834699774c9bf777f706d05a88";

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
let Login_Url = API_URL+"login"; // For Local Env
let Loans_Url = API_URL+"v_fullReport";  // For Local Env
let LoanDetails_Url = API_URL+"getLoanDetails";  // For Local Env
let Usr_Permission_Url = API_URL+"wireAppPermission";  // For Local Env

if(env==="PROD"){
    API_URL   = "https://devnycapi01.comfed.local/api/v2/";  // For Production Env
    Login_Url = API_URL+"user/session?service=cfsb_ldap";  // For Production Env
    Loans_Url = API_URL+"v_fullReport";  // For Local Env
    LoanDetails_Url = API_URL+"getLoanDetails?filter=";  // For Production Env
    Usr_Permission_Url = API_URL+"cfsb_sqlserver/_table/wireAppPermission?filter=";  // For Production Env
}

export { API_URL, Login_Url, Loans_Url, LoanDetails_Url, Usr_Permission_Url };