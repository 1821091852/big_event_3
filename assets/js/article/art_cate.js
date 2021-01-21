$(function () {
    //1.文章类别列表显示
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                console.log(res);
                var str = template("tpl-table", res);
                $("tbody").html(str);
            }
        })
    }
    //2.显示添加文章分类列表
    var layer = layui.layer;
    $("#btnAdd").on("click", function () {
        // 弹出层的open按钮
        indexAdd=layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        })
    })
    //3.提交文章新添加的分类(事件委托)
    var indexAdd = null;
    $('body').on("submit", '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg("文章类别添加成功");
                layer.close(indexAdd)
            } 
        })
    })

    //4.修改分类(事件委托)
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on("click", '.btn-edit', function () {
        //利用layui构架,显示修改文章类别区域
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });
        //获取Id,发送ajax
        var Id = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            // cates后面的 / 是为了字符串和变量
            url: "/my/article/cates/" + Id,
            success: function (res) {
                form.val("form-edit",res.data)
            }
        })
    })

    //5.修改-提交
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染页面里的数据
                initArtCateList();
                layer.msg("文章类别更新成功");
                layer.close(indexEdit)
            }
        })
    })
    //6.删除
    $("tbody").on("click", ".btn-delete", function () {
        var Id = $(this).attr("data-id");
        // layui框架里弹出层的询问方法
        layer.confirm('是否确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                url: '/my/article/deletecate/'+Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList();
                    layer.msg("文章类别删除成功")
                    layer.close(index);
                }
            })
            
        });
    })

})