export default {
    getRedirectURL,
    getLoginURL,
    getBuyerEndPoint,
    getSellerUIEndPoint,
    deleteAllCookies,
    getCookie,
    setCookie,
    get_user,
    "BUYER_PRODUCTS_API": "/products",
    "BUYER_PLACE_ORDER": "/placeorder",
    "BUYER_ORDERS": "/orders",
}

export function getLoginURL() {
    //TODO: Needs to be replaced by Auth0 URL
    return "https://client-systeambiz.auth.us-east-1.amazoncognito.com/login?client_id=7f3c2duj422jsn61eh6op5250s&" +
        "response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri="
}

export function getBuyerEndPoint() {

    if (window.location.href.includes("localhost")){
        return "http://localhost:30081/"

    }else{
        return "https://buyerapi.systeambiz.com/"
    }
}

export function getSellerUIEndPoint() {

    if (window.location.href.includes("localhost")){
        return "http://localhost:30092/"

    }else{
        return "https://seller.systeambiz.com/"
    }
}

export function getRedirectURL() {
    if (window.location.href.includes("localhost")){
        return  "http://localhost:30091"
    }else{
        return "https://systeambiz.com"
    }
}

export function deleteAllCookies() {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf("=");
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function setCookie(cname, cvalue, exdays,path) {
    if(cvalue == undefined)
        cvalue = '';
    if(path == undefined)
        path = '/';
    let d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + "; path="+ path +";";
}

export function get_user(email){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let result = JSON.parse(this.responseText);
            console.info(result);
            setCookie("role",result['role'],1);
        }
    };
    xhttp.open("GET",getBuyerEndPoint() + 'user?email='+getCookie("email") , true);
    xhttp.send(null);
}
