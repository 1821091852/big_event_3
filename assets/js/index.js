$(function () {
    getUserInfo();
});
// 退出
var layer = layui.layer;
$("#btnLogout").on("click", function () {
    layer.confirm('是否确认退出?', {icon: 3, title:'提示'}, function(index){
        localStorage.removeItem("token");
        location.href = '/login.html';
        layer.close(index);
    });
})
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem
        //     ("token") || ""
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            renderAvator(res.data);
        }
    })
}

function renderAvator(user) {
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    //渲染头像
    if (user.user_pic !== null) {
        $(".layui-nav-img").show().attr('src',user.user_pic);
        $(".text-avator").hide();
    } else {
        $(".layui-nav-img").hide();
        var text =name[0].toUpperCase()
        $(".text-avator").show().html(text);
    }
}