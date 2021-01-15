$(function () {
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })

    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })

    //3.自定义验证规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            var pwd = $(".reg-box [name = password]").val()
            if (value !== pwd) {
                return "两次输入的不一致"
            }
        }
    });

    // 4.注册表单提交
    var layer =layui.layer
    $("#form_reg").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: {
                username:$(".reg-box [name=username]").val(),
                password:$(".reg-box [name=password]").val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //返回处理
                layer.msg("注册成功请登录");
                // 切换到登录界面
                $("#link_login").click();
                $("#form_reg")[0].reset();
            }
        })
    })

    // 5.登录表单提交
    $("#form_login").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data:$(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //提示
                layer.msg("登录成功");
                // 保存token
                localStorage.setItem("token", res.token);
                //跳转
                location.href = "/index.html";
            }
        })
    })
    
})