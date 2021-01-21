$(function () {
    //1.初始化类别
    var form = layui.form;
    var layer = layui.layer;
    initCate();
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //赋值，渲染form
                var htmlStr = template("tpl-cate", res);
                $('[name=cate_id]').html(htmlStr)
                //通知layui重新渲染
                form.render();
            }
        })
    }
    // 2.初始化富文本编辑器
    initEditor()
    // 3.1  初始化图片裁剪器
    var $image = $('#image')

    // 3.2 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3 初始化裁剪区域
    $image.cropper(options)

    //4.点击按钮，选择图片
    $("#btnChooseImage").on("click", function () {
        $("#coverfile").click()
    })
    //5.设置图片
    $("#coverfile").change(function (e) {
        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
        //前端非空校验
        if (file == undefined) {
            return ;
        }
        // 2. 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 3. 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    //6.设置状态
    var state = "已发布";
    $('#btnSave2').on("click", function () {
        state = "草稿";
    })
    //7.添加文章
    $("#form-pub").on("submit", function (e) {
        e.preventDefault();
        //收集数据，渲染到状态列表
        var fd = new FormData(this);
        fd.append("state", state)
        //放入图片
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
        })
        // 将 Canvas 画布上的内容，转化为文件对象
        .toBlob(function(blob) {       
            // cover_img
            fd.append("cover_img", blob);
            // ... 是扩展运算符
            // console.log(...fd);
            // ajax必须在这个函数里面发送
            publishArticle(fd);
        })  
    })
    //8.封装添加文字的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            //FormData 类型数据ajax提交，需设置两个false
            contentType: false,
            processData: false,
            
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("发布文章成功");
                //跳转
                // location.href='/article/art_list.html'
                // 需要刷新主页 index.html,否则控制台会报错
                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click();
                }, 1500);
            }
        })
    }
})