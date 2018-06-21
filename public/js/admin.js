function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
if(getCookie("isLogin")=="user"){
	//alert("鄵你媽一般人");
	document.getElementById("login").href="/logout";
	document.getElementById("login").innerHTML="登出";
	document.getElementById("signup").href="/profile";
	document.getElementById("signup").innerHTML="會員資料";

}
else if(getCookie("isLogin")=="admin"){
	alert("管理者你好");

	//document.location.href="/admin";
}
