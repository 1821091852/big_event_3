//1.开发环境
var baseURL = "http://api-breakingnews-web.itheima.net"
// //2.测试环境
// var baseURL = "http://api-breakingnews-web.itheima.net"
// //3.实际环境
// var baseURL = "http://api-breakingnews-web.itheima.net"
$.ajaxPrefilter(function (params) {
    params.url = baseURL + params.url;

    //4.身份认证
    if (params.url.indexOf("/my/") !== -1) {
        params.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    }
    params.complete = function (res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON;
        if (obj.status == 1 && obj.message == "身份认证失败！"){
            localStorage.removeItem("token");
            location.href = "/login.html";
        }
    }
})