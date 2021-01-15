//1.开发环境
var baseURL = "http://api-breakingnews-web.itheima.net"
// //2.测试环境
// var baseURL = "http://api-breakingnews-web.itheima.net"
// //3.实际环境
// var baseURL = "http://api-breakingnews-web.itheima.net"
$.ajaxPrefilter(function (res) {
    res.url = baseURL + res.url;
})